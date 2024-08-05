import React, { useEffect, useRef, useState } from 'react';
import SafeScreen from '../../components/shared/safeScreen';
import Colors, { colors } from '../../constants/Colors';
import { fonts } from '../../constants/fonts';
import { images } from '../../constants/images';
import { questions } from '../../constants/securityQuestions';
import { flex, flexCenter, flexCol, flexYCenter, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyEnd, mXAuto, mt, pAuto, wFull, wHFull } from '../../utils/styles'
import { Entypo } from '@expo/vector-icons';
import { View, StyleSheet, TextInput, TouchableOpacity, Pressable, Button, Image } from 'react-native'
import { ActivityIndicator, Menu, Text } from 'react-native-paper'
import PaddedScreen from '@/components/shared/paddedScreen';
import { c } from '@/utils/fontStyles';
import { useSignup } from '@/contexts/signupContext';
import { useBottomSheet } from '@/contexts/useBottomSheetContext';
import SecurityQuestionSheet from '@/components/page/securityQuestionSheet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import URLS from '@/constants/urls';

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

const validationSchema = Yup.object().shape({
    question: Yup.string().required('Question is required'),
    answer: Yup.string().required('Answer is required'),
});

export default function SecurityQuestion() {
    const { signedUpUser, setSecurityQuestion, loadingState } = useSignup()


    let [status, setStatus] = useState<'idle' | 'selected' | 'add_question'>('idle')
    let [questionDropDownVisible, setQuestionDropDownVisible] = useState(false);

    const toggleMenu = () => setQuestionDropDownVisible(prev => (!prev));

    const closeMenu = () => setQuestionDropDownVisible(false);

    return (
        <SafeScreen>
            <PaddedScreen>
                <Formik
                    initialValues={{ question: '', answer: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values: { question: string, answer: string }) => {
                        setSecurityQuestion({ email: signedUpUser?.email as string, securityAnswer: values.answer, securityQuestion: values.question });
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
                                                        {status === 'idle' && values.question === '' ? 'Select Question' : values.question}
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
                                                handleChange('question')(question);
                                                setStatus('selected')
                                                closeMenu()
                                            }} title={<Text style={[menuItem, wFull, c(Colors.light.textGrey)]}>{question}</Text>} key={index} />
                                        ))}
                                        <Menu.Item style={[menuItem, wFull, mt(-10)]} onPress={() => {
                                            handleChange('question')('');
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
                                    value={values.question}
                                    cursorColor={Colors.light.textGrey}
                                    onChangeText={handleChange('question')}
                                    onBlur={handleBlur('question')}
                                />}
                                {errors.question && touched.question && (
                                    <Text style={{ color: 'red' }}>{errors.question}</Text>
                                )}

                                <TextInput
                                    style={[textInput]}
                                    placeholder='Enter Answer'
                                    underlineColorAndroid={colors.transparent}
                                    placeholderTextColor={Colors.light.textGrey}
                                    value={values.answer}
                                    cursorColor={Colors.light.textGrey}
                                    onChangeText={handleChange('answer')}
                                    onBlur={handleBlur('answer')}
                                />
                                {errors.answer && touched.answer && (
                                    <Text style={{ color: 'red' }}>{errors.answer as string}</Text>
                                )}
                            </View>

                            {loadingState === 'settingQuestion' ? (<ActivityIndicator color={Colors.light.background} size={'small'} />)
                                :
                                (<TouchableOpacity style={[wFull, flex, itemsCenter, justifyCenter, signUpBtn]}
                                    onPress={() => handleSubmit()}>
                                    <Text style={[signUpText]}>Confirm</Text>
                                </TouchableOpacity>)}
                        </View>
                    )}
                </Formik>
            </PaddedScreen>
        </SafeScreen>
    )
}
