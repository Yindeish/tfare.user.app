import { IUserAccount } from "@/state/types/account";
import { IContextState, IRequestData, IResponseData } from "./shared.interface";

type TSignupLoadingState = 'idle' | 'signiningUp' | 'settingQuestion';

interface ISignUpRequestData extends IRequestData {
    //!Disabling Gender info for now
    // gender: string,
    //!Disabling Gender info for now
    profileName: string,
    phoneNumber: string,
    confirmedPin: string,
}

interface ISetSecurityQuestionRequestData extends Pick<IRequestData, 'email'> {
    securityQuestion: string,
    securityAnswer: string
}

interface ISignUpResponseData extends IResponseData {
    signedUpUser: IUserAccount | null
}

interface ISignupContextState extends IContextState {
    loadingState: TSignupLoadingState,
    signedUpUser: IUserAccount | null
}

interface ISignupContext extends ISignupContextState {
    signUp: (data: ISignUpRequestData) => void;
    signedUpUser: IUserAccount | null,
    //!Disabling Security Question info for now
    // setSecurityQuestion: (data: ISetSecurityQuestionRequestData) => void;
    //!Disabling Security Question info for now
}

// types
export { TSignupLoadingState }
// interfaces
export type { ISignUpRequestData, ISignUpResponseData, ISignupContext, ISignupContextState, ISetSecurityQuestionRequestData }