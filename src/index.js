"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLazySearch = exports.useResponsive = void 0;
exports.useKeyboardOpen = useKeyboardOpen;
const react_1 = require("react");
// ==============================>
// ## Export all from core utils
// ==============================>
__exportStar(require("./api.util"), exports);
__exportStar(require("./auth.util"), exports);
__exportStar(require("./cavity.util"), exports);
__exportStar(require("./encryption.util"), exports);
__exportStar(require("./cn.util"), exports);
__exportStar(require("./form.util"), exports);
__exportStar(require("./resource.util"), exports);
__exportStar(require("./table.util"), exports);
__exportStar(require("./validation.util"), exports);
__exportStar(require("./conversion.util"), exports);
__exportStar(require("./shortcut.util"), exports);
__exportStar(require("./commands/logger"), exports);
__exportStar(require("./registry"), exports);
// ==============================>
// ## Detect device size
// ==============================>
const useResponsive = () => {
    const [windowSize, setWindowSize] = (0, react_1.useState)({ width: 0, height: 0 });
    (0, react_1.useEffect)(() => {
        if (typeof window === "undefined")
            return;
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return {
        isXs: windowSize.width < 640,
        isSm: windowSize.width < 768,
        isMd: windowSize.width < 1024,
        isLg: windowSize.width < 1280,
        isXl: windowSize.width >= 1280,
        isMobile: windowSize.width < 768,
        isTablet: windowSize.width >= 768 && windowSize.width < 1024,
        isDesktop: windowSize.width >= 1024,
        width: windowSize.width,
        height: windowSize.height,
    };
};
exports.useResponsive = useResponsive;
// ==============================>
// ## Detect keyboard open
// ==============================>
function useKeyboardOpen() {
    const [isKeyboardOpen, setIsKeyboardOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const windowHeight = window.innerHeight;
                setIsKeyboardOpen(viewportHeight < windowHeight);
            }
        };
        window.visualViewport?.addEventListener("resize", handleResize);
        return () => window.visualViewport?.removeEventListener("resize", handleResize);
    }, []);
    return isKeyboardOpen;
}
// ==============================>
// ## Search with typing reference
// ==============================>
const useLazySearch = (keyword) => {
    const [keywordSearch, setKeywordSearch] = (0, react_1.useState)("");
    const [doSearch, setDoSearch] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (keyword != undefined) {
            const delaySearch = setTimeout(() => setDoSearch(!doSearch), 500);
            return () => clearTimeout(delaySearch);
        }
    }, [keyword]);
    (0, react_1.useEffect)(() => setKeywordSearch(keyword), [doSearch]);
    return [keywordSearch];
};
exports.useLazySearch = useLazySearch;
