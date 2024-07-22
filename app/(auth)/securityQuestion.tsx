import React, { useEffect } from 'react';
import SafeScreen from '../../components/shared/safeScreen';
import Colors, { colors } from '../../constants/Colors';
import { fonts } from '../../constants/fonts';
import { images } from '../../constants/images';
import { questions } from '../../constants/securityQuestions';
import { flex, flexCenter, flexCol, flexYCenter, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyEnd, mXAuto, mt, pAuto, wFull, wHFull } from '../../utils/styles'
import { Entypo } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Pressable, Button, Image } from 'react-native'
import { Menu, Text } from 'react-native-paper'
import RBSheet from 'react-native-raw-bottom-sheet';
import PaddedScreen from '@/components/shared/paddedScreen';
import { c } from '@/utils/fontStyles';
import { useSignup } from '@/contexts/signupContext';
import { useBottomSheet } from '@/contexts/useBottomSheetContext';
import SecurityQuestionSheet from '@/components/page/securityQuestionSheet';
// import { Image, ImageStyle } from 'expo-image';

const { securityQuestionTitle, textInput, questionSelectText, questionMenuDropdown, menuItem, form, signUpBtn, signUpText, bottomSheetImage, bottomSheetMessage } = StyleSheet.create({
    securityQuestionTitle: {
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
    questionSelectText: {
        textTransform: 'capitalize',
        paddingTop: 'auto',
        paddingBottom: 'auto',
        backgroundColor: '#F9F7F8',
        color: Colors.light.textGrey
    },
    questionMenuDropdown: {
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
    bottomSheetImage: {
        width: 81,
        height: 114
    },
    bottomSheetMessage: {
        color: '#CF0707',
        fontFamily: fonts.neurialGrotesk,
        fontWeight: '700',
        fontSize: 22
    }
});

export default function SecurityQuestion() {
    const { signedUpUser, setSecurityQuestion } = useSignup() //change the user here to signedup user
    const { showBottomSheet, hideBottomSheet } = useBottomSheet()

    useEffect(() => {
        if (signedUpUser?.deactivated) {
            showBottomSheet([637, 800], <SecurityQuestionSheet />)
        }
        showBottomSheet([637, 800], <SecurityQuestionSheet />) // for testing. remove this later
    }, [signedUpUser])

    let [selectedAQuestion, setSelectedAQuestion] = useState(false);
    let [status, setStatus] = useState<'idle' | 'selected' | 'add_question'>('idle')
    let [questionDropDownVisible, setQuestionDropDownVisible] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: ''
    })
    const { answer, question } = formData;

    const refRBSheet = useRef();

    const toggleMenu = () => setQuestionDropDownVisible(prev => (!prev));

    const closeMenu = () => setQuestionDropDownVisible(false);

    const onChange = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));



    return (
        <SafeScreen>
            <PaddedScreen>
                <View style={[wFull, hFull, flexCol, itemsCenter, justifyCenter, { gap: 40 }]}>
                    <View style={[flexCol, itemsStart, wFull, { gap: 2 }]}>
                        <Text style={securityQuestionTitle}>Set security</Text>
                        <Text style={securityQuestionTitle}>question</Text>
                    </View>

                    <View style={[form, flexYCenter, { gap: 16 }]}>
                        {status !== 'add_question' && <View
                            style={[wFull, { height: 'auto' }]}
                        >
                            <Menu
                                style={[questionMenuDropdown, h('auto')]}
                                contentStyle={[questionMenuDropdown, wFull, h('auto'), { marginTop: 0, paddingTop: 0 }]}
                                visible={questionDropDownVisible}
                                onDismiss={closeMenu}
                                anchor={
                                    <TouchableOpacity onPress={toggleMenu}>
                                        <View style={[wFull, flex, itemsCenter, justifyBetween, textInput]}>
                                            <Text style={[questionSelectText]}>
                                                {status === 'idle' && question === '' ? 'Select Question' : question}
                                            </Text>

                                            <Entypo
                                                name="chevron-small-down"
                                                size={35}
                                                color={Colors.light.textGrey}
                                                style={{
                                                    transform: [{ rotate: !questionDropDownVisible ? '0deg' : '180deg' }]
                                                }}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                }>
                                {questions.map((question, index) => (
                                    <Menu.Item style={[menuItem, wFull, index > 0 && mt(-10)]} onPress={() => {
                                        onChange('question', question);
                                        setStatus('selected')
                                        closeMenu()
                                    }} title={<Text style={[menuItem, wFull, c(Colors.light.textGrey)]}>{question}</Text>} key={index} />
                                ))}
                                <Menu.Item style={[menuItem, wFull, mt(-10)]} onPress={() => {
                                    onChange('question', '');
                                    setStatus('add_question')
                                    closeMenu()
                                }} title={'Add your Question'} />
                            </Menu>
                        </View>}

                        {status === 'add_question' && <TextInput
                            style={[textInput]}
                            placeholder='Enter Question'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.textGrey}
                            value={question}
                            cursorColor={Colors.light.textGrey}
                            onChangeText={(text) => onChange('question', text)}
                        />}

                        <TextInput
                            style={[textInput]}
                            placeholder='Enter Answer'
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.textGrey}
                            value={answer}
                            cursorColor={Colors.light.textGrey}
                            onChangeText={(text) => onChange('answer', text)}
                        />
                    </View>

                    <TouchableOpacity style={[wFull, flex, itemsCenter, justifyCenter, signUpBtn]}
                        onPress={() => setSecurityQuestion({ email: signedUpUser?.email as string, securityAnswer: answer, securityQuestion: question })}>
                        <Text style={[signUpText]}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </PaddedScreen>
        </SafeScreen>
    )
}