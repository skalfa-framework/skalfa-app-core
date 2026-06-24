"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTable = void 0;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const lz_string_1 = __importDefault(require("lz-string"));
const conversion_util_1 = require("./conversion.util");
const resource_util_1 = require("./resource.util");
const useTable = (fetchControl, id = "", title = "", urlParam) => {
    const [state, setState] = (0, react_1.useState)({});
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    // ======================
    // ## Table state key
    // ======================
    const getTableKey = () => id || (title ? conversion_util_1.conversion.strSlug(title) : null) || fetchControl.path || fetchControl.store || "";
    const tableKey = getTableKey();
    // ======================
    // ## Parse state url
    // ======================
    const getParamsFromUrl = () => {
        if (typeof urlParam == "object" && urlParam?.compressed) {
            const t = searchParams.get(tableKey ? `${tableKey}.t` : "t");
            if (!t)
                return {};
            const decoded = lz_string_1.default.decompressFromEncodedURIComponent(t);
            return decoded ? JSON.parse(decoded) : {};
        }
        const params = {};
        const prefix = tableKey ? `${tableKey}.` : "";
        searchParams.forEach((value, key) => {
            if (!key.startsWith(prefix))
                return;
            const shortKey = key.slice(prefix.length);
            try {
                params[shortKey] = JSON.parse(value);
            }
            catch {
                params[shortKey] = value;
            }
        });
        return params;
    };
    // =======================
    // ## Update url state
    // =======================
    const updateUrlParams = (params) => {
        const url = new URL(window.location.href);
        if (typeof urlParam == "object" && urlParam?.compressed) {
            const encoded = lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(params));
            url.searchParams.set(tableKey ? `${tableKey}.t` : "t", encoded);
        }
        else {
            const prefix = tableKey ? `${tableKey}.` : "";
            for (const key of Array.from(url.searchParams.keys())) {
                if (key.startsWith(prefix))
                    url.searchParams.delete(key);
            }
            Object.entries(params || {}).forEach(([key, value]) => {
                const paramKey = `${prefix}${key}`;
                if (value === undefined || value === null || value === "") {
                    url.searchParams.delete(paramKey);
                }
                else if (typeof value === "object") {
                    url.searchParams.set(paramKey, JSON.stringify(value));
                }
                else {
                    url.searchParams.set(paramKey, String(value));
                }
            });
        }
        router.replace(url.pathname + "?" + url.searchParams.toString(), { scroll: false });
    };
    (0, react_1.useEffect)(() => {
        if (state.params && urlParam)
            updateUrlParams(state.params);
    }, [state.params]);
    // ===========================
    // ## get url state
    // ===========================
    (0, react_1.useEffect)(() => {
        if (urlParam) {
            const params = getParamsFromUrl();
            setState((prev) => ({ ...prev, params }));
        }
    }, []);
    // ==========================
    // ## Fetch api
    // ==========================
    const { loading, data, reset } = (0, resource_util_1.useResource)({
        ...fetchControl,
        method: "GET",
        params: {
            ...state.params,
            ...fetchControl.params
        },
    });
    // ==========================
    // ## Setter helper
    // ==========================
    const setParam = (key, value) => setState((prev) => ({ ...prev, params: { ...prev.params, [key]: value } }));
    const setSelected = (selected) => setState((prev) => ({ ...prev, selected }));
    const setChecks = (checks) => setState((prev) => ({ ...prev, checks }));
    const setFocus = (focus) => setState((prev) => ({ ...prev, focus }));
    // ==========================
    // ## Table Control
    // ==========================
    const tableControl = {
        loading: loading,
        sortBy: state?.params?.sort,
        onChangeSortBy: (e) => setParam('sort', e),
        search: state?.params?.search,
        onChangeSearch: (e) => setParam('search', e),
        filter: state?.params?.filter,
        onChangeFilter: (e) => setParam('filter', e),
        onRefresh: () => reset(),
        pagination: {
            totalRow: data?.total_row,
            page: state?.params?.page || 1,
            paginate: state?.params?.paginate || 10,
            onChange: (_, paginate, page) => {
                setParam('paginate', paginate);
                setParam('page', page);
            },
        },
    };
    return {
        tableKey,
        data,
        reset,
        loading,
        params: state.params,
        setParam,
        focus: state.focus,
        setFocus,
        selected: state.selected,
        setSelected: setSelected,
        checks: state.checks,
        setChecks: setChecks,
        tableControl,
    };
};
exports.useTable = useTable;
