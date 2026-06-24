"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcut = void 0;
const handlers = new Map();
exports.shortcut = {
    register: (key, handler, description) => {
        handlers.set(key, { key, handler, description });
    },
    unregister: (key) => handlers.delete(key),
    list: () => Array.from(handlers.values()),
    init: () => {
        window.addEventListener("keydown", (e) => {
            const target = e.target;
            if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable)
                return;
            const combo = [e.ctrlKey && "ctrl", e.shiftKey && "shift", e.altKey && "alt", e.key.toLowerCase()].filter(Boolean).join("+");
            const meta = handlers.get(combo);
            if (meta) {
                e.preventDefault();
                e.stopPropagation();
                meta.handler(e);
            }
        }, true);
    }
};
