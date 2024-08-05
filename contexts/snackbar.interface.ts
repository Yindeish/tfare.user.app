interface ISnackbarContextState {
    snackbarVisible: boolean,
}

interface ISnackbarContext extends ISnackbarContextState {
    openSnackbar: Function,
    closeSnackbar: Function,
}

// types
export { }
// interfaces
export type { ISnackbarContextState, ISnackbarContext, }