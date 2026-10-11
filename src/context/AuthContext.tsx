import React, {ReactNode, createContext, useState, useEffect, useContext} from "react";
import {AuthTokens, User} from "../types/auth";
import {getStoredTokens, saveUser, getCurrentUser, logout as logoutService} from "../services/Auth/auth.service";

type AuthContextValue = {
    user: User | null;
    tokens: AuthTokens | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    authenticate: (tokens: AuthTokens) => void;
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<AuthTokens | null> (null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        restoreAuthState()
    },[]);

    const restoreAuthState = async () => {
        try {
            console.log('getStoredTokens:', getStoredTokens);
            console.log('getCurrentUser:', getCurrentUser);
            const storedTokens = await getStoredTokens();

            if(!storedTokens) {
                setTokens(null);
                setUser(null);
                return;
            }

            const currentUser = await getCurrentUser(storedTokens.accessToken);

            setTokens(storedTokens);
            setUser(currentUser);

            console.log('storedTokens : ', storedTokens);
            console.log('currentUserUser : ', currentUser);

            await saveUser(currentUser);
        } catch(error) {
            console.error('Failed to restore authentication state: ', error);
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        await logoutService();

        setTokens(null);
        setUser(null);
    }

    const authenticate = async (tokens: AuthTokens) => {
        setTokens(tokens);

        try {
            const currentUser = await getCurrentUser(tokens.accessToken);

            console.log("Current user : ", currentUser);

            await AsyncStorage.setMany({
                [ACCESS_TOKEN_KEY]: tokens.accessToken,
                [REFRESH_TOKEN_KEY]: tokens.refreshToken
            });
            await saveUser(currentUser);
            setUser(currentUser);
        } catch(error) {
            setTokens(null);
            setUser(null);
            await logoutService();
        }
    }

    const value: AuthContextValue = {
        user,
        tokens,
        isLoading,
        isAuthenticated: tokens !== null,
        authenticate,
        logout
    }
    return (
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = ():AuthContextValue => {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('useAuth must be used inside an AuthProvider.');
    }

    return context;
}