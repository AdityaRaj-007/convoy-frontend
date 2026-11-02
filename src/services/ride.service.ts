import {getStoredTokens} from './Auth/auth.service';
import {apiRequest} from './api';
import {ApiResponse} from '../types/auth';
import {RideDetails, RideMembers} from "../types/ride";

const getAccessToken = async (): Promise<string> => {
    const tokens = await getStoredTokens();

    if(!tokens?.accessToken){
        throw new Error("UNAUTHORIZED");
    }

    return tokens.accessToken;
}

export const createRide = async(input: CreateRide): Promise<RideDetails> => {
    const token = await getAccessToken();

    console.log("Request Input : ", input);

    const response = await apiRequest<ApiResponse<RideDetails>>('/rides', {
        method: "POST",
        token,
        body: input
    });

    if(!response.success || !response.data){
        throw new Error(response.error ?? "CREATE_RIDE_FAILED");
    }

    return response.data;
};

export const getRideMembers = async(rideId: string): Promise<RideMembers> => {
    const token = await getAccessToken();

    const response = await apiRequest<ApiResponse<RideMembers>>(`/rides/${rideId}/members`, {
        method: "GET",
        token
    })

    if(!response.success || !response.data) {
        throw new Error(response.error ?? "FETCH_RIDE_MEMBER_FAILED");
    }

    return response.data;
}