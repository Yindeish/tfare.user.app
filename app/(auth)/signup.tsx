import { View, Pressable, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { Href, Link, router } from 'expo-router'
import { useSignup } from '@/contexts/signupContext'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { Text, Menu, ActivityIndicator, Snackbar } from 'react-native-paper'
import { Entypo } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'
import { genders } from '@/constants/gender'
import { fonts } from '@/constants/fonts'
import Colors, { colors } from '@/constants/Colors'
import { bg, flex, flexCenter, flexCol, flexYCenter, gap, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyEnd, justifyStart, mt, pt, wFull, wHFull } from '@/utils/styles'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { c, colorTextGrey } from '@/utils/fontStyles'
import { useSnackbar } from '@/contexts/snackbar.context'
import { pages } from '@/constants/pages'
import { KeyboardAvoidingView } from 'react-native'
import { ViewStyle } from 'react-native'
import { TextStyle } from 'react-native'

const { signUpTitle, textInput, genderSelectText, genderMenuDropdown, menuItem, form, signUpBtn, signUpText, noAccount, signupLink, invalidEntryText, checkbox } = StyleSheet.create({
    signUpTitle: {
        fontWeight: '500',
        fontSize: 32,
        lineHeight: 32.08,
        color: colors.black,
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
    genderSelectText: {
        textTransform: 'capitalize',
        paddingTop: 'auto',
        paddingBottom: 'auto',
        backgroundColor: '#F9F7F8',
        fontFamily: fonts.neurialGrotesk,
        color: Colors.light.textGrey
    },
    genderMenuDropdown: {
        width: '90%',
        marginTop: 47,
        backgroundColor: colors.white,
        borderColor: colors.transparent,
        borderRadius: 0
    },
    menuItem: {
        backgroundColor: colors.white,
    },
    signUpBtn: {
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        height: 50,
    },
    signUpText: {
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
    },
    checkbox: {
        marginRight: 12
    }
});

const SignupSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Required'),
    pin: yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    confirmedPin: yup.string().oneOf([yup.ref('pin')], 'Passwords must match').required('Required'),
    profileName: yup.string().required('Required'),
    phoneNumber: yup.string().required('Required'),
    agree: yup.boolean().oneOf([true], 'You need to accept the terms and conditions'),
});

export default function Signup() {
    const { signUp, loadingState, code, msg } = useSignup()
    const { closeSnackbar, snackbarVisible } = useSnackbar()

    const [secureTextEntry, setSecureTextEntry] = useState(true)

    const formik = useFormik({
        initialValues: {
            email: '',
            pin: '',
            confirmedPin: '',
            profileName: '',
            phoneNumber: '',
            agree: true,
        },
        validationSchema: SignupSchema,
        onSubmit: values => {
            signUp(values)
            router.replace(`/(auth)/${pages.signin}` as Href);//for testing
        },
    });

    return (
        <SafeScreen>
            <PaddedScreen styles={wHFull}>
                <View style={[wFull, hFull, flex, flexCol, itemsStart, justifyEnd, pt(70), { gap: 40, height: 'auto' }]}>
                    <View style={[flexCol, { gap: 2 }]}>
                        <Text style={signUpTitle as TextStyle}>Create a</Text>
                        <Text style={signUpTitle as TextStyle}>new account</Text>
                    </View>

                    {/* <KeyboardAvoidingView style={[form as ViewStyle, { gap: 16 }]}> */}
                    <View style={[form as ViewStyle, flexYCenter, { gap: 16 }]}>
                        <TextInput
                            style={[textInput as TextStyle, formik.touched.profileName && formik.errors.profileName ? { borderColor: Colors.light.error } : undefined]}
                            placeholder='Profile name'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.textGrey}
                            value={formik.values.profileName}
                            cursorColor={Colors.light.textGrey}
                            onChangeText={formik.handleChange('profileName')}
                            onBlur={formik.handleBlur('profileName')}
                        />
                        {formik.touched.profileName && formik.errors.profileName && <Text style={invalidEntryText as TextStyle}>{formik.errors.profileName}</Text>}

                        <TextInput
                            style={[textInput as TextStyle, formik.touched.email && formik.errors.email ? { borderColor: Colors.light.error } : undefined]}
                            placeholder='Email'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.textGrey}
                            value={formik.values.email}
                            cursorColor={Colors.light.textGrey}
                            onChangeText={formik.handleChange('email')}
                            onBlur={formik.handleBlur('email')}
                        />
                        {formik.touched.email && formik.errors.email && <Text style={invalidEntryText as TextStyle}>{formik.errors.email}</Text>}

                        <TextInput
                            style={[textInput as TextStyle, formik.touched.phoneNumber && formik.errors.phoneNumber ? { borderColor: Colors.light.error } : undefined]}
                            placeholder='Phone number'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.textGrey}
                            value={formik.values.phoneNumber}
                            keyboardType='numeric'
                            cursorColor={Colors.light.textGrey}
                            onChangeText={formik.handleChange('phoneNumber')}
                            onBlur={formik.handleBlur('phoneNumber')}
                        />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber && <Text style={invalidEntryText as TextStyle}>{formik.errors.phoneNumber}</Text>}

                        <TextInput
                            style={[textInput as TextStyle, formik.touched.pin && formik.errors.pin ? { borderColor: Colors.light.error } : undefined]}
                            placeholder="4-Digit Pin Code"
                            keyboardType='number-pad'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.textGrey}
                            value={formik.values.pin}
                            secureTextEntry={secureTextEntry}
                            onChangeText={formik.handleChange('pin')}
                            onBlur={formik.handleBlur('pin')}
                        />
                        {formik.touched.pin && formik.errors.pin && <Text style={invalidEntryText as TextStyle}>{formik.errors.pin}</Text>}

                        <TextInput
                            style={[textInput as TextStyle, formik.touched.confirmedPin && formik.errors.confirmedPin ? { borderColor: Colors.light.error } : undefined]}
                            placeholder="Confirm 4-Digit Pin Code"
                            keyboardType='number-pad'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.textGrey}
                            value={formik.values.confirmedPin}
                            secureTextEntry={secureTextEntry}
                            onChangeText={formik.handleChange('confirmedPin')}
                            onBlur={formik.handleBlur('confirmedPin')}
                        />
                        {formik.touched.confirmedPin && formik.errors.confirmedPin && <Text style={invalidEntryText as TextStyle}>{formik.errors.confirmedPin}</Text>}

                        <View style={[justifyStart, itemsCenter, wFull, flex, { gap: 12 }]}>
                            <Checkbox
                                style={checkbox as ViewStyle}
                                value={formik.values.agree}
                                onValueChange={() => formik.setFieldValue('agree', !formik.values.agree)}
                                color={Colors.light.background}
                            />

                            <View style={[flex, itemsCenter, gap(2)]}>
                                <Text style={{ color: colors.black }}>I accept Tfare's</Text>
                                <Text style={{ color: Colors.light.background }}>terms and Condition</Text>
                            </View>
                        </View>
                        {formik.touched.agree && formik.errors.agree && <Text style={invalidEntryText as TextStyle}>{formik.errors.agree}</Text>}

                        <Pressable
                            style={[wFull, signUpBtn as ViewStyle, flex, itemsCenter, justifyCenter, mt(30)]}
                            disabled={loadingState === 'signiningUp'}
                            onPress={() => formik.handleSubmit()}
                        >
                            {loadingState === 'idle' ? (
                                <Text style={[signUpText as TextStyle,]}>Create</Text>
                            ) : (
                                <ActivityIndicator color={colors.white} size='small' />
                            )}
                        </Pressable>
                    </View>
                    {/* </KeyboardAvoidingView> */}

                    <View style={[wFull, flex, justifyCenter, itemsCenter, { gap: 8 }]}>
                        <Text style={noAccount as TextStyle}>Already have an account?</Text>
                        <Link href={'/(auth)/signin' as Href} asChild>
                            <Pressable>
                                <Text style={signupLink as TextStyle}>Sign in</Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>

                {/* //!Sanckbar */}
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => closeSnackbar()}
                    duration={4000}
                    action={{
                        label: 'OK',
                        onPress: () => {
                            closeSnackbar();
                        }
                    }}>
                    {msg}
                </Snackbar>
                {/* //!Sanckbar */}
            </PaddedScreen>

        </SafeScreen>
    )
}
