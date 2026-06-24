export declare const auth: {
    PATH_LOGIN: string;
    PATH_BASE: string;
    ACCESS_TOKEN_EXPIRED: number;
    ACCESS_TOKEN_NAME: string;
    setAccessToken: (token: string | null, expired?: number) => string | undefined;
    getAccessToken: () => any;
    deleteAccessToken: () => void;
    check: () => false;
};
