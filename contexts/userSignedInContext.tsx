import React, { useEffect, useState } from "react";
import { useStorageState } from "../hooks/useStorageState";
import FetchService from "../services/api/fetch.service";
import { useSession as useTokenSession } from "./userTokenContext";
import { Platform, ToastAndroid } from "react-native";
import {
  IRequestData,
  ISigninContext,
  ISigninContextState,
  ISigninResponseData,
  TSigninLoadingState,
} from "./signin.context.interface";
import { IResponseData } from "./shared.interface";
import { useSnackbar } from "./snackbar.context";
import { IUserAccount } from "../state/types/account";
import { Href, router } from "expo-router";
import { setState } from "@/state/slices/user";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";

const SessionContext = React.createContext<
  ISigninContext & { testSignIn: (data: IRequestData) => void }
>({
  signIn: () => null,
  testSignIn: () => null,
  signOut: () => null,
  userSession: null,
  isLoading: false,
  code: null,
  msg: "",
  user: null,
  loadingState: "idle",
});

export function useSession() {
  const value = React.useContext(SessionContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const dispatch = useAppDispatch();

  const [[isLoading, userSession], setSession] = useStorageState("user");
  const [[signedinTimeLoading, signedinTimeSession], setSignedinTimeSession] =
    useStorageState("signedinTime");

  const {
    signIn: signInwithToken,
    signOut: signTokenOut,
    tokenSession,
  } = useTokenSession();
  const { closeSnackbar, openSnackbar, snackbarVisible } = useSnackbar();


  const parsedSession = JSON.parse(userSession as string) as IUserAccount;

  const [contextState, setRequestState] = useState<ISigninContextState>({
    msg: "",
    code: null,
    user: userSession ? parsedSession : null,
    loadingState: "idle",
  });
  const { code, msg, user, loadingState } = contextState;

  const onChange = (
    key: keyof ISigninContextState,
    value: string | number | boolean | TSigninLoadingState | IUserAccount
  ) => setRequestState((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (parsedSession && !user) {
      onChange("user", parsedSession);
    }
  }, [parsedSession]);

  const notify = (timeout: number = 2000) => {
    openSnackbar();

    setTimeout(() => {
      // closeSnackbar()
      onChange("msg", "");
    }, timeout);
    // if (Platform.OS == 'android') ToastAndroid.show(msg, ToastAndroid.SHORT)
  };

  const signIn = async (data: IRequestData) => {
    onChange("loadingState", "signingin" as TSigninLoadingState);

    const returnedData: ISigninResponseData = await FetchService.post({
      data: {
        ...data,
        role: "rider",
      },
      url: "/auth/signin",
    });

    onChange("loadingState", "idle" as TSigninLoadingState);
    onChange("code", returnedData.code as number);
    onChange("msg", returnedData.msg);

    if (returnedData.user) {
      setSession(JSON.stringify(returnedData.user));
      signInwithToken(returnedData.token);

      dispatch(setState({ key: "user", value: returnedData.user }));
      dispatch(setState({ key: "token", value: returnedData.token }));

      const signedinTime = new Date();
      setSignedinTimeSession(JSON.stringify(signedinTime));
      router.replace("/(tab)/" as Href);
    }

    if (!returnedData.user || !returnedData.token) {
      notify();
    }

    // signInwithToken('token'); setSession(JSON.stringify({ user: 'user' }));  // for testing
  };

  const testSignIn = async (data: IRequestData) => {
    onChange("loadingState", "signingin" as TSigninLoadingState);

    onChange("loadingState", "idle" as TSigninLoadingState);

    dispatch(
      setState({
        key: "user",
        value: {
          phoneNumber: 89878977826,
          profileName: "Rider00",
          fullName: "Rider00",
          email: "rider00@gmail.com",
          role: "rider",
          createdAt: "2024-11-09T21:57:01.240Z",
          updatedAt: "2024-12-16T18:29:06.361Z",
          __v: 0,
          picture:
            "https://res.cloudinary.com/dg46gpi4v/image/upload/v1734373524/ridersImages/kd1ajulsz7ujaazgvy6l.png",
          accountSecurity: {
            pin: "$2b$10$7AZVbVYBSc8tYmeUe7C0ZukjMPH/Ch5dbuMg6HYbIwEkE.wRe/bxS",
            deactivated: false,
            deleted: false,
            biometricLogin: false,
          },
          _id: "672fdaad44ada8750bec6856",
          riderProfile: {},
        },
      })
    );
    dispatch(
      setState({
        key: "token",
        value:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJmZGFhZDQ0YWRhODc1MGJlYzY4NTYiLCJpYXQiOjE3MzQ4NTY4NzQsImV4cCI6MTczNDk0MzI3NH0.XUqVEizFfFosxTjLR1CDG6WtE-y2jvQqNx5mUne3cBk",
      })
    );
    router.replace("/(tab)/" as Href);

    // signInwithToken('token'); setSession(JSON.stringify({ user: 'user' }));  // for testing
  };

  const signOut = async () => {
    onChange("loadingState", "signingout" as TSigninLoadingState);
    // const returnedData: IResponseData = await FetchService.postWithBearerToken({ url: '/auth/signout', token: tokenSession as string })

    // onChange('loadingState', 'idle' as TSigninLoadingState);
    // onChange('code', returnedData.code as number);
    // onChange('msg', returnedData.msg);

    // if (Number(returnedData.code) === 400) {
    //   notify();
    // }
    // if (returnedData.msg === 'Token expired. Signin required!') {
    //   setSession(null);
    // }
    // if (Number(returnedData.code) === 200) {
    //   setSession(null);
    //   // signTokenOut(); //just signout user
    // }

    dispatch(setState({ key: "user", value: null }));
    dispatch(setState({ key: "token", value: null }));
    setSession(null);

    onChange("loadingState", "idle" as TSigninLoadingState);

    if(!user) {
      setTimeout(() => {
        router.replace("/(auth)/signin" as Href);
      }, 1500)
    }
    // setSession(null); signTokenOut(); //for testing
  };

  return (
    <SessionContext.Provider
      value={{
        signIn,
        testSignIn,
        signOut,
        userSession: userSession,
        isLoading,
        code,
        msg,
        user,
        loadingState,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}
