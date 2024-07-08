import { View, Text, Image } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mt, p, px, py, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, colorWhite, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import AccountPageTitle from '@/components/page/accountPageTitle'
import { router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import EmergencyContactListTile from '@/components/page/emergencyContactsListTile'
import AccountSelectors from '@/state/selectors/account'
import { pages } from '@/constants/pages'
import AddNewContactListTile from '@/components/page/AddNewContactListTile'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setEmergencyContactField } from '@/state/slices/account'
import { IStateInputAddNewContact } from '@/state/types/account'
import SavedAddressListTile from '@/components/page/SavedAddressesListTile'

export default function PaymentInfo() {
    const dispatch = useAppDispatch()
    const { stateInput, savedAddresses } = AccountSelectors();
    const { contactEmailInput, contactNameInput, contactPhoneNumberInput, contactWhatsAppInput } = stateInput.addNewContact;

    return (
        <SafeScreen>
            <ScrollView style={[wHFull,]}>
                <PaddedScreen>
                    {/* Page Header */}

                    <AccountPageTitle
                        title='Payment Information'
                        onPress={() => router.push(`/(tab)/${tabs.account}`)}
                        style={[]}
                    />

                    {/* Page Header */}

                    <View style={[wFull, flexCol, gap(40)]}>

                        {/* Wallet Block */}

                        <View style={[wFull, flex, gap(10), justifyBetween, itemsCenter, bg('#EDEDFD'), rounded(10), h(94), py(17), px(9), {}]}>
                            <View style={[flexCol, gap(16), w(126), h(60)]}>

                                <View style={[flex, itemsCenter, { gap: 16 }]}>

                                    <Image style={[image.w(19), image.h(18)]} source={images.walletImage} />

                                    <Text style={[neurialGrotesk, fs12, c(Colors.light.textGrey), fw400,]}>wallet balance</Text>

                                </View>

                                <Text style={[neurialGrotesk, fw700, { fontSize: 22 }]}> ₦{'0000.00'}</Text>
                            </View>

                            <TouchableOpacity>
                                <View style={[flex, itemsCenter, justifyBetween, w(124), h(45), px(16), rounded(100), bg(colors.white), {
                                    borderWidth: 0.7, borderColor: '#D7D7D7',
                                }]}>

                                    <Image style={[image.w(19), image.h(19)]} source={images.topupImage} />
                                    <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Top Up</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Wallet Block */}
                    </View>
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}