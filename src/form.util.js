"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInputHandler = exports.useInputRandomId = exports.useForm = void 0;
const react_1 = require("react");
const registry_1 = require("./registry");
const validation_util_1 = require("./validation.util");
const api_util_1 = require("./api.util");
const initialState = {
    formRegisters: [],
    formValues: [],
    formErrors: [],
    loading: false,
    showConfirm: false,
};
// ==============================>
// ## Form state handler
// ==============================>
const formReducer = (state, action) => {
    switch (action.type) {
        // ==============================>
        // ## Register handler
        // ==============================>
        case "SET_REGISTER": return {
            ...state,
            formRegisters: [
                ...state.formRegisters.filter((reg) => reg.name !== action.payload.name),
                action.payload,
            ],
        };
        // ==============================>
        // ## Unregister single field — removes register, value, and error
        // ==============================>
        case "UNREGISTER": return {
            ...state,
            formRegisters: state.formRegisters.filter((reg) => reg.name !== action.payload),
            formValues: state.formValues.filter((val) => val.name !== action.payload),
            formErrors: state.formErrors.filter((err) => err.name !== action.payload),
        };
        // ==============================>
        // ## Unregister all fields matching prefix — for cluster group removal
        // ==============================>
        case "UNREGISTER_PREFIX": return {
            ...state,
            formRegisters: state.formRegisters.filter((reg) => !reg.name.startsWith(action.payload)),
            formValues: state.formValues.filter((val) => !val.name.startsWith(action.payload)),
            formErrors: state.formErrors.filter((err) => !err.name.startsWith(action.payload)),
        };
        // ==============================>
        // ## Multiple values handler
        // ==============================>
        case "SET_VALUES": return {
            ...state,
            formValues: action.payload,
        };
        // ==============================>
        // ## Single value handler
        // ==============================>
        case "SET_VALUE": return {
            ...state,
            formValues: [
                ...state.formValues.filter((val) => val.name !== action.payload.name),
                { name: action.payload.name, value: action.payload.value },
            ],
        };
        // ==============================>
        // ## Errors handler
        // ==============================>
        case "SET_ERRORS": return { ...state, formErrors: action.payload };
        // ==============================>
        // ## Loading handler
        // ==============================>
        case "SET_LOADING": return { ...state, loading: action.payload };
        // ==============================>
        // ## Confirm handler
        // ==============================>
        case "SET_CONFIRM": return { ...state, showConfirm: action.payload };
        // ==============================>
        // ## Reset handler
        // ==============================>
        case "RESET": return { ...initialState };
        // ==============================>
        // ## Return state
        // ==============================>
        default: return state;
    }
};
// ==============================>
// ## Hook form
// ==============================>
const useForm = (submitControl) => {
    const isApiSubmit = !!submitControl?.path || !!submitControl?.url;
    const isIdbSubmit = !!submitControl?.idb;
    const [state, dispatch] = (0, react_1.useReducer)(formReducer, initialState);
    const { payload, confirmation, onSuccess, onFailed } = submitControl;
    // ==============================>
    // ## Reset when first load
    // ==============================>
    (0, react_1.useEffect)(() => dispatch({ type: "RESET" }), [submitControl?.path, submitControl?.url, submitControl?.idb]);
    // ==============================>
    // ## Set value from changes
    // ==============================>
    const onChange = (name, value) => dispatch({ type: "SET_VALUE", payload: { name, value: value ?? "" } });
    // ==============================>
    // ## FormControl handler
    // ==============================>
    const formControl = (name) => ({
        register: (_, regValidations) => dispatch({
            type: "SET_REGISTER",
            payload: { name, validations: regValidations },
        }),
        unregister: () => dispatch({ type: "UNREGISTER", payload: name }),
        onChange: (e) => onChange(name, e),
        value: state.formValues.find((val) => val.name === name)?.value || undefined,
        invalid: state.formErrors.find((err) => err.name === name)?.error || undefined,
    });
    const getObjectValues = () => {
        const registeredNames = new Set(state.formRegisters.map(r => r.name));
        return state.formValues.reduce((acc, val) => {
            if (registeredNames.has(val.name))
                acc[val.name] = val.value;
            return acc;
        }, {});
    };
    const submitIdb = async () => {
        const values = payload ? await payload(getObjectValues()) : getObjectValues();
        const idb = registry_1.registry.get("idb");
        if (!idb) {
            throw new Error("IndexedDB (IDB) extension is not installed or registered.");
        }
        const client = submitControl?.idb?.schema ? idb.useSchema(submitControl?.idb?.schema) : idb;
        await client.put(submitControl?.idb?.store || "", values);
        return { status: 200, data: values };
    };
    const submitApi = async () => {
        const formData = new FormData();
        const values = payload ? await payload(getObjectValues()) : getObjectValues();
        Object.entries(values).forEach(([k, v]) => {
            formData.append(k, v ?? "");
        });
        return (0, api_util_1.api)({
            url: submitControl.url,
            path: submitControl.path,
            method: submitControl.method || "POST",
            bearer: submitControl.bearer,
            headers: submitControl.headers,
            payload: formData,
        });
    };
    // ==============================>
    // ## Fetch to api
    // ==============================>
    const fetch = async () => {
        dispatch({ type: "SET_LOADING", payload: true });
        let execute;
        if (isApiSubmit) {
            execute = await submitApi();
        }
        else if (isIdbSubmit) {
            execute = await submitIdb();
        }
        else {
            throw new Error("Invalid submitControl");
        }
        if (execute?.status === 200 || execute?.status === 201) {
            // ==============================>
            // ## When success
            // ==============================>
            dispatch({ type: "SET_LOADING", payload: false });
            onSuccess?.(execute.data);
            dispatch({ type: "RESET" });
        }
        else if (isApiSubmit && execute?.status === 422) {
            // ==============================>
            // ## When error invalid
            // ==============================>
            const errors = Object.keys(execute.data.errors).map((key) => ({
                name: key,
                error: execute.data.errors[key][0],
            }));
            onFailed?.(execute?.status || 500);
            dispatch({ type: "SET_ERRORS", payload: errors });
            dispatch({ type: "SET_LOADING", payload: false });
            dispatch({ type: "SET_CONFIRM", payload: false });
        }
        else {
            // ==============================>
            // ## When error server
            // ==============================>
            onFailed?.(execute?.status || 500);
            dispatch({ type: "SET_CONFIRM", payload: false });
            dispatch({ type: "SET_LOADING", payload: false });
        }
    };
    // ==============================>
    // ## Submit handler
    // ==============================>
    const submit = async (e) => {
        e?.preventDefault();
        dispatch({ type: "SET_ERRORS", payload: [] });
        const newErrors = [];
        // ==============================>
        // ## Check register validation
        // ==============================>
        state.formRegisters.forEach((form) => {
            const { valid, message } = validation_util_1.validation.check({
                value: state.formValues.find((val) => val.name === form.name)?.value,
                rules: form.validations,
            });
            if (!valid) {
                newErrors.push({ name: form.name, error: message });
            }
        });
        if (newErrors.length) {
            dispatch({ type: "SET_ERRORS", payload: newErrors });
            return;
        }
        // ==============================>
        // ## Execute handler
        // ==============================>
        if (confirmation) {
            dispatch({ type: "SET_CONFIRM", payload: true });
        }
        else {
            fetch();
        }
    };
    // ==============================>
    // ## Confirmation handler
    // ==============================>
    const onConfirm = () => fetch();
    // ==============================>
    // ## Set default value
    // ==============================>
    const setDefaultValues = (values) => {
        const newValues = values ? Object.keys(values).map((keyName) => ({
            name: keyName,
            value: values[keyName],
        })) : [];
        dispatch({ type: "SET_VALUES", payload: newValues });
    };
    // ==============================>
    // ## Return hook handler
    // ==============================>
    return {
        submit,
        formControl,
        setDefaultValues,
        values: state.formValues,
        setValues: (values) => dispatch({ type: "SET_VALUES", payload: values || [] }),
        errors: state.formErrors,
        setErrors: (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        setRegister: (inputs) => dispatch({ type: "SET_REGISTER", payload: inputs }),
        unregister: (name) => dispatch({ type: "UNREGISTER", payload: name }),
        unregisterPrefix: (prefix) => dispatch({ type: "UNREGISTER_PREFIX", payload: prefix }),
        loading: state.loading,
        confirm: {
            onConfirm,
            show: state.showConfirm,
            onClose: () => dispatch({ type: "SET_CONFIRM", payload: false }),
        },
    };
};
exports.useForm = useForm;
// ==============================>
// ## Generate random id
// ==============================>
const useInputRandomId = () => {
    const [randomId, setRandomId] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        setRandomId(Math.random().toString(36).substring(7));
    }, []);
    return randomId;
};
exports.useInputRandomId = useInputRandomId;
// ==============================>
// ## Input handle
// ==============================>
const useInputHandler = (name, value, validations, register, unregister, isFile) => {
    const [inputValue, setInputValue] = (0, react_1.useState)("");
    const [focus, setFocus] = (0, react_1.useState)(false);
    const [idle, setIdle] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        name && register?.(name || "", validations);
        return () => { name && unregister?.(name); };
    }, [name, validations]);
    (0, react_1.useEffect)(() => {
        setInputValue(value && (!isFile || value instanceof File) ? value : "");
        value && setIdle(false);
    }, [value]);
    return {
        value: inputValue,
        setValue: setInputValue,
        idle,
        setIdle,
        focus,
        setFocus
    };
};
exports.useInputHandler = useInputHandler;
