export declare const conversion: {
    strSnake(value: string, delimiter?: string): string;
    strSlug(value: string, delimiter?: string): string;
    strCamel(value: string, delimiter?: string): string;
    strPascal(value: string, delimiter?: string): string;
    strPlural(value: string): string;
    strSingular(value: string): string;
    currency: (value: number, locale?: string, currency?: string) => string;
    date: (date: string, format?: string) => string;
};
