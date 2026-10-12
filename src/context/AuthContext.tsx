import React, {ReactNode, createContext, useState, useEffect, useContext, useCallback} from "react";
import {AuthTokens, User} from "../types/auth";
import {getStoredTokens, getStoredUser, saveUser, getCurrentUser, logout as logoutService} from "../services/Auth/auth.service";
import {setSessionExpiredHandler} from "../services/api";

type AuthContextValue = {
    user: User | null;
    tokens: AuthTokens | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    authenticate: (tokens: AuthTokens) => Promise<void>;
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

    const logout = useCallback(async () => {
        try {
            await logoutService();
        } finally {
            setTokens(null);
            setUser(null);
        }
    },[]);

    const restoreAuthState = useCallback(async () => {
        let storedTokens:AuthTokens | null = null;

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

            const latestTokens = await getStoredTokens();

            setTokens(latestTokens ?? storedTokens);
            setUser(currentUser);

            console.log('latestTokens : ', latestTokens);
            console.log('storedTokens : ', storedTokens);
            console.log('currentUserUser : ', currentUser);

            await saveUser(currentUser);
        } catch(error) {
            console.error('Failed to restore authentication state: ', error);

            const isSessionExpired = error instanceof Error && (error.message === "SESSION_EXPIRED" || error.message === "NO_REFRESH_TOKEN");

            if(storedTokens && !isSessionExpired) {
                try {
                    const cachedUser = await getStoredUser();

                    if(cachedUser) {
                        setTokens(storedTokens);
                        setUser(cachedUser);
                    }
                } catch(cacheError) {
                    console.error('Failed to load cached user : ', cacheError);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const authenticate = useCallback(async (tokens: AuthTokens) => {
        const currentUser = await getCurrentUser(tokens.accessToken);

        console.log("Current user : ", currentUser);

        const latestTokens = await getStoredTokens();
        await saveUser(currentUser);

        setTokens(latestTokens ?? tokens);
        setUser(currentUser);
    }, []);

    useEffect(() => {
        setSessionExpiredHandler(() => {
            void logout().catch(error => {
                console.error('Failed to clear expired session : ', error);
            })
        });

        return () => {setSessionExpiredHandler(null)};
    }, [logout]);

    useEffect(() => {
        void restoreAuthState();
    }, [restoreAuthState]);

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