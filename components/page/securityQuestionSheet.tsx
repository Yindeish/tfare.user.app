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
import { useBottomSheet } from '@/contexts/useBottomSheetContext';


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

function SecurityQuestionSheet() {
    const { hideBottomSheet } = useBottomSheet()

    let [selectedAQuestion, setSelectedAQuestion] = useState(false);
    let [status, setStatus] = useState<'idle' | 'selected' | 'add_question'>('idle')
    let [questionDropDownVisible, setQuestionDropDownVisible] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: ''
    })
    const { answer, question } = formData;

    const toggleMenu = () => setQuestionDropDownVisible(prev => (!prev));

    const closeMenu = () => setQuestionDropDownVisible(false);

    const onChange = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));


    return (
        <View style={[wFull, hFull, flexCol, { gap: 38, paddingHorizontal: 20, paddingTop: 45, }]}>
            <Image
                source={images.robotassistanterror}
                style={[mXAuto as any, {
                    width: 81,
                    height: 117
                }]}
            />

            <View style={[flexCol, { gap: 2 }]}>
                <Text style={[bottomSheetMessage]}>Your account has been</Text>
                <Text style={[bottomSheetMessage]}>deactivated. Enter security</Text>
                <Text style={[bottomSheetMessage]}>question to activate</Text>
            </View>

            <View style={[form, flexYCenter, { gap: 16 }]}>
                <View
                    style={[wFull, { height: 'auto' }]}
                >
                    <Menu
                        style={[questionMenuDropdown]}
                        contentStyle={[questionMenuDropdown, wFull, { marginTop: 0 }]}
                        visible={questionDropDownVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <TouchableOpacity onPress={toggleMenu}>
                                <View style={[wFull, flex, itemsCenter, justifyBetween, textInput]}>
                                    <Text style={[questionSelectText]}>
                                        {question !== '' ? question : 'Select Question'}
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
                            <Menu.Item style={[menuItem, wFull,]} onPress={() => {
                                onChange('question', question);
                                closeMenu()
                            }} title={question} key={index} />
                        ))}
                    </Menu>
                </View>

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


            <Pressable style={[wFull, flex, itemsCenter, justifyCenter, signUpBtn]}
                onPress={() => hideBottomSheet()}
            >
                <Text style={[signUpText]}>Confirm</Text>
            </Pressable>
        </View>
    )
}

export default SecurityQuestionSheet;