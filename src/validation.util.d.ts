type Rule = "required" | "string" | "numeric" | "boolean" | "email" | "url" | "date" | "confirmed" | `min:` | `min:${number}` | `max:` | `max:${number}` | `between:` | `between:${number},${number}` | `in:` | `in:${string}` | `not_in:` | `not_in:${string}` | `same:` | `same:${string}` | `different:` | `different:${string}` | `regex:` | `regex:${string}` | `unique:` | `unique:${string},${string}` | `exists:` | `exists:${string},${string}`;
export type ValidationRules = Rule[] | string;
export type ValidationHelperPropsType = {
    value: string | string[] | number | number[] | Date | Date[] | File | File[] | null | object | boolean | (string | number)[];
    rules?: ValidationRules;
};
export type ValidationHelperResults = {
    valid: boolean;
    message: string;
};
export declare const validation: {
    normalizeRules: (rules?: Rule[] | string) => Rule[];
    check: ({ value, rules }: ValidationHelperPropsType) => ValidationHelperResults;
    hasRules: (rules?: Rule[] | string, ruleName?: string | string[]) => boolean;
    getRules: (rules: Rule[] | string, ruleName: string) => string | undefined;
};
export declare const useValidation: (value?: any, rules?: Rule[] | string, includes?: string, sleep?: boolean) => [string, (message: string) => void];
export {};
