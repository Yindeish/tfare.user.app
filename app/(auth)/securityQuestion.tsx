import SafeScreen from '@/components/safeScreen'
import Colors, { colors } from '@/constants/Colors';
import { fonts } from '@/constants/fonts';
import { images } from '@/constants/images';
import { questions } from '@/constants/securityQuestions';
import { flex, flexCenter, flexCol, flexYCenter, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyEnd, mXAuto, pAuto, wFull, wHFull } from '@/utils/styles'
import { Entypo } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Pressable, Button, Image } from 'react-native'
import { Menu, Text } from 'react-native-paper'
import RBSheet from 'react-native-raw-bottom-sheet';
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
        fontFamily: fonts.neurialGrotesk,
    },
    questionSelectText: {
        textTransform: 'capitalize',
        paddingTop: 'auto',
        paddingBottom: 'auto',
        backgroundColor: '#F9F7F8',
        fontFamily: fonts.neurialGrotesk,
        color: '#747474'
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
                            style={[questionMenuDropdown]}
                            contentStyle={[questionMenuDropdown, wFull, { marginTop: 0 }]}
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
                                            color="#747474"
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
                                    setStatus('selected')
                                    closeMenu()
                                }} title={question} key={index} />
                            ))}
                            <Menu.Item style={[menuItem, wFull,]} onPress={() => {
                                onChange('question', '');
                                setStatus('add_question')
                                closeMenu()
                            }} title={'Add your Question'} />
                            <Menu.Item style={[menuItem, wFull,]} onPress={() => {
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
                        placeholderTextColor={'#747474'}
                        value={question}
                        cursorColor={'#747474'}
                        onChangeText={(text) => onChange('question', text)}
                    />}

                    <TextInput
                        style={[textInput]}
                        placeholder='Enter Answer'
                        underlineColorAndroid={colors.transparent}
                        placeholderTextColor={'#747474'}
                        value={answer}
                        cursorColor={'#747474'}
                        onChangeText={(text) => onChange('answer', text)}
                    />
                </View>

                <Pressable style={[wFull, signUpBtn]}
                    onPress={() => (refRBSheet?.current as any)?.open()}>
                    <Text style={[wHFull, pAuto, flexCenter, signUpText]}>Confirm</Text>
                </Pressable>

                <RBSheet
                    ref={refRBSheet as any}
                    useNativeDriver={true}
                    draggable
                    closeOnPressBack
                    height={637}
                    customStyles={{
                        wrapper: {
                            backgroundColor: colors.transparent,
                        },
                        draggableIcon: {
                            backgroundColor: '#D7D7D7',
                            width: 140,
                            height: 4,
                            borderRadius: 100,
                            marginTop: 10
                        },
                    }}
                    customModalProps={{
                        animationType: 'slide',
                        statusBarTranslucent: true,
                    }}
                    customAvoidingViewProps={{
                        enabled: false,
                    }}>
                    <View style={[wFull, hFull, flexCol, { gap: 38, paddingHorizontal: 20, paddingTop: 45 }]}>
                        <Image
                            source={images.robotassistanterror}
                            style={[mXAuto, { width: 81, height: 117 }]}
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
                                                    color="#747474"
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
                                placeholderTextColor={'#747474'}
                                value={answer}
                                cursorColor={'#747474'}
                                onChangeText={(text) => onChange('answer', text)}
                            />
                        </View>

                        <Pressable style={[wFull, signUpBtn]}
                            onPress={() => (refRBSheet?.current as any)?.open()}>
                            <Text style={[wHFull, pAuto, flexCenter, signUpText]}>Confirm</Text>
                        </Pressable>
                    </View>
                </RBSheet>
            </View>
        </SafeScreen>
    )
}