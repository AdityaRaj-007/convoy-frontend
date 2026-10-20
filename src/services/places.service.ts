import {apiRequest} from './api';
import {getStoredTokens} from './Auth/auth.service';
import {ApiResponse} from '../types/auth';
import {PlaceSuggestion, PlaceDetails} from "../types/places";

const getAccessToken = async (): Promise<string> => {
    console.log('[Places] Getting stored tokens');
    const tokens = await getStoredTokens();

    if(!tokens?.accessToken){
        throw new Error("UNAUTHORIZED");
    }

    return tokens.accessToken;
}

export const searchPlaces = async(input: string, sessionToken?: string): Promise<PlaceSuggestion[]> => {
    console.log('[Places] Starting search.');

    const token = await getAccessToken();
    console.log('[Places] Access token retrieved');

//     const query = new URLSearchParams({input});
//
//     if(sessionToken) {
//         query.append('sessionToken', sessionToken);
//     }

    const query = `input=${encodeURIComponent(input)}${
        sessionToken
          ? `&sessionToken=${encodeURIComponent(sessionToken)}`
          : ''
      }`;

    console.log('[Places] Sending autocomplete request');

    const response = await apiRequest<ApiResponse<PlaceSuggestion[]>>(
        `/places/autocomplete?${query.toString()}`,
         {method: "GET", token}
    );

    if(!response.success || !response.data) {
        throw new Error(response.error ?? 'PLACE_SEARCH_FAILED');
    }

    return response.data;
}

export const fetchPlaceDetails = async (
    placeId: string,
     sessionToken?: string
): Promise<PlaceDetails> => {
    const token = await getAccessToken();

    const query = [
        `placeId=${encodeURIComponent(placeId)}`,
        ...(sessionToken
          ? [`sessionToken=${encodeURIComponent(sessionToken)}`]
          : []),
    ].join('&');

    const response = await apiRequest<ApiResponse<PlaceDetails>>(
        `/places/details?${query}`,
         {method: "GET", token}
    );

    if(!response.success || !response.data) {
        throw new Error(response.error ?? "PLACE_DETAILS_FAILED");
    }

    return response.data;
}