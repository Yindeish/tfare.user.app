import { View, Pressable, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import { useSession } from '../../contexts/userSignedInContext';
import { useSession as useTokenSession } from '../../contexts/userTokenContext';
import SafeScreen from '../../components/safeScreen';
import { Divider, MD2Colors, Menu, Text, Button } from 'react-native-paper';
import { fonts } from '../../constants/fonts';
import { flex, flexCenter, flexCol, flexYCenter, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyEnd, justifyStart, mLAuto, mRAuto, mXAuto, pAuto, pLAuto, wFull, wHFull } from '../../utils/styles';
import Colors, { colors } from '../../constants/Colors';
import { Entypo } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { genders } from '@/constants/gender';
import PaddedScreen from '@/components/paddedScreen';


const { signUpTitle, textInput, genderSelectText, genderMenuDropdown, menuItem, form, signUpBtn, signUpText, noAccount, signupLink, invalidEntryText, checkbox } = StyleSheet.create({
    signUpTitle: {
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
    genderSelectText: {
        textTransform: 'capitalize',
        paddingTop: 'auto',
        paddingBottom: 'auto',
        backgroundColor: '#F9F7F8',
        fontFamily: fonts.neurialGrotesk,
        color: '#747474'
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
    },
    checkbox: {
        marginRight: 12
    }
});

export default function signup() {

    let [secureTextEntry, setSecureTextEntry] = useState(true);
    let [invalidEntry, setInvalidEntery] = useState(true);
    let [agree, setAgree] = useState(true);
    let [genderDropDownVisible, setGenderDropDownVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        gender: '',
        profileName: '',
        phoneNumber: '',
        confirmedPassword: ''
    })
    const { email, password, gender, phoneNumber, profileName, confirmedPassword } = formData;

    const toggleMenu = () => setGenderDropDownVisible(prev => (!prev));

    const closeMenu = () => setGenderDropDownVisible(false);

    const onChange = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

    return (
        <SafeScreen>
            <PaddedScreen styles={wHFull}>
                <View style={[wFull, hFull, flex, flexCol, itemsStart, justifyEnd, { gap: 40, height: 'auto' }]}>
                    <View style={[flexCol, { gap: 2 }]}>
                        <Text style={signUpTitle}>Create a</Text>
                        <Text style={signUpTitle}>new account</Text>
                    </View>

                    <View style={[form, flexYCenter, { gap: 16 }]}>
                        <TextInput
                            style={[textInput]}
                            placeholder='Profile name'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={'#747474'}
                            value={profileName}
                            autoFocus
                            cursorColor={'#747474'}
                            onChangeText={(text) => onChange('profileName', text)}
                        />

                        <TextInput
                            style={[textInput]}
                            placeholder='Email'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={'#747474'}
                            value={email}
                            cursorColor={'#747474'}
                            onChangeText={(text) => onChange('email', text)}
                        />

                        <TextInput
                            style={[textInput]}
                            placeholder='Phone number'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={'#747474'}
                            value={phoneNumber}
                            keyboardType='numeric'
                            cursorColor={'#747474'}
                            onChangeText={(text) => onChange('phoneNumber', text)}
                        />

                        <View
                            style={[wFull, { height: 'auto' }]}
                        >
                            <Menu
                                style={[genderMenuDropdown]}
                                contentStyle={[genderMenuDropdown, wFull, { marginTop: 0 }]}
                                visible={genderDropDownVisible}
                                onDismiss={closeMenu}
                                anchor={
                                    <TouchableOpacity onPress={toggleMenu}>
                                        <View style={[wFull, flex, itemsCenter, justifyBetween, textInput]}>
                                            <Text style={[genderSelectText]}>
                                                {gender !== '' ? gender : 'Select Gender'}
                                            </Text>

                                            <Entypo name="chevron-small-down" size={35} color="#747474" />
                                        </View>
                                    </TouchableOpacity>
                                }>
                                {genders.map((gender, index) => (
                                    <Menu.Item style={[menuItem, wFull,]} onPress={() => {
                                        onChange('gender', gender);
                                        closeMenu()
                                    }} title={gender} key={index} />
                                ))}
                            </Menu>
                        </View>

                        <TextInput
                            style={[textInput, invalidEntry && { borderColor: Colors.light.error }]}
                            placeholder="Password"
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={'#747474'}
                            value={password}
                            secureTextEntry={secureTextEntry}
                            onChangeText={(text) => onChange('password', text)}
                        />

                        <TextInput
                            style={[textInput, invalidEntry && { borderColor: Colors.light.error }]}
                            placeholder="Confirm Password"
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={'#747474'}
                            value={confirmedPassword}
                            secureTextEntry={secureTextEntry}
                            onChangeText={(text) => onChange('confirmedPassword', text)}
                        />

                        <View style={[wFull, flex, itemsCenter, justifyStart]}>
                            {invalidEntry && (<Text style={invalidEntryText}>Passwords don't match</Text>)}
                        </View>

                        <Text style={[noAccount, mRAuto]}>
                            <Checkbox
                                style={checkbox}
                                value={agree}
                                onValueChange={setAgree}
                                color={agree ? Colors.light.background : colors.grey500}
                            />
                            I accept Tfare's
                            <Link href={'/'}>
                                <Text style={signupLink}>terms and conditions</Text>
                            </Link>
                        </Text>
                    </View>

                    <Pressable style={[wFull, signUpBtn, flex, itemsCenter, justifyCenter]}>
                        <Text style={[flexCenter, signUpText]}>Create</Text>
                    </Pressable>

                    <Text style={[noAccount, mXAuto]}>
                        You have an account?
                        <Link href={'/signin'}>
                            <Text style={signupLink}>Sign In</Text>
                        </Link>
                    </Text>
                </View>
            </PaddedScreen>
        </SafeScreen>
    )
}