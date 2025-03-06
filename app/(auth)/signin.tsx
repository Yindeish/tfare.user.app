import {
  View,
  Pressable,
  StyleSheet,
  TextInput,
  Platform,
  TextStyle,
  ViewStyle,
  KeyboardAvoidingView,
  ToastAndroid,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Href, Link, Redirect, router } from "expo-router";
import { useSession } from "../../contexts/userSignedInContext";
import SafeScreen from "../../components/shared/safeScreen";
import {
  ActivityIndicator,
  MD2Colors,
  Snackbar,
  Text,
} from "react-native-paper";
import { fonts } from "../../constants/fonts";
import {
  wFull,
  wHFull,
  flexCol,
  itemsStart,
  justifyCenter,
  justifyEnd,
  flex,
  itemsCenter,
  justifyBetween,
  mXAuto,
  flexCenter,
} from "../../utils/styles";
import Colors, { colors } from "../../constants/Colors";
import PaddedScreen from "@/components/shared/paddedScreen";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useSession as userTokenSession } from "@/contexts/userTokenContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { c, fs10 } from "@/utils/fontStyles";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import FetchService from "@/services/api/fetch.service";
import { pages } from "@/constants/pages";
import * as SecureStore from "expo-secure-store";
import { setState } from "@/state/slices/user";
import tw from "@/constants/tw";
import { useStorageState } from "@/hooks/useStorageState";
import { images } from "@/constants/images";
import {authenticateAsync, hasHardwareAsync, supportedAuthenticationTypesAsync} from 'expo-local-authentication';

const {
  signInTitle,
  textInput,
  form,
  forgotPassword,
  signInBtn,
  signInText,
  noAccount,
  signupLink,
  invalidEntryText,
} = StyleSheet.create({
  signInTitle: {
    fontWeight: "500",
    fontSize: 32,
    lineHeight: 32.08,
    color: MD2Colors.black,
    fontFamily: fonts.neurialGrotesk,
  },
  form: {
    width: "100%",
    height: "auto",
  },
  textInput: {
    borderColor: "#D7D7D7",
    borderWidth: 0.7,
    borderRadius: 10,
    width: "100%",
    height: 50,
    paddingHorizontal: 24,
    backgroundColor: "#F9F7F8",
  },
  forgotPassword: {
    fontFamily: fonts.neurialGrotesk,
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18.48,
    color: MD2Colors.black,
    marginLeft: "auto",
  },
  signInBtn: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    height: 50,
  },
  signInText: {
    color: colors.white,
    fontFamily: fonts.neurialGrotesk,
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 23.76,
  },
  noAccount: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 16.66,
    textAlign: "center",
    color: colors.black,
  },
  signupLink: {
    color: Colors.light.background,
    paddingLeft: 2,
  },
  invalidEntryText: {
    color: Colors.light.error,
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18.48,
  },
});

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  pin: Yup.string()
    .min(4, "Pin must be at least 4 characters")
    .required("Pin is required"),
});

export default function Signin() {
  // const { signIn, loadingState, userSession, msg, code, signOut, testSignIn } = useSession();
  const { closeSnackbar, snackbarVisible, Snackbar, notify } = useSnackbar();
  const { tokenSession } = userTokenSession();
  const dispatch = useAppDispatch();
  const [[_, biometricLogin], __] = useStorageState("biometricLogin");
  const [[_$, biometricEmail], __$] = useStorageState('biometricEmail');

  const [fetchState, setFetchState] = useState({
    msg: "",
    code: null,
    loading: false,
  });
  const { msg, loading, code } = fetchState;
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      pin: "",
    },
    validationSchema: SignInSchema,
    onSubmit: async (values) => {
      try {
        setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

        const returnedData = await FetchService.post({
          data: { ...values, role: "rider" },
          url: "/auth/signin",
        });

        notify({ msg: returnedData?.msg });
        const signedUpUser = returnedData?.signedUpUser;

        setFetchState((prev) => ({
          ...prev,
          msg: returnedData?.msg,
          code: returnedData?.code,
          loading: false,
        }));
        if (returnedData?.code === 200 || returnedData?.code === 201) {
          const signedinTime = new Date();
          const user = returnedData?.user;
          const token = returnedData?.token;

          try {
            await SecureStore.setItemAsync("user", JSON.stringify(user));
            await SecureStore.setItemAsync("token", token);
            await SecureStore.setItemAsync(
              "signedinTime",
              JSON.stringify(signedinTime)
            );

            dispatch(setState({ key: "user", value: user }));
            dispatch(setState({ key: "token", value: token }));
            router.replace("/(tab)");
          } catch (error: any) {
            throw new Error(error?.message);
          }

          router.replace(`/(tab)` as Href);
        }
      } catch (error: any) {
        console.log({ error });
        setFetchState((prev) => ({
          ...prev,
          msg: error?.message || "Error in signing in",
          code: 400 as never,
          loading: false,
        }));

        notify({ msg: error?.message || "Error in signing in" });
      }
    },
  });

  const commitBiometricSignin = async () => {
    if (!biometricAvailable) return;

    const result = await authenticateAsync({
      promptMessage: "Authenticate to sign in",
      fallbackLabel: "Enter PIN",
      cancelLabel: "Cancel",
    });

    if (result.success) {

      try {
        setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

        const returnedData = await FetchService.post({
          data: { email: biometricEmail, role: "rider" },
          url: "/auth/auto-signin",
        });

        notify({ msg: returnedData?.msg });

        setFetchState((prev) => ({
          ...prev,
          msg: returnedData?.msg,
          code: returnedData?.code,
          loading: false,
        }));

        if (returnedData?.code === 200 || returnedData?.code === 201) {
          const signedinTime = new Date();
          const user = returnedData?.user;
          const token = returnedData?.token;

          try {
            await SecureStore.setItemAsync("user", JSON.stringify(user));
            await SecureStore.setItemAsync("token", token);
            await SecureStore.setItemAsync(
              "signedinTime",
              JSON.stringify(signedinTime)
            );

            dispatch(setState({ key: "user", value: user }));
            dispatch(setState({ key: "token", value: token }));
            router.replace("/(tab)");
          } catch (error: any) {
            throw new Error(error?.message);
          }

          router.replace(`/(tab)` as Href);
        }
      } catch (error: any) {
        notify({ msg: error?.message});
      }
    } else {
      notify({ msg: "Biometric authentication failed" });
    }
  }

  const checkBiometricSupport = async () => {
    const hasHardware = await hasHardwareAsync();
    const supportedAuthTypes = await supportedAuthenticationTypesAsync();
    
    if (hasHardware && supportedAuthTypes.length > 0) {
      setBiometricAvailable(true);
    }
  };

  // useEffect(() => {
  //   if(biometricLogin === 'true' && (biometricEmail !== '' || biometricEmail !== null)) checkBiometricSupport();
  // }, [biometricLogin, biometricEmail]);

  // useEffect(() => {
  //   if (biometricAvailable && biometricLogin === 'true' && (biometricEmail !== '' || biometricEmail !== null)) {
  //     commitBiometricSignin();
  //   }
  // }, [biometricAvailable, biometricLogin, biometricEmail]);

  return (
    <SafeScreen>
      <View style={[flexCenter, { flex: 1 }]}>
        <ScrollView contentContainerStyle={[flexCenter, tw`w-full h-full`]}>
          <PaddedScreen styles={wHFull}>
            <View
              style={[wHFull, flexCol, itemsStart, justifyCenter, { gap: 40 }]}
            >
              <View style={[flexCol, wFull, { gap: 2 }]}>
                <Text style={signInTitle as TextStyle}>Sign in</Text>
                <Text style={signInTitle as TextStyle}>to continue</Text>
              </View>

              <View style={[form as ViewStyle, { gap: 16 }]}>
                <TextInput
                  style={[
                    textInput as TextStyle,
                    formik.errors.email && formik.touched.email
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ]}
                  placeholder="Email Address"
                  placeholderTextColor={Colors.light.textGrey}
                  keyboardType="email-address"
                  value={formik.values.email}
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  autoFocus
                />

                {formik.errors.email && formik.touched.email && (
                  <Text style={invalidEntryText as TextStyle}>
                    {formik.errors.email}
                  </Text>
                )}

                <TextInput
                  style={[
                    textInput as TextStyle,
                    formik.errors.pin && formik.touched.pin
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ]}
                  placeholder="4-Digit Pin Code"
                  placeholderTextColor={Colors.light.textGrey}
                  keyboardType="number-pad"
                  value={formik.values.pin}
                  secureTextEntry
                  onChangeText={formik.handleChange("pin")}
                  onBlur={formik.handleBlur("pin")}
                />
                {formik.errors.pin && formik.touched.pin && (
                  <Text style={invalidEntryText as TextStyle}>
                    {formik.errors.pin}
                  </Text>
                )}

                <View style={[wFull, flex, itemsCenter, justifyEnd]}>
                  <Text
                    onPress={() => router.push("/(auth)/(resetPin)/emailForm")}
                    style={[forgotPassword as TextStyle, tw`font-medium`]}
                  >
                    Forgot Pin Code?
                  </Text>
                </View>
              </View>

              <View
                style={tw`w-full h-[50px] flex flex-row gap-[10px] items-center`}
              >
                <Pressable
                  style={[
                    // wFull,
                    signInBtn as ViewStyle,
                    flex,
                    itemsCenter,
                    justifyCenter,
                    {flex: 1}
                  ]}
                  disabled={loading}
                  onPress={() => formik.handleSubmit()}
                >
                  {!loading ? (
                    <Text style={[signInText as TextStyle]}>Sign In</Text>
                  ) : (
                    <ActivityIndicator color={colors.white} size="small" />
                  )}
                </Pressable>

                {(biometricLogin === 'true' && (biometricEmail !== '' || biometricEmail !== null)) && <TouchableOpacity
                onPress={() => {
                  checkBiometricSupport();
                  commitBiometricSignin();
                }}
                  style={tw`w-[50px] h-full bg-[#EF5DA8] flex flex-row items-center justify-center rounded-[10px]`}
                >
                  <Image
                    style={tw`w-[24px] h-[24px]`}
                    source={
                      Platform.OS === "ios"
                        ? images.faceScan
                        : images.fingerprintScan
                    }
                  />
                </TouchableOpacity>}
              </View>

              <Text style={[noAccount as TextStyle, mXAuto as TextStyle]}>
                Don't have an account?
                <Link href={"/signup"}>
                  <Text style={signupLink as TextStyle}>Sign Up</Text>
                </Link>
              </Text>
            </View>

            <Snackbar
              msg={msg}
              onDismiss={() => closeSnackbar()}
              snackbarVisible={snackbarVisible}
            />
          </PaddedScreen>
        </ScrollView>
      </View>
    </SafeScreen>
  );
}
