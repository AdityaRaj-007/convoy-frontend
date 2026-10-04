const API_BASE_URL = 'http://10.0.2.2:3000/api';

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
}

export const apiRequest = async<T>(path:string, options: RequestOptions = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`,{
            method: options.method ?? 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.token ? {Authorization: `Bearer ${options.token}`} : {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if(!response.ok) {
        const message = await response.text();

        throw new Error(message || `Request failed with status ${response.status}`)
    }

    return response.json();
}