import React, { useState } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import AxiosService from '@/services/api/axio.service';
import URLS from '@/constants/urls';
import FetchService from '@/services/api/fetch.service';
import { IUser, IUserAccount } from '@/state/types/account';
import { useSession as useTokenSession } from './userTokenContext';
import { Platform, ToastAndroid } from 'react-native';

interface ISignInData {
  email: string, password: string
}

interface ISignInResponse {
  code: number,
  msg: string,
  user: Partial<IUser>,
  token: string
}

interface IRequestState {
  signiningIn: boolean,
  signiningOut: boolean,
  msg: string,
  code: number | null,
  snackbarVisible: boolean
}

const SessionContext = React.createContext<{
  signIn: (data: ISignInData) => void;
  signOut: () => void,
  userSession?: string | null,
  isLoading: boolean,
  signiningIn: boolean,
  signiningOut: boolean,
  msg: string,
  code: number | null,
  snackbarVisible: boolean,
  closeSnackbar: Function
}>({
  signIn: () => null,
  signOut: () => null,
  userSession: null,
  isLoading: false,
  signiningIn: false,
  signiningOut: false,
  code: null,
  msg: '',
  closeSnackbar: () => null,
  snackbarVisible: false
});

export function useSession() {
  const value = React.useContext(SessionContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('userSignedIn');
  const { signIn: signInwithToken, signOut: signTokenOut, tokenSession } = useTokenSession();

  const [requestState, setRequestState] = useState<IRequestState>({
    signiningIn: false,
    msg: '',
    code: null,
    snackbarVisible: false,
    signiningOut: false
  })
  const { code, msg, signiningIn, snackbarVisible, signiningOut } = requestState;

  const onChange = (key: keyof IRequestState, value: string | number | boolean) => setRequestState((prev) => ({ ...prev, [key]: value }));

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

  const signIn = async (data: ISignInData) => {
    onChange('signiningIn', true);

    const returnedData: ISignInResponse = await FetchService.post({ data, url: '/auth/signin' })

    onChange('signiningIn', false);
    onChange('code', returnedData.code);
    onChange('msg', returnedData.msg);

    returnedData.user && setSession(JSON.stringify(returnedData.user));
    returnedData.user && signInwithToken(returnedData.token);

    if (!returnedData.user || !returnedData.token) {
      notify();
    }
  }

  const signOut = async () => {
    onChange('signiningOut', true);

    const returnedData: ISignInResponse = await FetchService.postWithBearerToken({ url: '/auth/signout', token: tokenSession as string })

    onChange('signiningOut', false);
    onChange('code', returnedData.code);
    onChange('msg', returnedData.msg);
    if (Number(returnedData.code) === 400) {
      notify();
    }
    if (Number(returnedData.code) === 200) {
      setSession(null);
      // signTokenOut(); just signout user
    }
  }

  return (
    <SessionContext.Provider
      value={{
        signIn,
        signOut,
        userSession: session,
        isLoading,
        signiningIn,
        code,
        msg,
        closeSnackbar,
        snackbarVisible,
        signiningOut
      }}>
      {props.children}
    </SessionContext.Provider>
  );
}
