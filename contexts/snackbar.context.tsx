import React, { useState } from 'react';
import { ISigninContextState } from './signin.context.interface';
import { ISnackbarContext, ISnackbarContextState } from './snackbar.interface';

const SnackbarContext = React.createContext<ISnackbarContext>({
    openSnackbar: () => null,
    closeSnackbar: () => null,
    snackbarVisible: false,
});

export function useSnackbar() {
    const value = React.useContext(SnackbarContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSnackbar must be wrapped in a <SnackbarProvider />');
        }
    }

    return value;
}

export function SnackbarProvider(props: React.PropsWithChildren) {

    const [snackbarState, setSnackbarState] = useState<ISnackbarContextState>({
        snackbarVisible: false,
    })
    const { snackbarVisible } = snackbarState;

    const onChange = (key: keyof ISnackbarContextState, value: boolean) => setSnackbarState((prev) => ({ ...prev, [key]: value }));

    const openSnackbar = () => {
        onChange('snackbarVisible', true);
    }

    const closeSnackbar = () => {
        onChange('snackbarVisible', false);
    }

    return (
        <SnackbarContext.Provider
            value={{
                openSnackbar,
                closeSnackbar,
                snackbarVisible,
            }}>
            {props.children}
        </SnackbarContext.Provider>
    );
}
