import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, mXAuto, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, mb, mt, p, pb, px, py, rounded, w, wFull } from '@/utils/styles'
import AccountPageTitle from '@/components/shared/pageTitle'
import { router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import AccountSelectors from '@/state/selectors/account'
import CupertinoBtnListTile from '@/components/shared/cupertinoBtnListTile'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setDeactivateAccountField, setUserAccountSecurityFeild, setUserNotificationField, setUserNotifications } from '@/state/slices/account'
import AccountSecurityListTile from '@/components/page/accountSecurityListTile'
import { closeModal, openModal } from '@/state/slices/layout'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { colorBlack, colorWhite, fs14, fs16, fs18, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import AccountTextField from '@/components/page/accountTextFeild'
import RadioBtnListTile from '@/components/page/RadioBtnListTile'
import { deactivateAccountReasons } from '@/constants/deactivateAccountReasons'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { useBottomSheet } from '@/contexts/useBottomSheetContext'

function AccountSecuritySheet() {
    const dispatch = useAppDispatch()
    const { stateInput } = AccountSelectors()

    let [commentBoxShowable, setCommentBoxShowable] = useState(false)

    const reasonInput = stateInput?.deactivateAccount?.reasonInput;

    // Updating the bottom Modal comment box
    useEffect(() => {
        if (reasonInput.toLowerCase() === deactivateAccountReasons[0].toLowerCase() ||
            reasonInput.toLowerCase() === deactivateAccountReasons[0].toLowerCase() ||
            reasonInput.toLowerCase() === deactivateAccountReasons[1].toLowerCase() ||
            reasonInput.toLowerCase() === deactivateAccountReasons[2].toLowerCase() ||
            reasonInput.toLowerCase() === deactivateAccountReasons[3].toLowerCase() ||
            reasonInput.toLowerCase() === deactivateAccountReasons[4].toLowerCase()) {
            setCommentBoxShowable(false);
        }
        else setCommentBoxShowable(true);
    }, [stateInput?.deactivateAccount?.reasonInput])
    // Updating the bottom Modal comment box

    return (
        <View style={[w('90%'), hFull, mXAuto, rounded(10), py(34), px(24), bg(colors.white), flexCol, gap(30),]}>

            <View style={[pb(16), flex, itemsStart, gap(16), mXAuto, { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>

                <Image style={[image.w(20), image.h(20)]} source={images.cancelImage} />

                <Text style={[neurialGrotesk, fw700, fs16, colorBlack,]}>Deactivate Account</Text>
            </View>

            <View style={[flexCol, gap(2), itemsCenter, mXAuto]}>
                <Text style={[neurialGrotesk, fw700, fs14]}>Why do you want to Deactivate your</Text>
                <Text style={[neurialGrotesk, fw700, fs14]}>account?</Text>
            </View>

            <View style={[flexCol, gap(10)]}>

                {deactivateAccountReasons.map((reason, index) => (
                    <RadioBtnListTile
                        input={{
                            onChange: (value: string) => {

                                if (reason.toLowerCase() !== 'other') {
                                    dispatch(setDeactivateAccountField({ key: 'reasonInput', value: value.toLowerCase() === stateInput.deactivateAccount.reasonInput.toLowerCase() ? '' : value.toLowerCase() }))
                                }

                                // if (reason) {
                                //     dispatch(setDeactivateAccountField({ key: 'reasonInput', value: value.toLowerCase() === stateInput.deactivateAccount.reasonInput.toLowerCase() ? '' : value.toLowerCase() }))
                                // }
                                if (reason.toLowerCase() === 'other') {
                                    dispatch(setDeactivateAccountField({ key: 'reasonInput', value: '' }))
                                }
                            },
                            value: stateInput.deactivateAccount.reasonInput
                        }}
                        label={{ text: reason }}
                        key={index}
                    />
                ))}

            </View>

            {commentBoxShowable &&

                <BottomSheetTextInput
                    onChangeText={(text) => {
                        dispatch(setDeactivateAccountField({ key: 'reasonInput', value: text }))
                    }}

                    value={stateInput.deactivateAccount.reasonInput}
                    placeholder={'Input Comments'}
                    multiline
                    numberOfLines={4}

                    style={[py(16), px(24), rounded(10), bg(colors.transparent), colorBlack, fs14, fw500, wFull, { borderWidth: 0.7, borderColor: Colors.light.border }]}

                    selectionColor={colors.transparent}
                    underlineColorAndroid={colors.transparent}
                    placeholderTextColor={Colors.light.textGrey}
                />}

            <TouchableOpacity onPress={() => {
                dispatch(closeModal())

                // submit reason to the server
            }}>
                <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.error)]}>
                    <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Confirm</Text>

                    <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default AccountSecuritySheet;