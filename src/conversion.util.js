"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversion = void 0;
const moment_1 = __importDefault(require("moment"));
exports.conversion = {
    // =============================>
    // ## Conversion: String formatter 
    // =============================>
    strSnake(value, delimiter = "_") {
        return toWords(value).join(delimiter);
    },
    strSlug(value, delimiter = "-") {
        return toWords(value).join(delimiter);
    },
    strCamel(value, delimiter = "") {
        return toWords(value).map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join(delimiter);
    },
    strPascal(value, delimiter = "") {
        return toWords(value).map(w => w[0].toUpperCase() + w.slice(1)).join(delimiter);
    },
    strPlural(value) {
        const match = value.match(/^(.*?)([A-Za-z]+)$/);
        if (!match)
            return value;
        const [, prefix, word] = match;
        if (word.endsWith("y") && !/[aeiou]y$/i.test(word)) {
            return prefix + word.slice(0, -1) + "ies";
        }
        if (!word.endsWith("s"))
            return prefix + word + "s";
        return value;
    },
    strSingular(value) {
        return value
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .replace(/\s+/g, "");
    },
    // ==============================> 
    // ## currency formatter 
    // ==============================> 
    currency: (value, locale = "id-ID", currency = "IDR") => { const val = Math.trunc(value); return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val); },
    // ==============================> 
    // ## date formatter 
    // ==============================> 
    date: (date, format = "DD MMM YYYY") => (0, moment_1.default)(date).format(format),
};
function toWords(value) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-\s]+/g, " ")
        .trim()
        .toLowerCase()
        .split(" ")
        .filter(Boolean);
}
