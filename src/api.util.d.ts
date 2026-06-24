import axios from "axios";
export declare const authBearer: (bearer?: string) => string | null;
export type ApiFilterType = {
    /** Use filter logic with: "and" / "or". */
    logic?: "and" | "or";
    /** Use filter type with: "eq" = Equal, "ne" = Not Equal, "in" = In, "ni" = Not In, "bw" = Between. */
    type?: "eq" | "ne" | "in" | "ni" | "bw" | "";
    column?: string;
    value?: string | number | number[] | string[] | null;
};
export type ApiParamsType = {
    page?: number;
    paginate?: number;
    sort?: string[];
    search?: string;
    searchable?: string[];
    selectable?: string[];
    expand?: string[];
    selectableOption?: string[];
    filter?: ApiFilterType[];
};
export type ApiType = {
    path?: string;
    url?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    params?: ApiParamsType;
    payload?: any;
    includeParams?: Record<string, any>;
    headers?: Record<string, any>;
    bearer?: string;
};
export declare const ApiFilterValue: {
    eq: string;
    ne: string;
    in: string;
    ni: string;
    bw: string;
};
export declare const api: ({ path, url, method, params, payload, includeParams, headers, bearer, }: ApiType) => Promise<axios.AxiosResponse<any, any, {}>>;
export declare const useGetApi: (props: ApiType & {
    method?: "GET";
    cacheName?: string;
    expired?: number;
}, sleep?: boolean) => {
    loading: boolean;
    code: number | null;
    data: any;
    reset: () => Promise<"" | undefined>;
};
