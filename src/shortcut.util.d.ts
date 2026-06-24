export type ShortcutHandler = (e: KeyboardEvent) => void;
export type ShortcutType = {
    key: string;
    description?: string;
    handler: ShortcutHandler;
};
export declare const shortcut: {
    register: (key: string, handler: ShortcutHandler, description?: string) => void;
    unregister: (key: string) => boolean;
    list: () => ShortcutType[];
    init: () => void;
};
