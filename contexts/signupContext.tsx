import React, { useState } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import AxiosService from '@/services/api/axio.service';
import URLS from '@/constants/urls';
import FetchService from '@/services/api/fetch.service';
import { IUser, IUserAccount } from '@/state/types/account';
import { useSession as useTokenSession } from './userTokenContext';
import { Platform, ToastAndroid } from 'react-native';
import Snackbar from 'react-native-snackbar'
import Colors from '@/constants/Colors';

interface ISignUpData {
    email: string,
    password: string,
    gender: string,
    profileName: string,
    phoneNumber: string,
    confirmedPassword: string,
}

interface ISignUpResponse {
    code: number,
    msg: string,
}

interface IRequestState {
    signiningUp: boolean,
    msg: string,
    code: number | null,
    snackbarVisible: boolean
}

const SignupContext = React.createContext<{
    signUp: (data: ISignUpData) => void;
    signiningUp: boolean,
    msg: string,
    code: number | null,
    snackbarVisible: boolean,
    closeSnackbar: Function
}>({
    signUp: () => null,
    signiningUp: false,
    code: null,
    msg: '',
    snackbarVisible: false,
    closeSnackbar: () => null
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
    const [requestState, setRequestState] = useState<IRequestState>({
        signiningUp: false,
        msg: '',
        code: null,
        snackbarVisible: false
    })
    const { code, msg, signiningUp, snackbarVisible } = requestState;

    const onChange = (key: keyof IRequestState, value: string | number | boolean) => setRequestState((prev) => ({ ...prev, [key]: value }));

    const notify = (timeout: number = 2000) => {
        onChange('snackbarVisible', true);

        setTimeout(() => onChange('snackbarVisible', false), timeout);
        if (Platform.OS == 'android') ToastAndroid.show(msg, ToastAndroid.SHORT)
    }


    const closeSnackbar = () => {
        onChange('snackbarVisible', false);
    }

    const signUp = async (data: ISignUpData) => {
        onChange('signiningUp', true);

        const returnedData: ISignUpResponse = await FetchService.post({ data, url: '/auth/signup' })

        notify();
        onChange('signiningUp', false);
        onChange('code', returnedData.code);
        onChange('msg', returnedData.msg);
    }

    return (
        <SignupContext.Provider
            value={{
                signiningUp,
                signUp,
                code,
                msg,
                snackbarVisible,
                closeSnackbar
            }}>
            {props.children}
        </SignupContext.Provider>
    );
}
