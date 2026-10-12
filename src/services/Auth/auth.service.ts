import AsyncStorage from '@react-native-async-storage/async-storage';

import {apiRequest} from "../api";
import {VerifyOTPResult, User, AuthTokens, ApiResponse} from "../../types/auth";

const ACCESS_TOKEN_KEY = 'auth:accessToken';
const REFRESH_TOKEN_KEY = 'auth:refreshToken';
const USER_KEY = 'auth:user';

export const sendOTP = async(phoneNumber: string) => {
    return apiRequest('/auth/otp/send',
        {method: 'POST', body: {phoneNumber}
    });
}

export const verifyOTP = async(phoneNumber: string, otp: string): Promise<VerifyOTPResult> => {
    const response = await apiRequest<VerifyOTPResult>('/auth/otp/verify', {
        method: 'POST',
        body: {phoneNumber, otp},
        retryOnUnauthorized: true
    });

    if(!response.success) {
        throw new Error(response.error ?? 'OTP verification failed');
    }

    const result = response.data;

    if('accessToken' in result) {
        await AsyncStorage.setMany({
            [ACCESS_TOKEN_KEY]: token.accessToken,
            [REFRESH_TOKEN_KEY]: token.refreshToken
        });
    }


    return result;
}

export const saveUser = async(user:User) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const getStoredTokens = async(): Promise<AuthTokens | null> => {
    console.log('getStoredTokens: started');
      console.log('AsyncStorage:', AsyncStorage);
      console.log('AsyncStorage.multiGet:', AsyncStorage.multiGet);
    const values = await AsyncStorage.getMany([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);

    console.log('getMany returned:', values);
      console.log('getMany type:', typeof values);
    const accessToken = values[ACCESS_TOKEN_KEY];
    const refreshToken = values[REFRESH_TOKEN_KEY];

    console.log('accessToken : ', accessToken);
    console.log('refreshToken : ', refreshToken);

    if(!accessToken || !refreshToken) {
        return null;
    }

    return {accessToken, refreshToken};
}

export const getStoredUser = async (): Promise<User | null> => {
    const value = await AsyncStorage.getItem(USER_KEY);

    console.log("value : ", value);
    if(!value) {
        return null;
    }

    return JSON.parse(value);
}

export const logout = async() => {
    await AsyncStorage.removeMany([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
}

export const registerUser = async (name: string, verificationToken:string):Promise<AuthTokens> => {
    const response = await apiRequest<AuthTokens>('/auth/register', {method: 'POST', body: {name, verificationToken}});
    console.log("Response from api : ", response);

    await AsyncStorage.setMany({
        [ACCESS_TOKEN_KEY]: response.data.accessToken,
        [REFRESH_TOKEN_KEY]: response.data.refreshToken
    });

    return response.data;
}

export const getCurrentUser = async(accessToken: string): Promise<User> => {
    const response = await apiRequest<ApiResponse<User>>("/auth/me", {
        method: 'GET',
        token: accessToken,
        retryOnUnauthorized: true,
    });

    if(!response.success || !response.data) {
        throw new Error(response.error ?? 'Failed to fetch current user.')
    }

    return response.data;
}