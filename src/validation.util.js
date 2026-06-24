"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidation = exports.validation = void 0;
const react_1 = require("react");
const validator_1 = __importDefault(require("validator"));
const langs_1 = require("./langs");
// ==========================>
// ## Validation core
// ==========================>
exports.validation = {
    // =========================>
    // ## Normalize rules (string | array)
    // =========================>
    normalizeRules: (rules) => {
        if (!rules)
            return [];
        if (Array.isArray(rules))
            return rules;
        return rules.split("|");
    },
    // =========================>
    // ## Check value match of rules
    // =========================>
    check: ({ value, rules }) => {
        const parsedRules = exports.validation.normalizeRules(rules);
        const strValue = String(value ?? "").trim();
        for (const rule of parsedRules) {
            const [name, param] = rule.split(":");
            switch (name) {
                // === BASIC ===
                case "required":
                    if (!value || (Array.isArray(value) && value.length === 0)) {
                        return { valid: false, message: langs_1.validationLangs.required };
                    }
                    break;
                case "numeric":
                    if (!validator_1.default.isNumeric(strValue)) {
                        return { valid: false, message: langs_1.validationLangs.numeric || "Harus berupa angka" };
                    }
                    break;
                case "email":
                    if (!validator_1.default.isEmail(strValue)) {
                        return { valid: false, message: langs_1.validationLangs.email };
                    }
                    break;
                case "url":
                    if (!validator_1.default.isURL(strValue)) {
                        return { valid: false, message: langs_1.validationLangs.url || "Harus berupa URL yang valid" };
                    }
                    break;
                case "date":
                    if (!validator_1.default.isDate(strValue)) {
                        return { valid: false, message: "Tanggal tidak valid" };
                    }
                    break;
                // === LENGTH ===
                case "min": {
                    const min = parseInt(param || "0");
                    if (!validator_1.default.isLength(strValue, { min })) {
                        return { valid: false, message: langs_1.validationLangs.min.replace(/@min/g, String(min)) };
                    }
                    break;
                }
                case "max": {
                    const max = parseInt(param || "0");
                    if (!validator_1.default.isLength(strValue, { max })) {
                        return { valid: false, message: langs_1.validationLangs.max.replace(/@max/g, String(max)) };
                    }
                    break;
                }
                case "between": {
                    const [minVal, maxVal] = (param || "0,0").split(",").map(Number);
                    if (!validator_1.default.isLength(strValue, { min: minVal, max: maxVal })) {
                        return {
                            valid: false,
                            message: langs_1.validationLangs.min_max
                                .replace(/@min/g, String(minVal))
                                .replace(/@max/g, String(maxVal)),
                        };
                    }
                    break;
                }
                // === IN / NOT IN ===
                case "in": {
                    const allowed = (param || "").split(",");
                    if (!allowed.includes(strValue)) {
                        return { valid: false, message: `${langs_1.validationLangs.in} ${allowed.join(", ")}` };
                    }
                    break;
                }
                case "not_in": {
                    const notAllowed = (param || "").split(",");
                    if (notAllowed.includes(strValue)) {
                        return { valid: false, message: `${langs_1.validationLangs.not_in} ${notAllowed.join(", ")}` };
                    }
                    break;
                }
                // === REGEX ===
                case "regex":
                    try {
                        const pattern = new RegExp(param || "");
                        if (!pattern.test(strValue)) {
                            return { valid: false, message: langs_1.validationLangs.regex || "Format tidak sesuai" };
                        }
                    }
                    catch {
                        return { valid: false, message: "Regex rule tidak valid" };
                    }
                    break;
            }
        }
        return { valid: true, message: "" };
    },
    // =========================>
    // ## Check has rules
    // =========================>
    hasRules: (rules, ruleName) => {
        if (!rules || !ruleName)
            return false;
        const parsed = exports.validation.normalizeRules(rules).map(r => r.split(":")[0]);
        if (Array.isArray(ruleName))
            return ruleName.every(r => parsed.includes(r));
        return parsed.includes(ruleName);
    },
    // =========================>
    // ## get rule param
    // =========================>
    getRules: (rules, ruleName) => {
        const found = exports.validation.normalizeRules(rules).find(r => r.startsWith(ruleName + ":"));
        return found ? found.split(":")[1] : undefined;
    }
};
// =========================>
// ## Check validation Hook
// =========================>
const useValidation = (value = "", rules = "", includes = "", sleep = false) => {
    const [message, setMessage] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        if (rules && !sleep) {
            const { valid, message } = exports.validation.check({ value, rules });
            setMessage(valid ? "" : message);
        }
        else {
            setMessage("");
        }
    }, [value, rules, sleep]);
    (0, react_1.useEffect)(() => {
        if (includes)
            setMessage(includes);
    }, [includes]);
    return [message, setMessage];
};
exports.useValidation = useValidation;
