import {getStoredTokens} from './Auth/auth.service';

const getAccessToken = async (): Promise<string> => {
    const tokens = await getStoredTokens();

    if(!tokens?.accessToken){
        throw new Error("UNAUTHORIZED");
    }

    return tokens.accessToken;
}

const createRide = async(input: CreateRide): Promise<> => {

}