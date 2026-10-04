import AsyncStorage from '@react-native-async-storage/async-storage';

import {apiRequest} from "../api";
import {AuthTokens, User} from "../../types/auth";

const ACCESS_TOKEN_KEY = 'auth:accessToken';
const REFRESH_TOKEN_KEY = 'auth:refreshToken';
const USER_KEY = 'auth:user';

export const sendOTP = async(phoneNumber: string) => {
    return apiRequest('/auth/otp/send',
        {method: 'POST', body: {phoneNumber}
    });
}

export const verifyOTP = async(phoneNumber: string, otp: string): Promise<AuthTokens> => {
    const token = await apiRequest<AuthTokens>('/auth/otp/verify', {
        method: 'POST',
        body: {phoneNumber, otp}
    });

    await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, token.accessToken],
        [REFRESH_TOKEN_KEY, token.refreshToken]
    ]);

    return token;
}

export const saveUser = async(user:User) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const getStoredTokens = async(): Promise<AuthTokens | null> => {
    const values = await AsyncStorage.multiGet([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);

    const accessToken = values[0][1];
    const refreshToken = values[1][1];

    if(!accessToken || !refreshToken) {
        return null;
    }

    return {accessToken, refreshToken};
}

export const getStoredUser = async (): Promise<User | null> => {
    const value = await AsyncStorage.getItem(USER_KEY);

    if(!value) {
        return null;
    }

    return JSON.parse(value);
}

export const logout = async() => {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
}