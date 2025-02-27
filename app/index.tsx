import "expo-dev-client";
import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { Href, Redirect, SplashScreen } from "expo-router";
import { useSession } from "../contexts/userTokenContext";
import { useSession as userSession } from "../contexts/userSignedInContext";
import { pages } from "../constants/pages";
import FetchService from "@/services/api/fetch.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import * as SecureStore from "expo-secure-store";
import { setState } from "@/state/slices/user";
import tw from "@/constants/tw";


export default function Index() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.user);

  const [userLoading, setUserLoading] = useState(true);
  const [userSession, setUserSession] = useState<string | null>(null);
  const [tokenSession, setTokenSession] = useState<string | null>(null);
  const [signedinTimeSession, setSignedinTimeSession] = useState<string | null>(
    null
  );

  const { width, height } = Dimensions.get("window");

  console.log({ userSession, tokenSession, signedinTimeSession });

  const loadUserData = async () => {
    try {
      const user = await SecureStore.getItemAsync("user");
      const signedinTime = await SecureStore.getItemAsync("signedinTime");
      const token = await SecureStore.getItemAsync("token");

      setUserSession(user);
      setTokenSession(token);
      setSignedinTimeSession(signedinTime);
      setUserLoading(false); // Data is loaded, hide loading state
    } catch (error) {
      console.error("Error fetching data from SecureStore:", error);
      setUserLoading(false);
    }
  };

  const getToken = async () => {
    await SecureStore.getItemAsync('token')
    .then(token => token)
    .catch((err:any) => {
      throw new Error(err)
    })
  }

  const setToken = async (value: string) => {
    await SecureStore.setItemAsync('token', value)
    .then(() => console.log('token set'))
    .catch((err:any) => {
      throw new Error(err)
    })
  }

  useEffect(() => {
    // Prevent the splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync();

    // Fetch user data and signed in time from SecureStore asynchronously

    loadUserData();
  }, []);

  useEffect(() => {
   if(!tokenSession || !userSession) loadUserData();
  }, [token, user])

  // Check session validity and update Redux state
  useEffect(() => {
    if (userSession && signedinTimeSession) {
      const parsedUser = JSON.parse(userSession);
      const parsedSigninTime = JSON.parse(signedinTimeSession);

      const signedinTime = new Date(parsedSigninTime);
      const currentTime = new Date();
      const maxSessionDuration = 23 * 60 * 60 * 1000; // 23 hours in milliseconds

      if (
        !isNaN(signedinTime.getTime()) &&
        currentTime.getTime() - signedinTime.getTime() <= maxSessionDuration
      ) {
        console.log("setting state");
        dispatch(setState({ key: "user", value: parsedUser as never }));
        dispatch(setState({ key: "token", value: tokenSession as never }));
      } else {
        dispatch(setState({ key: "user", value: null as never }));

        setToken('');
      }
    } else {
      dispatch(setState({ key: "user", value: null as never }));
    }
  }, [userSession, signedinTimeSession, dispatch]);

  // Loading state
  useEffect(() => {
    if (!userLoading) {
      // Hide splash screen after data is loaded
      SplashScreen.hideAsync();
    }
  }, [userLoading]);

  // If user is still loading
  if (userLoading) {
    return null; // Don't render anything while loading; splash screen will remain
  }

  if (userSession != null && tokenSession) return  <Redirect href={"/(tab)/" as Href} />;

  if (userSession == null && !tokenSession && signedinTimeSession) {
    return <Redirect href="/(auth)/signin" />; // uncomment after testing
    // return <Redirect href={`/(rideScreens)/1/${pages.tripHistory}`} />; // part of testing
    // return <Redirect href={`/(rideScreens)/${pages.tripHistory}`} />; // part of testing
  }

  // return null;
  if(userSession == null && !tokenSession && !signedinTimeSession) {
    return <Redirect href={`/introScreen` as Href} />;
}
}
