import React, { ReactNode } from "react"

interface ISnackbarContextState {
    snackbarVisible: boolean,
}

interface ISnackbarContext extends ISnackbarContextState {
    openSnackbar: Function,
    closeSnackbar: Function,
    notify: ({
      }: {
        timeout?: number;
        msg: string;
      }) => void,
    Snackbar: ({ onDismiss, snackbarVisible, msg }: { snackbarVisible: boolean; onDismiss: () => void; msg: string; }) => React.JSX.Element
}

// types
export { }
// interfaces
export type { ISnackbarContextState, ISnackbarContext, }