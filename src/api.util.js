"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetApi = exports.api = exports.ApiFilterValue = exports.authBearer = void 0;
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const navigation_1 = require("next/navigation");
const auth_util_1 = require("./auth.util");
const cavity_util_1 = require("./cavity.util");
// =========================>
// ## Build auth bearer
// =========================>
const authBearer = (bearer) => {
    const token = bearer || auth_util_1.auth.getAccessToken() || null;
    return token ? `Bearer ${token}` : null;
};
exports.authBearer = authBearer;
// =========================>
// ## Api error handler
// =========================>
const handleErrors = (fetch) => {
    if (fetch?.status === 401)
        (0, navigation_1.redirect)(auth_util_1.auth.PATH_LOGIN);
    if (fetch?.status === 403)
        (0, navigation_1.redirect)(auth_util_1.auth.PATH_BASE);
    return fetch;
};
// =========================>
// ## Api filter value
// =========================>
exports.ApiFilterValue = {
    eq: "eq",
    ne: "ne",
    in: "in",
    ni: "ni",
    bw: "bw",
};
// =========================>
// ## Api fetching handler
// =========================>
const api = async ({ path, url, method, params, payload, includeParams, headers, bearer, }) => {
    const fetchUrl = url || `${process.env.NEXT_PUBLIC_API_HOST}/${path || ""}`;
    const buildHeaders = { Authorization: (0, exports.authBearer)(bearer) || "", ...headers };
    buildHeaders["Content-Type"] = buildHeaders["Content-Type"] || "multipart/form-data";
    const filter = {};
    const jsonParams = {};
    if (params?.filter) {
        params?.filter?.map((val) => {
            filter[val.column] = `${exports.ApiFilterValue[val.type]}:${Array.isArray(val.value) ? val.value.join(",") : val.value}`;
        });
    }
    if (params) {
        const normalizeToJson = ["sort", "searchable", "selectable", "selectableOption", "expand"];
        normalizeToJson.forEach((key) => {
            const k = key;
            if (Array.isArray(params[k])) {
                jsonParams[k] = JSON.stringify(params[k]);
            }
        });
    }
    return await (0, axios_1.default)(fetchUrl, {
        method: method || "GET",
        headers: buildHeaders,
        data: payload,
        params: {
            ...params,
            ...jsonParams,
            ...(params?.filter ? { filter: JSON.stringify(filter) } : {}),
            ...includeParams,
        },
    })
        .then((res) => res)
        .catch((err) => handleErrors(err.response));
};
exports.api = api;
// =========================>
// ## Hook of get api 
// =========================>
const useGetApi = (props, sleep) => {
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [code, setCode] = (0, react_1.useState)(null);
    const [data, setData] = (0, react_1.useState)(null);
    const fetch = async (revalidation = false) => {
        setLoading(true);
        // =========================>
        // ## When cache ready 
        // =========================>
        const cacheData = props.expired && !revalidation ? await cavity_util_1.cavity.get(props.cacheName || `fetch_${props?.path}`) : null;
        if (cacheData) {
            setLoading(false);
            setCode(200);
            setData(cacheData);
            return "";
        }
        // =========================>
        // ## Fetch from api
        // =========================>
        const response = await (0, exports.api)(props);
        if (response?.status) {
            setLoading(false);
            setCode(response?.status);
            setData(response?.data);
            // =========================>
            // ## Save to cache
            // =========================>
            if (props.expired)
                cavity_util_1.cavity.set({ key: props?.cacheName || `fetch_${props?.path}`, data: response?.data, expired: props.expired });
        }
    };
    (0, react_1.useEffect)(() => {
        if (!sleep && (props.path || props.url))
            fetch();
    }, [
        props.path,
        props.url,
        props.params?.paginate,
        props.params?.page,
        props.params?.search,
        props.params?.sort,
        props.params?.filter,
        props.params?.selectable,
        props.params?.selectableOption,
        props.includeParams,
        props.headers,
        props.bearer,
        sleep
    ]);
    const reset = () => fetch(true);
    return { loading, code, data, reset };
};
exports.useGetApi = useGetApi;
