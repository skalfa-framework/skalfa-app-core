export interface Registry {
    idb?: any;
    socket?: any;
    ExportExcel?: any;
    ImportExcel?: any;
    [key: string]: any;
}
declare class ServiceRegistry {
    private services;
    register<K extends keyof Registry>(name: K, service: Registry[K]): void;
    get<K extends keyof Registry>(name: K): Registry[K];
}
export declare const registry: ServiceRegistry;
export {};
