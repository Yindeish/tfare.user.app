import React from 'react';
import { useStorageState } from '../hooks/useStorageState';

const SessionContext = React.createContext<{
    signIn: (token: string) => void;
    signOut: () => void;
    tokenSession?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    tokenSession: null,
    isLoading: false,
});

export function useSession() {
    const value = React.useContext(SessionContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('token');

    const signIn = (token: string) => {
        setSession(token);
    }

    return (
        <SessionContext.Provider
            value={{
                signIn,
                signOut: () => {
                    setSession(null);
                },
                tokenSession: session,
                isLoading,
            }}>
            {props.children}
        </SessionContext.Provider>
    );
}
