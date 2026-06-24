"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cavity = void 0;
const registry_1 = require("./registry");
const logger_1 = require("./commands/logger");
const name = String(process.env.NEXT_PUBLIC_APP_NAME || "").toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") + ".cavity";
const storeName = "cache";
const version = 1;
const subscriptions = new Set();
let registered = false;
function getSocket() {
    const s = registry_1.registry.get("socket");
    if (s && process.env.NEXT_PUBLIC_SOCKET_URL) {
        return s.connect();
    }
    return null;
}
// ==============================>
// ## Init indexDb
// ==============================>
async function idb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "key" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
exports.cavity = {
    // ==============================>
    // ## Set cache to indexDb
    // ==============================>
    set: async ({ key, data, expired }) => {
        const db = await idb();
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const item = {
            key,
            expired: new Date().getTime() + expired * 60 * 1000,
            data,
        };
        store.put(item);
        return tx.commit;
    },
    // ==============================>
    // ## Get cache from indexDb
    // ==============================>
    get: async (key) => {
        const db = await idb();
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        return new Promise((resolve) => {
            const request = store.get(key);
            request.onsuccess = () => {
                const item = request.result;
                if (!item)
                    return resolve({ message: "Record not found!", data: [] });
                if (item.expired > Date.now()) {
                    resolve(item.data);
                }
                else {
                    const deleteTx = db.transaction(storeName, "readwrite");
                    deleteTx.objectStore(storeName).delete(key);
                    resolve({ message: "Record not found!", data: [] });
                }
            };
            request.onerror = () => resolve({ message: "Error!", data: [] });
        });
    },
    // ==============================>
    // ## Remove cache from indexDb
    // ==============================>
    delete: async (key) => {
        const db = await idb();
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.delete(key);
        return tx.commit;
    },
    socket: {
        register: () => {
            const socket = getSocket();
            if (registered || !socket)
                return;
            registered = true;
            socket.on("cache:invalidate", async ({ key }) => {
                await exports.cavity.delete(key);
            });
            socket.on("connect", () => {
                logger_1.logger.cavity("WS connected:", socket.id);
                subscriptions.forEach((key) => exports.cavity.socket.subscribe(key));
            });
            socket.on("disconnect", (reason) => {
                logger_1.logger.cavityError("WS disconnected:", reason);
            });
        },
        subscribe(key) {
            const socket = getSocket();
            if (!socket?.connected)
                return;
            if (subscriptions.has(key))
                return;
            subscriptions.add(key);
            socket.emit("cache:subscribe", { key });
        },
        unsubscribe(key) {
            const socket = getSocket();
            if (!socket?.connected)
                return;
            if (!subscriptions.has(key))
                return;
            subscriptions.delete(key);
            socket.emit("cache:unsubscribe", { key });
        },
        invalidate(key) {
            const socket = getSocket();
            if (!socket?.connected)
                return;
            socket.emit("cache:invalidate", { key });
        },
    }
};
