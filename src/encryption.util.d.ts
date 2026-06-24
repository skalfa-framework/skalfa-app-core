type AlgorithmType = "AES" | "TripleDES" | "SHA256" | "SHA512" | "MD5";
export declare const encryption: {
    set: (data: any, key?: string, algorithm?: AlgorithmType) => string;
    get: (data: string, key?: string, algorithm?: AlgorithmType) => any;
};
export {};
