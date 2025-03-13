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
} from "react-native";
import React, { useState } from "react";
import { Href, Link, Redirect, router } from "expo-router";
import {
  ActivityIndicator,
  MD2Colors,
  Snackbar,
  Text,
} from "react-native-paper";
import { fonts } from "../../../constants/fonts";
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
  mt,
} from "../../../utils/styles";
import Colors, { colors } from "../../../constants/Colors";
import PaddedScreen from "@/components/shared/paddedScreen";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useSession as userTokenSession } from "@/contexts/userTokenContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { c, fs10 } from "@/utils/fontStyles";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import FetchService from "@/services/api/fetch.service";
import SafeScreen from "@/components/shared/safeScreen";
import tw from "@/constants/tw";
import FetchConfig from "@/services/api/fetch.config";
import { getItemAsync } from "expo-secure-store";

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

export default function Signin() {
  // const { signIn, loadingState, userSession, msg, code, signOut, testSignIn } = useSession();
  const { closeSnackbar, snackbarVisible, Snackbar, notify } = useSnackbar();
  const { tokenSession } = userTokenSession();
  const dispatch = useAppDispatch();

  const [fetchState, setFetchState] = useState({
    msg: "",
    code: null,
    loading: false,
  });
  const { msg, loading, code } = fetchState;

  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const formik = useFormik({
    initialValues: {
      pin: "",
      confirmPin: "",
    },
    validationSchema: Yup.object().shape({
      pin: Yup.number()
        .min(4, "Pin must be at least 4 digits")
        .required("Pin is required"),
      confirmPin: Yup.number()
        .oneOf([Yup.ref("pin")], "Pin don't match!")
        .required("Confirm your pin"),
    }),
    onSubmit: async ({ confirmPin, pin }) => {
      try {
        setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

        const token = await getItemAsync('pin-reset-token')

        const response = await fetch(`${FetchConfig.baseUrl}/auth/reset-password`, {
            method: FetchConfig.methods.POST,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ pin })
        });

        const returnedData = await response.json();

        const msg = returnedData?.msg;
        const code = returnedData?.code;

        notify({ msg });

        setFetchState((prev) => ({
          ...prev,
          msg,
          code,
          loading: false,
        }));
        if (returnedData?.code === 200 || returnedData?.code === 201) {
          router.replace(`/(auth)/signin` as Href);
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

  return (
    <SafeScreen>
      <View style={[flexCenter, { flex: 1 }]}>
        <ScrollView contentContainerStyle={[flexCenter, tw`w-full h-full`]}>
          <PaddedScreen styles={wHFull}>
            <View
              style={[wHFull, flexCol, itemsStart, justifyCenter, { gap: 40 }]}
            >
              <View style={[flexCol, wFull, { gap: 2 }]}>
                <Text style={signInTitle as TextStyle}>
                  Enter New <Text style={[tw`text-black font-bold`]}>4-</Text>
                </Text>
                <Text style={signInTitle as TextStyle}>Digit Pin code</Text>
              </View>

              <View style={[form as ViewStyle, { gap: 16 }]}>
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
                  autoCorrect={false}
                  secureTextEntry
                  onChangeText={formik.handleChange("pin")}
                  onBlur={formik.handleBlur("pin")}
                />
                {formik.errors.pin && formik.touched.pin && (
                  <Text style={invalidEntryText as TextStyle}>
                    {formik.errors.pin}
                  </Text>
                )}

                <TextInput
                  style={[
                    textInput as TextStyle,
                    formik.errors.confirmPin && formik.touched.confirmPin
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ]}
                  placeholder="Confirm 4-Digit Pin Code"
                  placeholderTextColor={Colors.light.textGrey}
                  keyboardType="number-pad"
                  value={formik.values.confirmPin}
                  autoCorrect={false}
                  secureTextEntry
                  onChangeText={formik.handleChange("confirmPin")}
                  onBlur={formik.handleBlur("confirmPin")}
                />
                {formik.errors.confirmPin && formik.touched.confirmPin && (
                  <Text style={invalidEntryText as TextStyle}>
                    {formik.errors.confirmPin}
                  </Text>
                )}
              </View>

              <Pressable
                style={[
                  wFull,
                  signInBtn as ViewStyle,
                  flex,
                  itemsCenter,
                  justifyCenter,
                  mt(120),
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
