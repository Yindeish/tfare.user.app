import { View, Pressable, StyleSheet, TextInput, Platform, TextStyle, ViewStyle, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Href, Link, Redirect } from 'expo-router'
import { useSession } from '../../contexts/userSignedInContext';
import SafeScreen from '../../components/shared/safeScreen';
import { ActivityIndicator, MD2Colors, Snackbar, Text } from 'react-native-paper';
import { fonts } from '../../constants/fonts';
import { wFull, wHFull, flexCol, itemsStart, justifyCenter, justifyEnd, flex, itemsCenter, justifyBetween, mXAuto, flexCenter } from '../../utils/styles';
import Colors, { colors } from '../../constants/Colors';
import PaddedScreen from '@/components/shared/paddedScreen';
import { useSnackbar } from '@/contexts/snackbar.context';
import { useSession as userTokenSession } from '@/contexts/userTokenContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ScrollView } from 'react-native-gesture-handler';
import { c, fs10 } from '@/utils/fontStyles';
import { useAppSelector } from '@/state/hooks/useReduxToolkit';

const { signInTitle, textInput, form, forgotPassword, signInBtn, signInText, noAccount, signupLink, invalidEntryText } = StyleSheet.create({
    signInTitle: {
        fontWeight: '500',
        fontSize: 32,
        lineHeight: 32.08,
        color: MD2Colors.black,
        fontFamily: fonts.neurialGrotesk,
    },
    form: {
        width: '100%',
        height: 'auto',
    },
    textInput: {
        borderColor: '#D7D7D7',
        borderWidth: 0.7,
        borderRadius: 10,
        width: '100%',
        height: 50,
        paddingHorizontal: 24,
        backgroundColor: '#F9F7F8',
    },
    forgotPassword: {
        fontFamily: fonts.neurialGrotesk,
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 18.48,
        color: MD2Colors.black,
        marginLeft: 'auto'
    },
    signInBtn: {
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        height: 50,
    },
    signInText: {
        color: colors.white,
        fontFamily: fonts.neurialGrotesk,
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 23.76
    },
    noAccount: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 16.66,
        textAlign: 'center',
        color: colors.black
    },
    signupLink: {
        color: Colors.light.background,
        paddingLeft: 2
    },
    invalidEntryText: {
        color: Colors.light.error,
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 18.48,
    }
});

interface ISigninFormData {
    email: string;
    pin: string;
}

const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    pin: Yup.string().min(4, 'Pin must be at least 4 characters').required('Pin is required'),
});

export default function Signin() {
    const { signIn, loadingState, userSession, msg, code, signOut, testSignIn } = useSession();
    const { closeSnackbar, snackbarVisible } = useSnackbar();
    const { tokenSession } = userTokenSession();
    const {user} = useAppSelector(state => state.user);

    if (user) return <Redirect href={"/(tab)/" as Href} />;

    const formik = useFormik({
        initialValues: {
            email: '',
            pin: '',
        },
        validationSchema: SignInSchema,
        onSubmit: (values) => {
            signIn({ email: values.email, pin: values.pin });
            // testSignIn({ email: values.email, pin: values.pin });
        },
    });

    return (
        <SafeScreen>
            <View style={[flexCenter, { flex: 1 }]}>
                <ScrollView contentContainerStyle={[flexCenter]}>
                    <PaddedScreen styles={wHFull}>
                        <View style={[wHFull, flexCol, itemsStart, justifyCenter, { gap: 40 }]}>
                            <View style={[flexCol, wFull, { gap: 2 }]}>
                                <Text style={signInTitle as TextStyle}>Sign in</Text>
                                <Text style={signInTitle as TextStyle}>to continue</Text>
                            </View>

                            {/* <KeyboardAvoidingView style={[form as ViewStyle, { gap: 16 }]}> */}
                            <View style={[form as ViewStyle, { gap: 16 }]}>
                                <TextInput
                                    style={[
                                        textInput as TextStyle,
                                        formik.errors.email && formik.touched.email ? { borderColor: Colors.light.error } : undefined
                                    ]}
                                    placeholder='Email Address'
                                    placeholderTextColor={Colors.light.textGrey}
                                    keyboardType='email-address'
                                    value={formik.values.email}
                                    onChangeText={formik.handleChange('email')}
                                    onBlur={formik.handleBlur('email')}
                                    autoFocus
                                />

                                {formik.errors.email && formik.touched.email && (
                                    <Text style={invalidEntryText as TextStyle}>{formik.errors.email}</Text>
                                )}

                                <TextInput
                                    style={[
                                        textInput as TextStyle,
                                        formik.errors.pin && formik.touched.pin ? { borderColor: Colors.light.error } : undefined
                                    ]}
                                    placeholder='4-Digit Pin Code'
                                    placeholderTextColor={Colors.light.textGrey}
                                    keyboardType='number-pad'
                                    value={formik.values.pin}
                                    secureTextEntry
                                    onChangeText={formik.handleChange('pin')}
                                    onBlur={formik.handleBlur('pin')}
                                />
                                {formik.errors.pin && formik.touched.pin && (
                                    <Text style={invalidEntryText as TextStyle}>{formik.errors.pin}</Text>
                                )}

                                <View style={[wFull, flex, itemsCenter, justifyEnd]}>
                                    <Text style={[forgotPassword as TextStyle]}>Forgot Password?</Text>
                                </View>
                            </View>
                            {/* </KeyboardAvoidingView> */}

                            <Text style={[fs10, c(colors.red500)]}>{msg}</Text>

                            <Pressable
                                style={[wFull, signInBtn as ViewStyle, flex, itemsCenter, justifyCenter]}
                                disabled={loadingState === 'signingin'}
                                onPress={() => formik.handleSubmit()}
                            >
                                {loadingState === 'idle' ? (
                                    <Text style={[signInText as TextStyle]}>Sign In</Text>
                                ) : (
                                    <ActivityIndicator color={colors.white} size='small' />
                                )}
                            </Pressable>

                            <Text style={[noAccount as TextStyle, mXAuto as TextStyle]}>
                                Don't have an account?
                                <Link href={'/signup'}>
                                    <Text style={signupLink as TextStyle}>Sign Up</Text>
                                </Link>
                            </Text>
                        </View>

                        {/* {Platform.OS === 'ios' && (
                            <Snackbar
                                visible={snackbarVisible}
                                onDismiss={() => closeSnackbar()}
                                action={{ label: 'close', onPress: () => { } }}
                            >
                                {msg}
                            </Snackbar>
                        )} */}
                    </PaddedScreen>
                </ScrollView>
            </View>
        </SafeScreen>
    );
}
