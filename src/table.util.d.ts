import { ApiFilterType, ApiParamsType } from "./api.util";
import { ResourceParams, UseResourceProps } from "./resource.util";
export type TableStateType = {
    params?: ApiParamsType;
    data?: Record<string, any>[];
    selected?: Record<string, any> | null;
    checks?: (string | number)[] | null;
    focus?: number | null;
};
export type FetchControlType = {
    path?: string;
    url?: string;
    headers?: Record<string, any>;
    params?: ApiParamsType;
    includeParams?: object;
    bearer?: string;
};
export declare const useTable: (fetchControl: UseResourceProps & {
    params?: ResourceParams;
}, id: string | undefined, title: string | undefined, urlParam: boolean | {
    compressed?: boolean;
}) => {
    tableKey: string;
    data: any;
    reset: (() => Promise<"" | undefined>) | (() => Promise<void>);
    loading: boolean;
    params: ApiParamsType | undefined;
    setParam: <K extends keyof ApiParamsType>(key: K, value: ApiParamsType[K]) => void;
    focus: number | null | undefined;
    setFocus: (focus: number | null) => void;
    selected: Record<string, any> | null | undefined;
    setSelected: (selected: Record<string, any> | null) => void;
    checks: (string | number)[] | null | undefined;
    setChecks: (checks: (string | number)[] | null) => void;
    tableControl: {
        loading: boolean;
        sortBy: string[] | undefined;
        onChangeSortBy: (e: string[]) => void;
        search: string | undefined;
        onChangeSearch: (e: string) => void;
        filter: ApiFilterType[] | undefined;
        onChangeFilter: (e: ApiFilterType[]) => void;
        onRefresh: () => Promise<void> | Promise<"" | undefined>;
        pagination: {
            totalRow: any;
            page: number;
            paginate: number;
            onChange: (_: number, paginate: number, page: number) => void;
        };
    };
};
