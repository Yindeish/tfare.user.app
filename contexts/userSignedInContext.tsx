import React, { useState } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import AxiosService from '@/services/api/axio.service';
import URLS from '@/constants/urls';
import FetchService from '@/services/api/fetch.service';
import { IUser, IUserAccount } from '@/state/types/account';
import { useSession as useTokenSession } from './userTokenContext';

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
  msg: string,
  code: number | null,
}

const SessionContext = React.createContext<{
  signIn: (data: ISignInData) => void;
  signOut: () => void,
  userSession?: string | null,
  isLoading: boolean,
  signiningIn: boolean,
  msg: string,
  code: number | null,
}>({
  signIn: () => null,
  signOut: () => null,
  userSession: null,
  isLoading: false,
  signiningIn: false,
  code: null,
  msg: '',
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
  const { signIn: signInwithToken, tokenSession, isLoading: TokenIsLoading } = useTokenSession();

  const [requestState, setRequestState] = useState<IRequestState>({
    signiningIn: false,
    msg: '',
    code: null,
  })
  const { code, msg, signiningIn } = requestState;

  const onChange = (key: keyof IRequestState, value: string | number | boolean) => setRequestState((prev) => ({ ...prev, [key]: value }));

  const signIn = async (data: ISignInData) => {
    onChange('signiningIn', true);

    const returnedData: ISignInResponse = await FetchService.post({ data, url: '/auth/signin' })

    onChange('signiningIn', false);
    onChange('code', returnedData.code);
    onChange('msg', returnedData.msg);

    returnedData.user && setSession(JSON.stringify(returnedData.user));
    returnedData.user && signInwithToken(returnedData.token);
  }

  const signOut = () => {
    // AxiosService.post({
    //   url: '/auth/signin'
    // })

    // token is set here
    setSession(null);
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
      }}>
      {props.children}
    </SessionContext.Provider>
  );
}
