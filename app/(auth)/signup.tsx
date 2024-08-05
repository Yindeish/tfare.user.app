import { View, Pressable, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import { useSignup } from '@/contexts/signupContext'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { Text, Menu, ActivityIndicator, Snackbar } from 'react-native-paper'
import { Entypo } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'
import { genders } from '@/constants/gender'
import { fonts } from '@/constants/fonts'
import Colors, { colors } from '@/constants/Colors'
import { bg, flex, flexCenter, flexCol, flexYCenter, gap, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyEnd, justifyStart, pt, wFull, wHFull } from '@/utils/styles'
import { Formik } from 'formik'
import * as yup from 'yup'
import { c, colorTextGrey } from '@/utils/fontStyles'
import { useSnackbar } from '@/contexts/snackbar.context'

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
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    confirmedPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Required'),
    gender: yup.string().required('Required'),
    profileName: yup.string().required('Required'),
    phoneNumber: yup.string().required('Required'),
    agree: yup.boolean().oneOf([true], 'You need to accept the terms and conditions'),
});

export default function signup() {
    const { signUp, loadingState, code, msg, } = useSignup()
    const { closeSnackbar, snackbarVisible } = useSnackbar()

    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const [genderDropDownVisible, setGenderDropDownVisible] = useState(false)


    const toggleMenu = () => setGenderDropDownVisible(prev => (!prev))
    const closeMenu = () => setGenderDropDownVisible(false)

    return (
        <SafeScreen>
            <PaddedScreen styles={wHFull}>
                <Formik
                    initialValues={{
                        email: 'adeshinaadam03@gmail.com',
                        password: 'Yindeish03@',
                        confirmedPassword: 'Yindeish03@',
                        gender: 'Male',
                        profileName: 'Yindeish',
                        phoneNumber: '0814778236',
                        agree: true,
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={values => {
                        signUp(values)
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View style={[wFull, hFull, flex, flexCol, itemsStart, justifyEnd, pt(70), { gap: 40, height: 'auto' }]}>
                            <View style={[flexCol, { gap: 2 }]}>
                                <Text style={signUpTitle}>Create a</Text>
                                <Text style={signUpTitle}>new account</Text>
                            </View>

                            <View style={[form, flexYCenter, { gap: 16 }]}>
                                <TextInput
                                    style={[textInput, (touched as any).profileName && errors.profileName && { borderColor: Colors.light.error }]}
                                    placeholder='Profile name'
                                    underlineColorAndroid={colors.transparent}
                                    placeholderTextColor={Colors.light.textGrey}
                                    value={values.profileName}
                                    cursorColor={Colors.light.textGrey}
                                    onChangeText={handleChange('profileName')}
                                    onBlur={handleBlur('profileName')}
                                />
                                {touched.profileName && errors.profileName && <Text style={invalidEntryText}>{errors.profileName}</Text>}

                                <TextInput
                                    style={[textInput, (touched as any).email && errors.email && { borderColor: Colors.light.error }]}
                                    placeholder='Email'
                                    underlineColorAndroid={colors.transparent}
                                    placeholderTextColor={Colors.light.textGrey}
                                    value={values.email}
                                    cursorColor={Colors.light.textGrey}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                />
                                {touched.email && errors.email && <Text style={invalidEntryText}>{errors.email}</Text>}

                                <TextInput
                                    style={[textInput, (touched as any).phoneNumber && errors.phoneNumber && { borderColor: Colors.light.error }]}
                                    placeholder='Phone number'
                                    underlineColorAndroid={colors.transparent}
                                    placeholderTextColor={Colors.light.textGrey}
                                    value={values.phoneNumber}
                                    keyboardType='numeric'
                                    cursorColor={Colors.light.textGrey}
                                    onChangeText={handleChange('phoneNumber')}
                                    onBlur={handleBlur('phoneNumber')}
                                />
                                {touched.phoneNumber && errors.phoneNumber && <Text style={invalidEntryText}>{errors.phoneNumber}</Text>}

                                <View style={[wFull, { height: 'auto' }]}>
                                    <Menu
                                        style={[genderMenuDropdown]}
                                        contentStyle={[genderMenuDropdown, wFull, { marginTop: 0 }]}
                                        visible={genderDropDownVisible}
                                        onDismiss={closeMenu}
                                        anchor={
                                            <TouchableOpacity onPress={toggleMenu}>
                                                <View style={[wFull, flex, itemsCenter, justifyBetween, textInput, (touched as any).gender && errors.gender && { borderColor: Colors.light.error }]}>
                                                    <Text style={[genderSelectText]}>
                                                        {values.gender !== '' ? values.gender : 'Select Gender'}
                                                    </Text>

                                                    <Entypo name="chevron-small-down" size={35} color={Colors.light.textGrey} />
                                                </View>
                                            </TouchableOpacity>
                                        }>
                                        {genders.map((gender, index) => (
                                            <Menu.Item contentStyle={[colorTextGrey]} style={[menuItem, wFull, colorTextGrey]} onPress={() => {
                                                setFieldValue('gender', gender)
                                                closeMenu()
                                            }} title={<Text style={[menuItem, wFull, colorTextGrey]}>{gender}</Text>} key={index} />
                                        ))}
                                    </Menu>
                                    {touched.gender && errors.gender && <Text style={invalidEntryText}>{errors.gender}</Text>}
                                </View>

                                <TextInput
                                    style={[textInput, (touched as any).password && errors.password && { borderColor: Colors.light.error }]}
                                    placeholder="Password"
                                    underlineColorAndroid={colors.transparent}
                                    placeholderTextColor={Colors.light.textGrey}
                                    value={values.password}
                                    secureTextEntry={secureTextEntry}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                />
                                {touched.password && errors.password && <Text style={invalidEntryText}>{errors.password}</Text>}

                                <TextInput
                                    style={[textInput, (touched as any).confirmedPassword && errors.confirmedPassword && { borderColor: Colors.light.error }]}
                                    placeholder="Confirm Password"
                                    underlineColorAndroid={colors.transparent}
                                    placeholderTextColor={Colors.light.textGrey}
                                    value={values.confirmedPassword}
                                    secureTextEntry={secureTextEntry}
                                    onChangeText={handleChange('confirmedPassword')}
                                    onBlur={handleBlur('confirmedPassword')}
                                />
                                {touched.confirmedPassword && errors.confirmedPassword && <Text style={invalidEntryText}>{errors.confirmedPassword}</Text>}

                                <View style={[justifyStart, itemsCenter, wFull, flex, { gap: 12 }]}>
                                    <Checkbox
                                        style={checkbox}
                                        value={values.agree}
                                        onValueChange={() => setFieldValue('agree', !values.agree)}
                                        color={Colors.light.background}
                                    />

                                    <View style={[flex, itemsCenter, gap(2)]}>
                                        <Text style={{ color: colors.black }}>I accept Tfare's</Text>
                                        <Text style={{ color: Colors.light.background }}>terms and Condition</Text>
                                    </View>
                                </View>
                                {touched.agree && errors.agree && <Text style={invalidEntryText}>{errors.agree}</Text>}
                            </View>

                            <View style={[wFull, flex, flexCol, justifyCenter, { gap: 16 }]}>
                                <TouchableOpacity onPress={() => handleSubmit()} style={[signUpBtn, flexCenter]}>
                                    {loadingState === 'signiningUp' ? <ActivityIndicator color={colors.white} size={'small'} /> : <Text style={signUpText}>Sign Up</Text>}
                                </TouchableOpacity>
                                {code === 400 && <Text style={invalidEntryText}>{msg}</Text>}
                                <Text style={noAccount}>Already have an account?
                                    <Text onPress={() => router.push('/signin')} style={[signupLink]}> Sign In</Text>
                                </Text>
                            </View>
                        </View>
                    )}
                </Formik>

                {/* Snackbar */}
                {Platform.OS === 'ios' && <Snackbar
                    style={[]}
                    visible={snackbarVisible}
                    onDismiss={() => closeSnackbar()}
                    action={{
                        label: 'close',
                        onPress: () => {
                        },
                    }}>
                    {msg}
                </Snackbar>}
                {/* Snackbar */}
            </PaddedScreen>
        </SafeScreen >
    )
}
