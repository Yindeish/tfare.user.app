import React, { useState } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import FetchService from '@/services/api/fetch.service';
import { useSession as useTokenSession } from './userTokenContext';
import { Platform, ToastAndroid } from 'react-native';
import { pages } from '@/constants/pages';
import { router } from 'expo-router';
import { IContextState, IRequestData, ISigninContext, ISigninContextState, ISigninResponseData, TSigninLoadingState } from './signin.context.interface';
import { IResponseData } from './shared.interface';

const SessionContext = React.createContext<ISigninContext>({
  signIn: () => null,
  signOut: () => null,
  userSession: null,
  isLoading: false,
  code: null,
  msg: '',
  closeSnackbar: () => null,
  snackbarVisible: false,
  user: null,
  loadingState: 'idle'
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

  const [requestState, setRequestState] = useState<ISigninContextState>({
    msg: '',
    code: null,
    snackbarVisible: false,
    user: session ? JSON.parse(session as string) : null,
    loadingState: 'idle'
  })
  const { code, msg, snackbarVisible, user, loadingState } = requestState;

  const onChange = (key: keyof ISigninContextState, value: string | number | boolean | TSigninLoadingState) => setRequestState((prev) => ({ ...prev, [key]: value }));

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

  const signIn = async (data: IRequestData) => {
    onChange('loadingState', 'signingin' as TSigninLoadingState);

    const returnedData: ISigninResponseData = await FetchService.post({ data, url: '/auth/signin' })

    onChange('loadingState', 'idle' as TSigninLoadingState);
    onChange('code', returnedData.code as number);
    onChange('msg', returnedData.msg);

    returnedData.user && !returnedData.user.deactivated && setSession(JSON.stringify(returnedData.user));
    returnedData.user && !returnedData.user.deactivated && signInwithToken(returnedData.token);

    returnedData.user && returnedData.user.deactivated && router.replace(`/(auth)/${pages.securityQuestion}`);

    if (!returnedData.user || !returnedData.token) {
      notify();
    }
  }

  const signOut = async () => {
    onChange('loadingState', 'signingout' as TSigninLoadingState);

    const returnedData: IResponseData = await FetchService.postWithBearerToken({ url: '/auth/signout', token: tokenSession as string })

    onChange('loadingState', 'idle' as TSigninLoadingState);
    onChange('code', returnedData.code as number);
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
        code,
        msg,
        closeSnackbar,
        snackbarVisible,
        user,
        loadingState
      }}>
      {props.children}
    </SessionContext.Provider>
  );
}
