import { View, Text, Image, ViewStyle, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import EmergencyContactListTile from '@/components/page/emergencyContactsListTile'
import AccountSelectors from '@/state/selectors/account'
import { pages } from '@/constants/pages'
import AddNewContactListTile from '@/components/page/AddNewContactListTile'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setEmergencyContactField } from '@/state/slices/account'
import { IStateInputAddNewContact } from '@/state/types/account'
import SavedAddressListTile from '@/components/page/SavedAddressesListTile'
import { useSession } from '@/contexts/userTokenContext'
import FetchService from '@/services/api/fetch.service'
import { ISavedBusStop } from '@/state/types/ride'

export default function SavedAddresses() {
    const dispatch = useAppDispatch()
    const { } = AccountSelectors();

    const { tokenSession } = useSession()

    const [state, setState] = useState({
        msg: '',
        code: null,
        savedAddresses: [],
        loading: false
    })
    const { code, msg, savedAddresses, loading } = state;

    const onChange = ({ key, value }: { key: 'code' | 'msg' | 'savedAddresses' | 'loading', value: string | number | boolean | ISavedBusStop[] }) => setState((prev) => ({ ...prev, [key]: value }));

    const getSavedAddresses = async () => {
        onChange({ key: 'loading', value: true });
        onChange({ key: 'msg', value: '' });

        const returnedData = await FetchService.getWithBearerToken({ token: tokenSession as string, url: '/user/rider/me/account/saved-addresses', timeout: 1000 })

        onChange({ key: 'loading', value: false });
        onChange({ key: 'code', value: returnedData?.code });
        onChange({ key: 'msg', value: returnedData.msg });

        if (returnedData?.riderSavedAddresses) {
            onChange({ key: 'savedAddresses', value: returnedData.riderSavedAddresses });
        }
    }

    useEffect(() => {
        getSavedAddresses();
    }, [])

    return (
        <SafeScreen>
            <ScrollView
                refreshControl={<RefreshControl
                    refreshing={loading} onRefresh={() => {
                        savedAddresses.length == 0 && getSavedAddresses()
                    }} />}
                style={[wHFull as ViewStyle,]}>
                <PaddedScreen>
                    {/* Page Header */}

                    <AccountPageTitle
                        title='Saved Addresses'
                        onPress={() => router.push(`/(tab)/${tabs.account}` as Href)}
                        style={[]}
                    />

                    {/* Page Header */}

                    <View style={[wFull, flexCol, gap(40), mt(28)]}>
                        {!loading ? (<View style={[wFull, flexCol, gap(16)]}>

                            {savedAddresses.map((address, index) => (
                                <SavedAddressListTile
                                    address={address}
                                    key={index}
                                />
                            ))}
                        </View>) : <ActivityIndicator />}

                        <TouchableOpacity
                            onPress={() => router.push(`/(account)/${pages.saveNewAddress}` as Href)}
                            style={[wFull, h(50), rounded(100), py(16), px(32), flex, itemsCenter, justifyCenter, gap(10), bg('#F9F7F8'), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                            <Image style={[image.w(20), image.h(20)]} source={images.topupImage} />

                            <Text style={[colorBlack, fs12, neurialGrotesk, fw500]}>Save New Address</Text>
                        </TouchableOpacity>
                    </View>
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}