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
  pb,
} from "../../../utils/styles";
import Colors, { colors } from "../../../constants/Colors";
import PaddedScreen from "@/components/shared/paddedScreen";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useSession as userTokenSession } from "@/contexts/userTokenContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { c, fs10, neurialGrotesk } from "@/utils/fontStyles";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import FetchService from "@/services/api/fetch.service";
import { pages } from "@/constants/pages";
import * as SecureStore from "expo-secure-store";
import { setState } from "@/state/slices/user";
import { fonts } from "@/constants/fonts";
import SafeScreen from "@/components/shared/safeScreen";
import tw from "@/constants/tw";

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

export default function EamilForm() {
  const { closeSnackbar, snackbarVisible, Snackbar, notify } = useSnackbar();
  const dispatch = useAppDispatch();

  const [fetchState, setFetchState] = useState({
    msg: "",
    code: null,
    loading: false,
  });
  const { msg, loading, code } = fetchState;

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid Email address"
        ),
    }),
    onSubmit: async ({ email }) => {
      try {
        setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

        const returnedData = await FetchService.patch({
          data: { email },
          url: "/auth/forgot-password",
        });

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
          router.replace(`/(auth)/(resetPin)/codeForm` as Href);
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
              style={[wHFull, flexCol, itemsStart, justifyEnd, pb(40), { gap: 40 }]}
            >
                <View />

              <View>
                <View style={[flexCol, wFull, { gap: 2 }]}>
                  <Text style={signInTitle as TextStyle}>Reset</Text>
                  <Text style={signInTitle as TextStyle}>Pin Code</Text>
                </View>

                <View style={[flexCol, wFull, { gap: 2 }]}>
                  <Text
                    style={[
                      tw`text-[14px] text-black font-regular`,
                      neurialGrotesk,
                    ]}
                  >
                    A reset code will be sent to your registered email{" "}
                  </Text>
                  <Text
                    style={[
                      tw`text-[14px] text-black font-regular`,
                      neurialGrotesk,
                    ]}
                  >
                    address
                  </Text>
                </View>
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
                    <Text style={[signInText as TextStyle]}>
                      Send Reset Code
                    </Text>
                  ) : (
                    <ActivityIndicator color={colors.white} size="small" />
                  )}
                </Pressable>

                <Text style={[noAccount as TextStyle, mXAuto , mt(120)] as TextStyle[]}>
                  Don't have an account?
                  <Link href={"/(auth)/signup"}>
                    <Text style={signupLink as TextStyle}>Sign Up</Text>
                  </Link>
                </Text>
              </View>
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
