"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResource = useResource;
const react_1 = require("react");
const api_util_1 = require("./api.util");
const registry_1 = require("./registry");
function useResource(props) {
    const isApi = "path" in props || "url" in props;
    const apiResult = (0, api_util_1.useGetApi)(isApi ? props : {}, !isApi);
    // =====================
    // IDB MODE
    // =====================
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [data, setData] = (0, react_1.useState)(null);
    const idbParams = props.params || {};
    const fetchIdb = async () => {
        if (!("idb" in props))
            return;
        setLoading(true);
        try {
            const idb = registry_1.registry.get("idb");
            if (!idb) {
                throw new Error("IndexedDB (IDB) extension is not installed or registered.");
            }
            const idbClient = props.idb.schema
                ? idb.useSchema(props.idb.schema)
                : idb;
            let q = await idbClient.query(props.idb.store);
            if (idbParams.search) {
                const keyword = idbParams.search.toLowerCase();
                q = q.where((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(keyword)));
            }
            if (Array.isArray(idbParams.filter)) {
                for (const f of idbParams.filter) {
                    if (f?.field && f?.value !== undefined) {
                        q = q.where((row) => row[f.field] === f.value);
                    }
                }
            }
            if (Array.isArray(idbParams.sort) && idbParams.sort.length) {
                q = q.usingIndex(idbParams.sort[0]?.split(" ")?.at(0) || "created_at").order(idbParams.sort[0]?.split(" ")?.at(1) == "asc" ? "asc" : "desc");
            }
            if (idbParams.paginate) {
                q = q.paginate(idbParams.page || 0, idbParams.paginate);
            }
            const [rows, total] = await Promise.all([
                q.get(),
                q.count(),
            ]);
            // const rows = await q.get()
            setData({ data: rows, total_row: total });
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        if (!isApi && "idb" in props)
            fetchIdb();
    }, [
        isApi,
        idbParams.search,
        JSON.stringify(idbParams.filter),
        JSON.stringify(idbParams.sort),
        idbParams.paginate,
        idbParams.page,
    ]);
    // =====================
    // Unified return
    // =====================
    if (isApi) {
        return {
            loading: apiResult.loading,
            data: apiResult.data,
            reset: apiResult.reset,
        };
    }
    return {
        loading,
        data: data,
        reset: fetchIdb,
    };
}
