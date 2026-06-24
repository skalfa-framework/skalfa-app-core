"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const colors = {
    default: "\x1b[0m", // default
    start: "\x1b[32m", // green
    info: "\x1b[36m", // cyan
    error: "\x1b[31m", // red
    warning: "\x1b[33m", // yellow
    cavity: "\x1b[34m", // blue
    cavityError: "\x1b[31m", // red
    socket: "\x1b[35m", // magenta
    socketError: "\x1b[31m", // red
};
const prefixes = {
    start: "START",
    info: "INFO",
    error: "ERROR",
    warning: "WARNING",
    cavity: "CAVITY",
    socket: "SOCKET",
    cavityError: "CAVITY ERROR",
    socketError: "SOCKET ERROR",
};
function log(type, ...msg) {
    const color = colors[type];
    const prefix = prefixes[type];
    console.log(`${color}[${prefix}]${colors.default}`, ...msg);
}
exports.logger = {
    start: (...msg) => log("start", ...msg),
    info: (...msg) => log("info", ...msg),
    error: (...msg) => log("error", ...msg),
    warning: (...msg) => log("warning", ...msg),
    cavity: (...msg) => log("cavity", ...msg),
    cavityError: (...msg) => log("cavityError", ...msg),
    socket: (...msg) => log("socket", ...msg),
    socketError: (...msg) => log("socketError", ...msg),
};
