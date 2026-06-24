import { ValidationRules } from "./validation.util";
import { ApiType } from "./api.util";
type DBSchema = any;
export interface FormRegisterType {
    name: string;
    status?: boolean;
    validations?: ValidationRules;
}
export interface FormValueType {
    name: string;
    value?: any;
}
export interface FormErrorType {
    name: string;
    error?: string | null;
}
export interface FormStateType {
    formRegisters: FormRegisterType[];
    formValues: FormValueType[];
    formErrors: FormErrorType[];
    loading: boolean;
    showConfirm: boolean;
}
type ActionPayloadType = {
    SET_REGISTER: FormRegisterType;
    UNREGISTER: string;
    UNREGISTER_PREFIX: string;
    SET_VALUES: FormValueType[];
    SET_VALUE: FormValueType;
    SET_ERRORS: FormErrorType[];
    SET_LOADING: boolean;
    SET_CONFIRM: boolean;
};
type TypeKeys = keyof ActionPayloadType;
export type ActionType<T extends TypeKeys = "SET_REGISTER" | "SET_VALUES" | "SET_VALUE" | "SET_ERRORS" | "SET_LOADING" | "SET_CONFIRM" | "RESET" | any> = {
    type: T;
    payload?: ActionPayloadType[T];
};
export declare const useForm: (submitControl: ((ApiType & {
    idb?: never;
}) | {
    idb: {
        store: string;
        schema?: DBSchema;
    };
}) & {
    payload?: ((values: any) => Promise<Record<string, any>> | Record<string, any>) | false;
    confirmation?: boolean;
    onSuccess?: (data: any) => void;
    onFailed?: (code: number) => void;
}) => {
    submit: (e: any) => Promise<void>;
    formControl: (name: string) => {
        register: (_: string, regValidations?: ValidationRules) => void;
        unregister: () => void;
        onChange: (e: any) => void;
        value: any;
        invalid: any;
    };
    setDefaultValues: (values: Record<string, any> | null) => void;
    values: FormValueType[] | (FormValueType | {
        name: any;
        value: any;
    })[];
    setValues: (values: FormValueType[]) => void;
    errors: any;
    setErrors: (errors: FormErrorType[]) => void;
    setRegister: (inputs: FormRegisterType) => void;
    unregister: (name: string) => void;
    unregisterPrefix: (prefix: string) => void;
    loading: any;
    confirm: {
        onConfirm: () => Promise<void>;
        show: any;
        onClose: () => void;
    };
};
export declare const useInputRandomId: () => string;
export declare const useInputHandler: (name?: string, value?: any, validations?: ValidationRules, register?: (name: string, validations?: ValidationRules) => void, unregister?: (name: string) => void, isFile?: boolean) => {
    value: any;
    setValue: import("react").Dispatch<any>;
    idle: boolean;
    setIdle: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    focus: boolean;
    setFocus: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
export {};
