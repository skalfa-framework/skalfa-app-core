"use client"

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { cavity } from "../cavity";



export type ApiFilterType = {
  logic   ?:  "and" | "or";
  type    ?:  "eq" | "ne" | "in" | "ni" | "bw" | "";
  column  ?:  string;
  value   ?:  string | number | number[] | string[] | null;
};

export type ApiParamsType = {
  page              ?:  number;
  paginate          ?:  number;
  sort              ?:  string[];
  search            ?:  string;
  searchable        ?:  string[];
  selectable        ?:  string[];
  expand            ?:  string[];
  selectableOption  ?:  string[];
  filter            ?:  ApiFilterType[];
};

export type ApiType = {
  path           ?:  string;
  url            ?:  string;
  method         ?:  "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params         ?:  ApiParamsType;
  payload        ?:  any;
  includeParams  ?:  Record<string, any>;
  headers        ?:  Record<string, any>;
  bearer         ?:  string;
};

export const ApiFilterValue = {
  eq  :  "eq",
  ne  :  "ne",
  in  :  "in",
  ni  :  "ni",
  bw  :  "bw",
};



// =========================>
// ## Api fetching handler
// =========================>
export const api = async ({ path, url, method, params, payload, includeParams, headers, bearer }: ApiType) => {
  const fetchUrl                              =  url || `${process.env.NEXT_PUBLIC_API_HOST}/${path || ""}`;
  
  // =========================>
  // ## Build headers 
  // =========================>
  const buildHeaders: Record<string, string>  =  {Authorization: authBearer(bearer) || "", ...headers};
  buildHeaders["Content-Type"]                =  buildHeaders["Content-Type"] || "multipart/form-data";
  
  // =========================>
  // ## Build params
  // =========================>
  const filter: Record<string, any>           =  {};
  const jsonParams: Record<string, any>       =  {};
  
  if (params?.filter) {
    params?.filter?.map((val) => {
      filter[val.column as keyof object] = `${ApiFilterValue[val.type as keyof object]}:${Array.isArray(val.value) ? val.value.join(",") : val.value}`;
    });
  }

  if (params) {
    const normalizeToJson = ["sort", "searchable", "selectable", "selectableOption", "expand"];

    normalizeToJson.forEach((key) => {
      const k = key as keyof ApiParamsType;
      if (Array.isArray(params[k])) {
        jsonParams[k] = JSON.stringify(params[k]) as any;
      }
    });
  }

  // =========================>
  // ## Axios handler
  // =========================>
  return await axios(fetchUrl, {
    method   :  method || "GET",
    headers  :  buildHeaders,
    data     :  payload,
    params   : {
      ...params,
      ...jsonParams,
      ...(params?.filter ? { filter: JSON.stringify(filter)} : {}),
      ...includeParams,
    },
  })
  .then((res) => res)
  .catch((err) => handleErrors(err.response));
};


// =========================>
// ## Hook of get api 
// =========================>
export const useGetApi = (props: ApiType & { method?: "GET", cacheName?: string; expired?: number }, sleep?: boolean) => {
  const [loading, setLoading]  =  useState<boolean>(true);
  const [code, setCode]        =  useState<number | null>(null);
  const [data, setData]        =  useState<any | null>(null);

  const fetch = async (revalidation: boolean = false) => {
    setLoading(true);

    // =========================>
    // ## When cache ready 
    // =========================>
    const cacheData = props.expired && !revalidation ? await cavity.get(props.cacheName || `fetch_${props?.path}`) : null;

    if (cacheData) {
      setLoading(false);
      setCode(200);
      setData(cacheData);
      return "";
    }
    
    // =========================>
    // ## Fetch from api
    // =========================>
    const response = await api(props);

    if (response?.status) {
      setLoading(false);
      setCode(response?.status);
      setData(response?.data);

      // =========================>
      // ## Save to cache
      // =========================>
      if (props.expired) cavity.set({key: props?.cacheName || `fetch_${props?.path}`, data: response?.data, expired: props.expired});
    }
  };
  
  useEffect(() => {
    if (!sleep && (props.path || props.url)) fetch();
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



// =========================>
// ## Build auth bearer
// =========================>
export const authBearer = (bearer?: string): string | null => {
  const token  =  bearer || auth.getAccessToken() || null;
  return token ? `Bearer ${token}` : null;
};



// =========================>
// ## Api error handler
// =========================>
const handleErrors = (fetch: AxiosResponse) => {
  if (fetch?.status === 401) redirect(auth.PATH_LOGIN);
  if (fetch?.status === 403) redirect(auth.PATH_BASE);
  return fetch;
};