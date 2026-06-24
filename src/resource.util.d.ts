import { ApiType } from "./api.util";
export type ResourceParams = {
    page?: number;
    paginate?: number;
    search?: string;
    sort?: string[];
    expand?: string[];
    filter?: any[];
};
export type UseResourceApi = ApiType & {
    method?: "GET";
};
export type UseResourceIdb = {
    store: string;
    schema?: any;
};
export type UseResourceProps = ({
    path?: string;
    url?: string;
} & UseResourceApi) | ({
    idb: UseResourceIdb;
});
export declare function useResource(props: UseResourceProps & {
    params?: ResourceParams;
}): {
    loading: boolean;
    data: any;
    reset: () => Promise<"" | undefined>;
} | {
    loading: boolean;
    data: {
        data: any[];
        total_row: number;
    } | null;
    reset: () => Promise<void>;
};
