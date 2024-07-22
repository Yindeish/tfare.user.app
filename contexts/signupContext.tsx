import React, { useState } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import AxiosService from '@/services/api/axio.service';
import URLS from '@/constants/urls';
import FetchService from '@/services/api/fetch.service';
import { IUser, IUserAccount } from '@/state/types/account';
import { useSession as useTokenSession } from './userTokenContext';
import { Platform, ToastAndroid } from 'react-native';
import { router } from 'expo-router';
import { pages } from '@/constants/pages';
import { IContextState, ISetSecurityQuestionRequestData, ISignUpRequestData, ISignUpResponseData, ISignupContext, ISignupContextState, TSignupLoadingState } from './signup.context.interface';
import { IResponseData } from './shared.interface';


const SignupContext = React.createContext<ISignupContext>({
    signUp: () => null,
    loadingState: 'idle',
    code: null,
    msg: '',
    snackbarVisible: false,
    closeSnackbar: () => null,
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
    const [requestState, setRequestState] = useState<ISignupContextState>({
        loadingState: 'idle',
        msg: '',
        code: null,
        snackbarVisible: false,
        signedUpUser: null,
    })
    const { code, msg, loadingState, snackbarVisible, signedUpUser } = requestState;

    const onChange = (key: keyof ISignupContextState, value: string | number | boolean | IUser) => setRequestState((prev) => ({ ...prev, [key]: value }));

    const notify = (timeout: number = 2000) => {
        onChange('snackbarVisible', true);

        setTimeout(() => {
            onChange('snackbarVisible', false)
            onChange('msg', '');
        }, timeout);
        if (Platform.OS == 'android') ToastAndroid.show(msg, ToastAndroid.SHORT)
    }

    const closeSnackbar = () => {
        onChange('snackbarVisible', false);
    }

    const signUp = async (data: ISignUpRequestData) => {
        onChange('loadingState', 'signiningUp' as TSignupLoadingState);

        const returnedData: ISignUpResponseData = await FetchService.post({ data, url: '/auth/signup' })

        notify();
        onChange('loadingState', 'idle' as TSignupLoadingState);
        onChange('code', returnedData.code as number);
        onChange('msg', returnedData.msg);
        onChange('signedUpUser', returnedData.signedUpUser as IUser);

        if (returnedData.code === 201) router.replace(`/(auth)/${pages.securityQuestion}`);
    }

    const setSecurityQuestion = async (data: ISetSecurityQuestionRequestData) => {
        console.log({ data })
        onChange('loadingState', 'settingQuestion' as TSignupLoadingState);
        // router.replace(`/(auth)/${pages.securityQuestion}`); // for testing. remove this later

        const returnedData: IResponseData = await FetchService.post({ data, url: '/auth/set-security-question' })

        notify();
        onChange('loadingState', 'idle' as TSignupLoadingState);
        onChange('code', returnedData.code as number);
        onChange('msg', returnedData.msg);

        if (returnedData.code === 200) router.replace(`/(auth)/${pages.securityQuestion}`);// for testing. modify this later
    }

    return (
        <SignupContext.Provider
            value={{
                loadingState,
                signUp,
                code,
                msg,
                snackbarVisible,
                closeSnackbar,
                signedUpUser,
                setSecurityQuestion
            }}>
            {props.children}
        </SignupContext.Provider>
    );
}
