import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mt, p, px, py, rounded, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, colorWhite, fs12, fs14, fs18, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import AccountPageTitle from '@/components/shared/pageTitle'
import { Href, router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import { TouchableOpacity } from 'react-native-gesture-handler'
import EmergencyContactListTile from '@/components/page/emergencyContactsListTile'
import AccountSelectors from '@/state/selectors/account'
import { pages } from '@/constants/pages'
import AddNewContactListTile from '@/components/page/AddNewContactListTile'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setEmergencyContactField, setSaveAddressesField } from '@/state/slices/account'
import { IStateInputAddNewContact, IStateInputSaveNewAddress } from '@/state/types/account'

export default function SaveNewAddress() {
    const dispatch = useAppDispatch()
    const { stateInput } = AccountSelectors();
    const { addressName, routeName } = stateInput.saveNewAddress;

    return (
        <SafeScreen>
            <View style={[wHFull,]}>
                <PaddedScreen>
                    {/* Page Header */}

                    <View style={[wFull, flex, itemsCenter, justifyBetween, mt(47),]}>
                        <AccountPageTitle
                            title='Save New Address'
                            onPress={() => router.push(`/(account)/${pages.savedAddresses}` as Href)}
                            style={[]}
                        />

                    </View>

                    {/* Page Header */}

                    <View style={[wFull, flexCol, gap(40), mt(28)]}>
                        <View style={[wFull, flexCol, gap(16)]}>

                            <View style={[wFull, h(50), rounded(10), py(16), px(24), flex, gap(10), bg('#F9F7F8')]}>

                                <TextInput
                                    onChangeText={(text) => {
                                        dispatch(setSaveAddressesField({ key: 'addressName', value: text }));
                                    }}

                                    value={addressName} placeholder={'Enter Address Name'}

                                    style={[wHFull, { borderWidth: 0 }]}

                                    // others
                                    cursorColor={Colors.light.background}
                                    selectionColor={colors.transparent}
                                    underlineColorAndroid={colors.transparent}
                                    placeholderTextColor={Colors.light.textGrey}
                                />
                            </View>

                            <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                                <TouchableOpacity>
                                    <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                                </TouchableOpacity>

                                <TextInput
                                    style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                                    placeholderTextColor={Colors.light.textGrey}
                                    cursorColor={Colors.light.textGrey}
                                    placeholder="Enter Location"
                                    value={routeName}
                                    onChangeText={(text) => {
                                        dispatch(setSaveAddressesField({ key: 'routeName', value: text }));
                                    }}
                                />

                                <TouchableOpacity>
                                    <Image style={[image.w(22), image.h(22)]} source={images.pickUpImage} />
                                </TouchableOpacity>
                            </View>

                        </View>

                        <TouchableOpacity onPress={() => { }}>
                            <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Save</Text>

                                <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}

{/* <View style={[wFull, h(50), rounded(10), py(16), px(24), flex, gap(10), bg('#F9F7F8')]}>
    <Image style={[image.w(icon.w as number), image.h(icon.h as number)]} source={icon.src} />}

    <TextInput
        onChangeText={(text) => input.onChangeText(input.fieldKey, text)}

        value={input.value} placeholder={input.palceHolder}

        style={[!icon.present ? wHFull : { flex: 0.8 }, { borderWidth: 0 }]}

        // others
        cursorColor={Colors.light.background}
        selectionColor={colors.transparent}
        keyboardType={'' || input.keyboardType}
        underlineColorAndroid={colors.transparent}
        placeholderTextColor={Colors.light.textGrey}
    />
</View> */}