type CavityType = {
    key: string;
    data: any;
    expired: number;
};
export declare const cavity: {
    set: ({ key, data, expired }: CavityType) => Promise<() => void>;
    get: (key: string) => Promise<{
        message: string;
        data: Record<string, any>;
    }>;
    delete: (key: string) => Promise<() => void>;
    socket: {
        register: () => void;
        subscribe(key: string): void;
        unsubscribe(key: string): void;
        invalidate(key: string): void;
    };
};
export {};
