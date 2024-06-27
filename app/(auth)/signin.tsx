import { View, Pressable, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import { useSession } from '@/contexts/userSignedInContext';
import { useSession as useTokenSession } from '@/contexts/userTokenContext';
import SafeScreen from '@/components/safeScreen';
import { MD2Colors, Text } from 'react-native-paper';
import { fonts } from '@/constants/fonts';
import { flex, flexCenter, flexCol, flexYCenter, itemsCenter, justifyBetween, justifyEnd, mLAuto, mXAuto, pAuto, pLAuto, wFull, wHFull } from '@/utils/styles';
import Colors, { colors } from '@/constants/Colors';

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
        fontFamily: fonts.neurialGrotesk,
    },
    forgotPassword: {
        fontFamily: fonts.neurialGrotesk,
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 18.48,
        color: MD2Colors.black,
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
        fontFamily: fonts.neurialGrotesk,
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

export default function signin() {
    const { signIn } = useSession();
    const { signIn: signInwithToken, session, isLoading } = useTokenSession();

    let [secureTextEntry, setSecureTextEntry] = useState(true);
    let [invalidEntry, setInvalidEntery] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData;

    const onChange = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

    useEffect(() => {
        console.log({ session })
    }, [session])


    return (
        <SafeScreen>
            <View style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 40 }}>
                <View style={[flexCol, { gap: 2 }]}>
                    <Text style={signInTitle}>Sign in</Text>
                    <Text style={signInTitle}>to continue</Text>
                </View>

                <View style={[form, flexYCenter, { gap: 16 }]}>
                    <TextInput
                        style={[textInput, invalidEntry && { borderColor: Colors.light.error }]}
                        placeholder='Email Address'
                        underlineColorAndroid={colors.transparent}
                        placeholderTextColor={'#747474'}
                        value={email}
                        autoFocus
                        cursorColor={'#747474'}
                        onChangeText={(text) => onChange('email', text)}
                    />

                    <TextInput
                        style={[textInput, invalidEntry && { borderColor: Colors.light.error }]}
                        placeholder="Password"
                        underlineColorAndroid={colors.transparent}
                        placeholderTextColor={'#747474'}
                        value={password}
                        secureTextEntry={secureTextEntry}
                        onChangeText={(text) => onChange('password', text)}
                    />

                    <View style={[wFull, flex, itemsCenter, invalidEntry ? justifyBetween : justifyEnd]}>
                        {invalidEntry && (<Text style={invalidEntryText}>Incorrect email or password</Text>)}

                        <Text style={[forgotPassword]}>Forgot Password?</Text>
                    </View>
                </View>

                <Pressable style={[wFull, signInBtn]}>
                    <Text style={[wHFull, pAuto, flexCenter, signInText]}>Sign In</Text>
                </Pressable>

                <Text style={[noAccount, mXAuto]}>
                    Don't have an account?
                    <Link href={'/signup'}>
                        <Text style={signupLink}>Sign Up</Text>
                    </Link>
                </Text>
            </View>
        </SafeScreen>
    )
}