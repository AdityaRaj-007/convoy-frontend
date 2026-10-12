import {refreshAccessToken} from "./Auth/token.service";
import {API_BASE_URL} from "../config/api";

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
    retryOnUnauthorized?: boolean;
}
type SessionExpiredHandler = () => void;

let refreshPromise: Promise<string> | null = null;
let sessionExpiredHandler: sessionExpiredHandler | null = null;
let sessionExpiredHandled = false;

export const setSessionExpiredHandler = (handler: SessionExpiredHandler | null) => {
    sessionExpiredHandler = handler;

    if(handler) {
        sessionExpiredHandled = false;
    }
}

const notifySessionExpired = () => {
    if(sessionExpiredHandled) {
        return;
    }

    sessionExpiredHandled = true;
    sessionExpiredHandler?.();
}

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
        let newAccessToken: string;

        try {
            newAccessToken = await refreshPromise;
        } catch(error) {
            if(error instanceof Error && (error.message === 'SESSION_EXPIRED' || error.message === "NO_REFRESH_TOKEN")) {
                notifySessionExpired();
            }

            throw error;
        }
        response = await makeRequest(newAccessToken);

        if(response.status === 401) {
            notifySessionExpired();
            throw new Error('SESSION_EXPIRED');
        }
    }

    if(!response.ok) {
        const message = await response.text();

        throw new Error(message || `Request failed with status ${response.status}`)
    }

    return response.json() as Promise<T>;
}