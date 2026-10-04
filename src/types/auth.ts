export type User = {
    id: string;
    name: string;
    phoneNumber: string;
}

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
}

export type AuthState = {
    user: User | null;
    tokens: AuthTokens ||| null;
    isLoading: boolean;
}