import React, { useEffect, useState } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import FetchService from '../services/api/fetch.service';
import { useSession as useTokenSession } from './userTokenContext';
import { Platform, ToastAndroid } from 'react-native';
import { IRequestData, ISigninContext, ISigninContextState, ISigninResponseData, TSigninLoadingState } from './signin.context.interface';
import { IResponseData } from './shared.interface';
import { useSnackbar } from './snackbar.context';
import { IUserAccount } from '../state/types/account';
import { router } from 'expo-router';

const SessionContext = React.createContext<ISigninContext>({
  signIn: () => null,
  signOut: () => null,
  userSession: null,
  isLoading: false,
  code: null,
  msg: '',
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
  const { closeSnackbar, openSnackbar, snackbarVisible } = useSnackbar();

  const parsedSession = JSON.parse(session as string) as IUserAccount;

  const [contextState, setRequestState] = useState<ISigninContextState>({
    msg: '',
    code: null,
    user: session ? parsedSession : null,
    loadingState: 'idle'
  })
  const { code, msg, user, loadingState } = contextState;

  const onChange = (key: keyof ISigninContextState, value: string | number | boolean | TSigninLoadingState | IUserAccount) => setRequestState((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (parsedSession && !user) {
      onChange('user', parsedSession)
    }
  }, [parsedSession])


  const notify = (timeout: number = 2000) => {
    openSnackbar()

    setTimeout(() => {
      closeSnackbar()
      onChange('msg', '');
    }, timeout);
    if (Platform.OS == 'android') ToastAndroid.show(msg, ToastAndroid.SHORT)
  }

  const signIn = async (data: IRequestData) => {
    // onChange('loadingState', 'signingin' as TSigninLoadingState);

    // const returnedData: ISigninResponseData = await FetchService.post({ data, url: '/auth/signin' })

    // onChange('loadingState', 'idle' as TSigninLoadingState);
    // onChange('code', returnedData.code as number);
    // onChange('msg', returnedData.msg);

    // returnedData.user && setSession(JSON.stringify(returnedData.user));
    // returnedData.user && signInwithToken(returnedData.token);

    // if (!returnedData.user || !returnedData.token) {
    //   notify();
    // }

    signInwithToken('token'); setSession(JSON.stringify({ user: 'user' }));  // for testing

  }

  const signOut = async () => {
    // onChange('loadingState', 'signingout' as TSigninLoadingState);
    // const returnedData: IResponseData = await FetchService.postWithBearerToken({ url: '/auth/signout', token: tokenSession as string })

    // onChange('loadingState', 'idle' as TSigninLoadingState);
    // onChange('code', returnedData.code as number);
    // onChange('msg', returnedData.msg);

    // if (Number(returnedData.code) === 400) {
    //   notify();
    // }
    // if (Number(returnedData.code) === 200) {
    //   setSession(null);
    //   // signTokenOut(); //just signout user
    // }

    setSession(null); signTokenOut(); //for testing
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
        user,
        loadingState
      }}>
      {props.children}
    </SessionContext.Provider>
  );
}
