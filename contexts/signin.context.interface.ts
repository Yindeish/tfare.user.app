import { IUser } from "@/state/types/account";
import { IContextState, IRequestData, IResponseData } from "./shared.interface";

type TSigninLoadingState = 'idle' | 'signingin' | 'signingout';

interface ISigninResponseData extends IResponseData {
    user: IUser,
    token: string
}

interface ISigninContextState extends IContextState {
    loadingState: TSigninLoadingState,
    user: IUser | null
}

interface ISigninContext extends ISigninContextState {
    signIn: (data: IRequestData) => void;
    signOut: () => void,
    isLoading: boolean,
    userSession: string | null,
    closeSnackbar: Function,
}

// types
export { TSigninLoadingState }
// interfaces
export type { IContextState, ISigninContext, IRequestData, ISigninContextState, ISigninResponseData }