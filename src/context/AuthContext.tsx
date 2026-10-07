import React, {ReactNode, createContext, useState, useEffect, useContext} from "react";
import {AuthTokens, User} from "../types/auth";
import {getStoredTokens, getStoredUser, logout as logoutService} from "../services/Auth/auth.service";

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
            console.log('getStoredUser:', getStoredUser);
            const [storedTokens, storedUser] = await Promise.all([getStoredTokens(), getStoredUser()])

            console.log('storedTokens : ', storedTokens);
            console.log('storedUser : ', storedUser);
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

    const authenticate = (tokens: AuthTokens) => {
        setTokens(tokens);
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