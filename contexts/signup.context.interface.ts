import { IUser } from "@/state/types/account";
import { IContextState, IRequestData, IResponseData } from "./shared.interface";

type TSignupLoadingState = 'idle' | 'signiningUp' | 'settingQuestion';

interface ISignUpRequestData extends IRequestData {
    gender: string,
    profileName: string,
    phoneNumber: string,
    confirmedPassword: string,
}

interface ISetSecurityQuestionRequestData extends Pick<IRequestData, 'email'> {
    securityQuestion: string
    securityAnswer: string
}

interface ISignUpResponseData extends IResponseData {
    signedUpUser: IUser | null
}

interface ISignupContextState extends IContextState {
    loadingState: TSignupLoadingState,
    signedUpUser: IUser | null
}

interface ISignupContext extends ISignupContextState {
    signUp: (data: ISignUpRequestData) => void;
    closeSnackbar: Function,
    signedUpUser: IUser | null,
    setSecurityQuestion: (data: ISetSecurityQuestionRequestData) => void;
}

// types
export { TSignupLoadingState }
// interfaces
export type { IContextState, ISignUpRequestData, ISignUpResponseData, ISignupContext, ISignupContextState, ISetSecurityQuestionRequestData }