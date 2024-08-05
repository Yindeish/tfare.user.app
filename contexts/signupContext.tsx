import React, { useState } from 'react';
import FetchService from '@/services/api/fetch.service';
import { IUser } from '@/state/types/account';
import { Platform, ToastAndroid } from 'react-native';
import { router } from 'expo-router';
import { pages } from '@/constants/pages';
import { ISetSecurityQuestionRequestData, ISignUpRequestData, ISignUpResponseData, ISignupContext, ISignupContextState, TSignupLoadingState } from './signup.context.interface';
import { IResponseData } from './shared.interface';
import { useSnackbar } from './snackbar.context';


const SignupContext = React.createContext<ISignupContext>({
    signUp: () => null,
    loadingState: 'idle',
    code: null,
    msg: '',
    signedUpUser: null,
    setSecurityQuestion: () => { }
});

export function useSignup() {
    const value = React.useContext(SignupContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SignupProvider(props: React.PropsWithChildren) {
    const [contextState, setContextState] = useState<ISignupContextState>({
        loadingState: 'idle',
        msg: '',
        code: null,
        signedUpUser: null,
    })
    const { code, msg, loadingState, signedUpUser } = contextState;
    const { closeSnackbar, openSnackbar, snackbarVisible } = useSnackbar()

    const onChange = (key: keyof ISignupContextState, value: string | number | boolean | IUser | TSignupLoadingState) => setContextState((prev) => ({ ...prev, [key]: value }));

    const notify = (timeout: number = 2000) => {
        openSnackbar()

        setTimeout(() => {
            closeSnackbar()
            onChange('msg', '');
        }, timeout);
        if (Platform.OS == 'android') ToastAndroid.show(msg, ToastAndroid.SHORT)
    }

    const signUp = async (data: ISignUpRequestData) => {
        onChange('loadingState', 'signiningUp' as TSignupLoadingState);

        const returnedData: ISignUpResponseData = await FetchService.post({ data, url: '/auth/signup' })
        console.log({ returnedData })

        notify();
        onChange('loadingState', 'idle' as TSignupLoadingState);
        onChange('code', returnedData.code as number);
        onChange('msg', returnedData.msg);
        onChange('signedUpUser', returnedData.signedUpUser as IUser);

        if (returnedData.code === 201) router.replace(`/(auth)/${pages.securityQuestion}`);
    }

    const setSecurityQuestion = async (data: ISetSecurityQuestionRequestData) => {
        onChange('loadingState', 'settingQuestion' as TSignupLoadingState);

        const returnedData: IResponseData = await FetchService.post({ data, url: '/auth/set-security-question' })
        console.log({ returnedData })

        notify();
        onChange('loadingState', 'idle' as TSignupLoadingState);
        onChange('code', returnedData.code as number);
        onChange('msg', returnedData.msg);

        if (returnedData.code === 200) router.replace(`/(auth)/${pages.signin}`);
    }

    return (
        <SignupContext.Provider
            value={{
                loadingState,
                signUp,
                code,
                msg,
                signedUpUser,
                setSecurityQuestion
            }}>
            {props.children}
        </SignupContext.Provider>
    );
}
