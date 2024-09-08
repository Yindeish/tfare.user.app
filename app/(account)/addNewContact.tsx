import { View, Text, Image } from 'react-native'
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
import { setEmergencyContactField } from '@/state/slices/account'
import { IStateInputAddNewContact } from '@/state/types/account'

export default function addNewContact() {
    const dispatch = useAppDispatch()
    const { stateInput } = AccountSelectors();
    const { contactEmailInput, contactNameInput, contactPhoneNumberInput, contactWhatsAppInput } = stateInput.addNewContact;

    return (
        <SafeScreen>
            <View style={[wHFull,]}>
                <PaddedScreen>
                    {/* Page Header */}

                    <View style={[wFull, flex, itemsCenter, justifyBetween, mt(47),]}>
                        <AccountPageTitle
                            title='Add New Account'
                            onPress={() => router.push(`/(account)/${pages.emergencyContacts}` as Href)}
                            style={[]}
                        />

                    </View>

                    {/* Page Header */}

                    <View style={[wFull, flexCol, gap(40), mt(28)]}>
                        <View style={[wFull, flexCol, gap(16)]}>

                            <AddNewContactListTile
                                icon={{ present: false, }}
                                input={{
                                    fieldKey: 'contactNameInput',
                                    onChangeText: (key, value) => {
                                        dispatch(setEmergencyContactField({ key: key as unknown as keyof IStateInputAddNewContact, value }))
                                    },
                                    palceHolder: 'Enter name',
                                    value: contactNameInput,
                                }}
                            />

                            <AddNewContactListTile
                                icon={{ src: images.emailImage, present: true, h: 18, w: 18 }}
                                input={{
                                    fieldKey: 'contactEmailInput',
                                    onChangeText: (key, value) => {
                                        dispatch(setEmergencyContactField({ key: key as unknown as keyof IStateInputAddNewContact, value }))
                                    },
                                    palceHolder: 'Enter email',
                                    value: contactEmailInput,
                                    keyboardType: 'email-address'
                                }}
                            />

                            <AddNewContactListTile
                                icon={{ src: images.phoneImage, present: true, h: 17, w: 17 }}
                                input={{
                                    fieldKey: 'contactPhoneNumberInput',
                                    onChangeText: (key, value) => {
                                        dispatch(setEmergencyContactField({ key: key as unknown as keyof IStateInputAddNewContact, value }))
                                    },
                                    palceHolder: 'Enter phone number',
                                    value: contactPhoneNumberInput,
                                    keyboardType: 'numeric'
                                }}
                            />

                            <AddNewContactListTile
                                icon={{ src: images.whatsappImage, present: true, h: 18, w: 18 }}
                                input={{
                                    fieldKey: 'contactWhatsAppInput',
                                    onChangeText: (key, value) => {
                                        dispatch(setEmergencyContactField({ key: key as unknown as keyof IStateInputAddNewContact, value }))
                                    },
                                    palceHolder: 'Enter WhatsApp number',
                                    value: contactWhatsAppInput,
                                    keyboardType: 'numeric'
                                }}
                            />

                        </View>

                        <TouchableOpacity onPress={() => { }}>
                            <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Save Contact</Text>

                                <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}