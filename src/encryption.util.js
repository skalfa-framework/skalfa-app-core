"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryption = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
exports.encryption = {
    // ==============================>
    // ## Encryption data 
    // ==============================>
    set: (data, key = process.env.NEXT_PUBLIC_APP_KEY || "", algorithm = "AES") => {
        const text = typeof data === "string" ? data : JSON.stringify(data);
        let encrypted;
        switch (algorithm) {
            case "AES":
                encrypted = crypto_js_1.default.AES.encrypt(text, key).toString();
                break;
            case "TripleDES":
                encrypted = crypto_js_1.default.TripleDES.encrypt(text, key).toString();
                break;
            case "SHA256":
                encrypted = crypto_js_1.default.SHA256(text).toString(crypto_js_1.default.enc.Hex);
                break;
            case "SHA512":
                encrypted = crypto_js_1.default.SHA512(text).toString(crypto_js_1.default.enc.Hex);
                break;
            case "MD5":
                encrypted = crypto_js_1.default.MD5(text).toString(crypto_js_1.default.enc.Hex);
                break;
            default: throw new Error(`Unsupported algorithm: ${algorithm}`);
        }
        if (["SHA256", "SHA512", "MD5"].includes(algorithm))
            return encrypted;
        const encData = crypto_js_1.default.enc.Base64.stringify(crypto_js_1.default.enc.Utf8.parse(encrypted));
        return encData;
    },
    // ==============================>
    // ## Decryption data 
    // ==============================>
    get: (data, key = process.env.NEXT_PUBLIC_APP_KEY || "", algorithm = "AES") => {
        if (["SHA256", "SHA512", "MD5"].includes(algorithm))
            throw new Error(`${algorithm} is a one-way hash and cannot be decrypted.`);
        const decData = crypto_js_1.default.enc.Base64.parse(data).toString(crypto_js_1.default.enc.Utf8);
        let decrypted;
        switch (algorithm) {
            case "AES":
                decrypted = crypto_js_1.default.AES.decrypt(decData, key).toString(crypto_js_1.default.enc.Utf8);
                break;
            case "TripleDES":
                decrypted = crypto_js_1.default.TripleDES.decrypt(decData, key).toString(crypto_js_1.default.enc.Utf8);
                break;
            default: throw new Error(`Unsupported algorithm: ${algorithm}`);
        }
        try {
            return JSON.parse(decrypted);
        }
        catch {
            return decrypted;
        }
    }
};
