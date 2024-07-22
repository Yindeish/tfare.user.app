import { View, Pressable, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, Redirect, router } from 'expo-router'
import { useSession } from '../../contexts/userSignedInContext';
import SafeScreen from '../../components/shared/safeScreen';
import { ActivityIndicator, MD2Colors, Snackbar, Text } from 'react-native-paper';
import { fonts } from '../../constants/fonts';
import { bg, flex, flexCenter, flexCol, flexYCenter, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyEnd, mLAuto, mXAuto, pAuto, pLAuto, wFull, wHFull } from '../../utils/styles';
import Colors, { colors } from '../../constants/Colors';
import PaddedScreen from '@/components/shared/paddedScreen';

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
        paddingTop: 'auto',
        paddingBottom: 'auto',
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
        fontFamily: fonts.neurialGrotesk
    }
});

type TSigninFormData = 'idle' | 'invalid' | 'valid'

interface ISigninFormData {
    email: string,
    password: string,
    invalidFeildsStatus: TSigninFormData,
}

export default function signin() {
    const { signIn, loadingState, userSession, msg, code, closeSnackbar, snackbarVisible } = useSession();

    // if there's user
    if (userSession) return <Redirect href="/(tab)/" />;
    // if there's user

    let [secureTextEntry, setSecureTextEntry] = useState(true);
    const [formData, setFormData] = useState<ISigninFormData>({
        email: 'adeshinaadam03@gmail.com',
        password: 'Yindeish03@',
        invalidFeildsStatus: 'idle',
    })
    const { email, password, invalidFeildsStatus } = formData;

    const onChange = (key: keyof ISigninFormData, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

    const validateFields = () => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9]).+$/;
        const passwordValid = passwordRegex.test(password);
        const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailVaild = emailRegExp.test(email);

        if (!passwordValid || !emailVaild) onChange('invalidFeildsStatus', 'invalid' as TSigninFormData)
        else onChange('invalidFeildsStatus', 'valid' as TSigninFormData)
    }

    const commitSignin = () => {
        validateFields();
        if (invalidFeildsStatus === 'valid') {
            signIn({ email, password });
        }
        if (invalidFeildsStatus === 'invalid') {
            return;
        }
    }


    return (
        <SafeScreen>
            <PaddedScreen styles={wHFull}>
                <View style={[wHFull, flexCol, itemsStart, justifyCenter, { gap: 40 }]}>
                    <View style={[flexCol, wFull, { gap: 2 }]}>
                        <Text style={signInTitle}>Sign in</Text>
                        <Text style={signInTitle}>to continue</Text>
                    </View>

                    <View style={[form, flexYCenter, { gap: 16 }]}>
                        <TextInput
                            style={[textInput, invalidFeildsStatus === 'invalid' && { borderColor: Colors.light.error }]}
                            placeholder='Email Address'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.textGrey}
                            value={email}
                            autoFocus
                            cursorColor={Colors.light.textGrey}
                            onChangeText={(text) => {
                                onChange('email', text)
                                validateFields();
                            }}
                            onBlur={() => validateFields()}
                        />

                        <TextInput
                            style={[textInput, invalidFeildsStatus === 'invalid' && { borderColor: Colors.light.error }]}
                            placeholder="Password"
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.textGrey}
                            value={password}
                            secureTextEntry={secureTextEntry}
                            onChangeText={(text) => {
                                onChange('password', text)
                                validateFields();
                            }}
                            onBlur={() => validateFields()}
                        />

                        <View style={[wFull, flex, itemsCenter, invalidFeildsStatus === 'invalid' ? justifyBetween : justifyEnd]}>
                            {invalidFeildsStatus === 'invalid' && msg === '' && (<Text style={invalidEntryText}>Incorrect email or password</Text>)}
                            {invalidFeildsStatus === 'valid' && code !== 200 && msg !== '' && (<Text style={invalidEntryText}>{msg}</Text>)}

                            <Text style={[forgotPassword]}>Forgot Password?</Text>
                        </View>
                    </View>

                    <Pressable style={[wFull, signInBtn, flex, itemsCenter, justifyCenter]} disabled={loadingState === 'signingin'} onPress={() => commitSignin()}>
                        {loadingState === 'idle' ?
                            (<Text style={[flex, itemsCenter, justifyCenter, signInText,]}>Sign In</Text>)
                            :
                            (<ActivityIndicator color={colors.white} size={'small'} />)
                        }
                    </Pressable>

                    <Text style={[noAccount, mXAuto]}>
                        Don't have an account?
                        <Link href={'/signup'}>
                            <Text style={signupLink}>Sign Up</Text>
                        </Link>
                    </Text>
                </View>

                {/* Snackbar */}
                <Snackbar
                    style={[]}
                    visible={snackbarVisible}
                    onDismiss={() => closeSnackbar()}
                    action={{
                        label: 'close',
                        onPress: () => {
                        },
                    }}>
                    {msg}
                </Snackbar>
                {/* Snackbar */}
            </PaddedScreen>
        </SafeScreen>
    )
}