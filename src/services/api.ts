import {refreshAccessToken} from "./Auth/token.service";
import {API_BASE_URL} from "../config/api";

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
    retryOnUnauthorized?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const apiRequest = async<T>(path:string, options: RequestOptions = {}): Promise<T> => {
    const makeRequest = async (token?: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}${path}`,{
           method: options.method ?? 'GET',
           headers: {
               'Content-Type': 'application/json',
               ...(token ? {Authorization: `Bearer ${token}`} : {}),
           },
           body: options.body ? JSON.stringify(options.body) : undefined,
        });
    }

    let response = await makeRequest(options.token);

    if(response.status === 401 && options.token && options.retryOnUnauthorized !== false && path !== "/auth/refresh") {
        if(!refreshPromise) {
            refreshPromise = refreshAccessToken().finally(() => {refreshPromise = null});
        }
        const newAccessToken = await refreshPromise;
        response = await makeRequest(newAccessToken);
    }

    if(!response.ok) {
        const message = await response.text();

        throw new Error(message || `Request failed with status ${response.status}`)
    }

    return response.json();
}