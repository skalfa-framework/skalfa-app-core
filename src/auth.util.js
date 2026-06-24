"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const navigation_1 = require("next/navigation");
const js_cookie_1 = __importDefault(require("js-cookie"));
const encryption_util_1 = require("./encryption.util");
exports.auth = {
    // ==============================>
    // ## Path of login page
    // ==============================>
    PATH_LOGIN: '/auth/login',
    // ==============================>
    // ## Path of home page
    // ==============================>
    PATH_BASE: '/',
    // ==============================>
    // ## Access token expired (days)
    // ==============================>
    ACCESS_TOKEN_EXPIRED: 7,
    // ==============================>
    // ## Name of cookie access token
    // ==============================>
    ACCESS_TOKEN_NAME: String(process.env.NEXT_PUBLIC_APP_NAME || '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '.user.token',
    // ==============================>
    // ## set access token to cookie
    // ==============================>
    setAccessToken: (token, expired) => js_cookie_1.default.set(exports.auth.ACCESS_TOKEN_NAME, token ? encryption_util_1.encryption.set(token) : "", { expires: expired || exports.auth.ACCESS_TOKEN_EXPIRED, secure: true }),
    // ==============================>
    // ## get access token from cookie
    // ==============================>
    getAccessToken: () => encryption_util_1.encryption.get(js_cookie_1.default.get(exports.auth.ACCESS_TOKEN_NAME) || ""),
    // ==============================>
    // ## delete access token from cookie
    // ==============================>
    deleteAccessToken: () => js_cookie_1.default.remove(exports.auth.ACCESS_TOKEN_NAME),
    // ==============================>
    // ## Check auth
    // ==============================>
    check: () => (!js_cookie_1.default.get(exports.auth.ACCESS_TOKEN_NAME)) && (0, navigation_1.redirect)(exports.auth.PATH_LOGIN),
};
