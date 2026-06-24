"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registry = void 0;
class ServiceRegistry {
    services = {};
    register(name, service) {
        this.services[name] = service;
    }
    get(name) {
        return this.services[name];
    }
}
exports.registry = new ServiceRegistry();
