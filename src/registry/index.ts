export interface Registry {
  idb?: any;
  socket?: any;
  ExportExcel?: any;
  ImportExcel?: any;
  [key: string]: any;
}

export type DBSchema = {
  name: string;
  version: number;
  stores: Record<string, any>;
};

class ServiceRegistry {
  private services: Registry = {};

  register<K extends keyof Registry>(name: K, service: Registry[K]): void {
    this.services[name] = service;
  }

  get<K extends keyof Registry>(name: K): Registry[K] {
    return this.services[name];
  }
}

export const registry = new ServiceRegistry();
