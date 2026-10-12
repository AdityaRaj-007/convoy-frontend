import AsyncStorage from '@react-native-async-storage/async-storage';
import {getStoredTokens} from "./auth.service";
import {API_BASE_URL} from "../../config/api";
import {ApiResponse, AuthTokens} from "../../types/auth";

const ACCESS_TOKEN_KEY = 'auth:accessToken';
const REFRESH_TOKEN_KEY = 'auth:refreshToken';

export const refreshAccessToken = async(): Promise<string> => {
    const tokens = await getStoredTokens();

    const refreshToken = tokens.refreshToken;

    if(!refreshToken) {
        throw new Error("NO_REFRESH_TOKEN");
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({refreshToken}),
    });

    if(response.status === 401 || response.status === 403) {
        throw new Error("SESSION_EXPIRED");
    }

    let result: ApiResponse<AuthTokens>

    try {
        result = await response.json();
    } catch {
        throw new Error('INVALID_REFRESH_TOKEN');
    }
    console.log("Response.ok : ", response.ok);
    console.log("Response from /refresh : ", result);

    if(!response.ok || !result.success || !result.data?.accessToken) {
        console.log("/refresh failed");
        throw new Error(result.error ?? 'TOKEN_REFRESH_FAILED');
    }

    const newTokens: AuthTokens = {
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken || refreshToken
    }

    await AsyncStorage.setMany({
        [ACCESS_TOKEN_KEY]: newTokens.accessToken,
        [REFRESH_TOKEN_KEY]: newTokens.refreshToken
    });

    return newTokens.accessToken;
}