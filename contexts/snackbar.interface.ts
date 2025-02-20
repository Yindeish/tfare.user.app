import React, { ReactNode } from "react"

interface ISnackbarContextState {
    snackbarVisible: boolean,
    msg: '',
    code: null,
    loading: false,
}

interface ISnackbarContext extends ISnackbarContextState {
    openSnackbar: Function,
    closeSnackbar: Function,
    notify: ({
      }: {
        timeout?: number;
        msg?: string;
      }) => void,
      // msg?: string,
      // code?: number | null,
      // loading?: boolean,
    Snackbar: ({ onDismiss, snackbarVisible, msg }: { snackbarVisible: boolean; onDismiss: () => void; msg: string; }) => React.JSX.Element
}

// types
export { }
// interfaces
export type { ISnackbarContextState, ISnackbarContext, }