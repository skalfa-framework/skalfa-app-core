import validator from "validator"
import { validationLangs } from "./validation.langs"
import { getLang } from "@skalfa/skalfa-lang"

type Rule =
  | "required"
  | "string"
  | "numeric"
  | "boolean"
  | "email"
  | "url"
  | "date"
  | "confirmed"
  | `min:`
  | `min:${number}`
  | `max:`
  | `max:${number}`
  | `between:`
  | `between:${number},${number}`
  | `in:`
  | `in:${string}`
  | `not_in:`
  | `not_in:${string}`
  | `same:`
  | `same:${string}`
  | `different:`
  | `different:${string}`
  | `regex:`
  | `regex:${string}`
  | `unique:`
  | `unique:${string},${string}`
  | `exists:`
  | `exists:${string},${string}`

export type ValidationRules = Rule[] | string

export type ValidationHelperPropsType = {
  value:
    | string
    | string[]
    | number
    | number[]
    | Date
    | Date[]
    | File
    | File[]
    | null
    | object
    | boolean
    | (string | number)[]
  rules?: ValidationRules
}

export type ValidationHelperResults = {
  valid    :  boolean
  message  :  string
}

// ==========================>
// ## Validation core
// ==========================>
export const validation = {
  // =========================>
  // ## Normalize rules (string | array)
  // =========================>
  normalizeRules: (rules?: Rule[] | string): Rule[] => {
    if (!rules) return []
    if (Array.isArray(rules)) return rules
    return rules.split("|") as Rule[]
  },

  // =========================>
  // ## Check value match of rules
  // =========================>
  check: ({ value, rules }: ValidationHelperPropsType): ValidationHelperResults => {
    const parsedRules = validation.normalizeRules(rules)
    const strValue = String(value ?? "").trim()
    const l = getLang()

    for (const rule of parsedRules) {
      const [name, param] = rule.split(":") as [string, string | undefined]

      switch (name) {
        // === BASIC ===
        case "required":
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return { valid: false, message: l.validation.required() }
          }
          break

        case "numeric":
          if (!validator.isNumeric(strValue)) {
            return { valid: false, message: l.validation.numeric() }
          }
          break

        case "email":
          if (!validator.isEmail(strValue)) {
            return { valid: false, message: l.validation.email() }
          }
          break

        case "url":
          if (!validator.isURL(strValue)) {
            return { valid: false, message: l.validation.url() }
          }
          break

        case "date":
          if (!validator.isDate(strValue)) {
            return { valid: false, message: l.validation.regex ? l.validation.regex() : "Tanggal tidak valid" }
          }
          break

        // === LENGTH ===
        case "min": {
          const min = parseInt(param || "0")
          if (!validator.isLength(strValue, { min })) {
            return { valid: false, message: l.validation.min({ min }) }
          }
          break
        }

        case "max": {
          const max = parseInt(param || "0")
          if (!validator.isLength(strValue, { max })) {
            return { valid: false, message: l.validation.max({ max }) }
          }
          break
        }

        case "between": {
          const [minVal, maxVal] = (param || "0,0").split(",").map(Number)
          if (!validator.isLength(strValue, { min: minVal, max: maxVal })) {
            return {
              valid: false,
              message: l.validation.min_max({ min: minVal, max: maxVal }),
            }
          }
          break
        }

        // === IN / NOT IN ===
        case "in": {
          const allowed = (param || "").split(",")
          if (!allowed.includes(strValue)) {
            return { valid: false, message: l.validation.in({ keywords: allowed.join(", ") }) }
          }
          break
        }

        case "not_in": {
          const notAllowed = (param || "").split(",")
          if (notAllowed.includes(strValue)) {
            return { valid: false, message: l.validation.not_in({ keywords: notAllowed.join(", ") }) }
          }
          break
        }

        // === REGEX ===
        case "regex":
          try {
            const pattern = new RegExp(param || "")
            if (!pattern.test(strValue)) {
              return { valid: false, message: l.validation.regex() }
            }
          } catch {
            return { valid: false, message: "Regex rule tidak valid" }
          }
          break
      }
    }

    return { valid: true, message: "" }
  },

  // =========================>
  // ## Check has rules
  // =========================>
  hasRules: (rules?: Rule[] | string, ruleName?: string | string[]): boolean => {
    if (!rules || !ruleName) return false
    const parsed = validation.normalizeRules(rules).map(r => r.split(":")[0])
    if (Array.isArray(ruleName)) return ruleName.every(r => parsed.includes(r))
    return parsed.includes(ruleName)
  },

  // =========================>
  // ## get rule param
  // =========================>
  getRules: (rules: Rule[] | string, ruleName: string): string | undefined => {
    const found = validation.normalizeRules(rules).find(r => r.startsWith(ruleName + ":"))
    return found ? found.split(":")[1] : undefined
  }
}

