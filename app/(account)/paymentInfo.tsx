import { View, Text, Image } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, mr, mt, p, pb, px, py, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, colorTextGrey, colorWhite, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
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
import AccountPageBlockTitle from '@/components/page/accountPageBlockTitle'

export default function PaymentInfo() {
    const dispatch = useAppDispatch()
    const { stateInput, savedAddresses } = AccountSelectors();
    const { contactEmailInput, contactNameInput, contactPhoneNumberInput, contactWhatsAppInput } = stateInput.addNewContact;

    interface IItem {
        type: string,
        date: string,
        time: string,
        amount: string,
    }

    const DATA: IItem[] = [
        {
            type: 'Card Top Up',
            amount: '0000.00',
            date: 'Apr 14, 2024',
            time: '8:41 AM'
        },
        {
            type: 'Virtual Account Funded',
            amount: '0000.00',
            date: 'Apr 14, 2024',
            time: '8:41 AM'
        },
        {
            type: 'Virtual Account Funded',
            amount: '0000.00',
            date: 'Apr 14, 2024',
            time: '8:41 AM'
        },
    ];

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

                        {/* Virtual Card Block */}

                        <View style={[wFull, flexCol, gap(32)]}>
                            <AccountPageBlockTitle title='Virtual Account' />

                            <View style={[flexCol, gap(8)]}>
                                <Text style={[fs12, fw400, colorBlack]}>Paystack Titan</Text>

                                <TouchableOpacity style={[bg('#F9F7F8'), h(70), px(37), flex, itemsCenter, gap(10), rounded(50)]}>
                                    <Text style={[colorBlack, fw700, { fontSize: 22 }]}>9882910472</Text>

                                    <Image style={[image.w(20), image.h(20)]} source={images.copyImage} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Virtual Card Block */}

                        {/* Virtual Card Block */}

                        <View style={[wFull, flexCol, gap(32)]}>
                            <AccountPageBlockTitle title='Debit Cards' />

                            <View style={[flexCol, gap(8)]}>
                                <View style={[flex, itemsCenter, gap(16)]}>
                                    <Image style={[image.w(18), image.h(14)]} source={images.paymentCardImage} />

                                    <Text style={[fw400, fs14, colorBlack,]}>Mastercard ending with 4499</Text>
                                </View>

                                <View style={[flex, itemsCenter, gap(16)]}>
                                    <Image style={[image.w(20), image.h(20)]} source={images.topupImage} />

                                    <Text style={[fw400, fs14, colorBlack,]}>Add Debit Card</Text>
                                </View>
                            </View>
                        </View>

                        {/* Virtual Card Block */}

                        {/* Wallet History Block */}

                        <View style={[wFull, flexCol, gap(32)]}>
                            <AccountPageBlockTitle title='Walet History' />

                            <View style={[flexCol, { gap: 32, height: DATA.length * 100 }]}>
                                {DATA.map((item, index) => (
                                    <View style={[flex, wFull, itemsStart, justifyBetween, { paddingRight: 16, paddingBottom: 16, height: 59, borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]} key={index}>
                                        <View style={[flexCol, itemsStart, justifyBetween, hFull]}>
                                            <Text style={[fw700, fs14, colorBlack]}>{item.type}</Text>
                                            <Text style={[colorTextGrey, fs12, fw400]}>{item.date}</Text>
                                        </View>

                                        <View style={[flexCol, itemsStart, justifyBetween, hFull]}>
                                            <Text style={[fw400, fs14, { color: '#27AE65' }]}>{`₦${item.amount}`}</Text>
                                            <Text style={[colorTextGrey, fw400, fs12]}>{item.time}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Wallet History Block */}
                    </View>
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}