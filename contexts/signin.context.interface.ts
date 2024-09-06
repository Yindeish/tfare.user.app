import { IUserAccount } from "@/state/types/account";
import { IContextState, IRequestData, IResponseData } from "./shared.interface";

type TSigninLoadingState = 'idle' | 'signingin' | 'signingout';

interface ISigninResponseData extends IResponseData {
    user: IUserAccount,
    token: string
}

interface ISigninContextState extends IContextState {
    loadingState: TSigninLoadingState,
    user: IUserAccount | null
}

interface ISigninContext extends ISigninContextState {
    signIn: (data: IRequestData) => void;
    signOut: () => void,
    isLoading: boolean,
    userSession: string | null,
}

// types
export { TSigninLoadingState }
// interfaces
export type { IContextState, ISigninContext, IRequestData, ISigninContextState, ISigninResponseData }