"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pcn = exports.cn = void 0;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
// ==============================>
// ## Merge class name
// ==============================>
const cn = (...classes) => (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(classes));
exports.cn = cn;
// ==============================>
// ## Parse class name with custom prefix
// ==============================>
const pcn = (className, prefix, pseudoClass) => {
    const classes = className.split(" ");
    const matchedClasses = classes.filter((cls) => {
        const [clsPrefix, ...rest] = cls.split("::");
        if (rest.length === 0 && (prefix === "input" || prefix === "base"))
            return true;
        if (rest.length > 0 && clsPrefix === prefix) {
            if (pseudoClass) {
                const [pseudo] = rest.join("::").split(":");
                return pseudo === pseudoClass;
            }
            return true;
        }
        return false;
    }).map((cls) => {
        const [clsPrefix, ...rest] = cls.split("::");
        if (rest.length > 0 && clsPrefix === prefix) {
            const classNameWithoutPrefix = rest.join("::");
            if (pseudoClass) {
                return classNameWithoutPrefix.split(":").slice(1).join(":");
            }
            else {
                if (/^(?!.*\b\w+:).*$/.test(classNameWithoutPrefix)) {
                    return classNameWithoutPrefix;
                }
                else {
                    return "";
                }
            }
        }
        if (rest.length === 0 && (prefix === "input" || prefix === "base"))
            return cls;
        return "";
    }).filter(Boolean);
    return matchedClasses.join(" ");
};
exports.pcn = pcn;
