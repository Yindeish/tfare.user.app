import { View, Text, Image, ViewStyle, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mt, p, px, py, rounded, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, colorWhite, fs12, fs14, fw500, neurialGrotesk } from '@/utils/fontStyles'
import AccountPageTitle from '@/components/shared/pageTitle'
import { Href, router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import { RefreshControl, TouchableOpacity } from 'react-native-gesture-handler'
import EmergencyContactListTile from '@/components/page/emergencyContactsListTile'
import AccountSelectors from '@/state/selectors/account'
import { pages } from '@/constants/pages'
import { IEmergencyContact } from '@/state/types/account'
import FetchService from '@/services/api/fetch.service'
import { useSession } from '@/contexts/userTokenContext'
import { ScrollView } from 'react-native'

export default function emergencyContacts() {
    const { } = AccountSelectors();
    const { tokenSession } = useSession()

    const [state, setState] = useState({
        msg: '',
        code: null,
        emergencyContacts: [],
        loading: false
    })
    const { code, msg, emergencyContacts, loading } = state;

    const onChange = ({ key, value }: { key: 'code' | 'msg' | 'emergencyContacts' | 'loading', value: string | number | boolean | IEmergencyContact[] }) => setState((prev) => ({ ...prev, [key]: value }));

    const getContacts = async () => {
        onChange({ key: 'loading', value: true });

        const returnedData = await FetchService.getWithBearerToken({ token: tokenSession as string, url: '/user/rider/me/account/emergency-contacts' })
        console.log({ returnedData })

        onChange({ key: 'loading', value: false });
        onChange({ key: 'code', value: returnedData.code });
        onChange({ key: 'msg', value: returnedData.msg });

        if (returnedData?.riderEmergencyContacts) {
            onChange({ key: 'emergencyContacts', value: returnedData.riderEmergencyContacts });
            console.log({ one: emergencyContacts[0] })
        }
    }

    useEffect(() => {
        getContacts();
    }, [])

    return (
        <SafeScreen>
            <ScrollView
                refreshControl={<RefreshControl
                    refreshing={loading} onRefresh={() => {
                        emergencyContacts.length == 0 && getContacts()
                    }} />}
                style={[wHFull as ViewStyle,]}>
                <PaddedScreen>
                    {/* Page Header */}

                    <AccountPageTitle
                        title='Emergency Contacts'
                        onPress={() => router.push(`/(tab)/${tabs.account}` as Href)}
                        style={[]}
                    />

                    {/* Page Header */}

                    {!loading ? (<View style={[wFull, flexCol, gap(40), mt(28)]}>
                        <View style={[wFull, flexCol, gap(16)]}>

                            {(emergencyContacts as IEmergencyContact[])?.map((contact, index) => (
                                <EmergencyContactListTile
                                    email={contact?.email}
                                    name={contact?.name}
                                    phoneNumber={contact?.phoneNumber?.toString()}
                                    key={index}
                                />
                            ))}

                        </View>

                        <TouchableOpacity
                            onPress={() => router.push(`/(account)/${pages.addNewContact}` as Href)}
                            style={[wFull, h(50), rounded(100), py(16), px(32), flex, itemsCenter, justifyCenter, gap(10), bg('#F9F7F8'), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                            <Image style={[image.w(20), image.h(20)]} source={images.topupImage} />

                            <Text style={[colorBlack, fs12, neurialGrotesk, fw500]}>Add New Contact</Text>
                        </TouchableOpacity>
                    </View>) : <ActivityIndicator />}
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}