import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mt, p, px, py, rounded, wFull } from '@/utils/styles'
import AccountPageTitle from '@/components/shared/pageTitle'
import { router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import AccountSelectors from '@/state/selectors/account'
import CupertinoBtnListTile from '@/components/shared/cupertinoBtnListTile'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setUserNotificationField, setUserNotifications } from '@/state/slices/account'

export default function notifications() {
    const dispatch = useAppDispatch()
    const { stateInput, } = AccountSelectors();

    return (
        <SafeScreen>
            <View style={[wHFull,]}>
                <PaddedScreen>
                    {/* Page Header */}

                    <AccountPageTitle
                        title='Notifications'
                        onPress={() => router.push(`/(tab)/${tabs.account}`)}
                        style={[]}
                    />

                    {/* Page Header */}

                    <View style={[wFull, flexCol, gap(40), mt(28)]}>
                        <View style={[wFull, flexCol, gap(16)]}>

                            <CupertinoBtnListTile
                                input={{
                                    onChange: () => {
                                        dispatch(setUserNotificationField({ key: 'orderStatusInput', value: !stateInput?.notifications?.orderStatusInput as boolean }))
                                        // update DB
                                    },
                                    value: stateInput?.notifications?.orderStatusInput as boolean
                                }}
                                label='Order Status'
                            />

                            <CupertinoBtnListTile
                                input={{
                                    onChange: () => {
                                        dispatch(setUserNotificationField({ key: 'generalUpdatesInput', value: !stateInput?.notifications?.generalUpdatesInput as boolean }))
                                    },
                                    value: stateInput?.notifications?.generalUpdatesInput as boolean
                                }}
                                label='General Updates'
                            />

                            <CupertinoBtnListTile
                                input={{
                                    onChange: () => {
                                        dispatch(setUserNotificationField({ key: 'promotionalOffersInput', value: !stateInput?.notifications?.promotionalOffersInput as boolean }))
                                    },
                                    value: stateInput?.notifications?.promotionalOffersInput as boolean
                                }}
                                label='Promotional Offers'
                            />

                            <CupertinoBtnListTile
                                input={{
                                    onChange: () => {
                                        dispatch(setUserNotificationField({ key: 'tipsAndTutorialsInput', value: !stateInput?.notifications?.tipsAndTutorialsInput as boolean }))
                                    },
                                    value: stateInput?.notifications?.tipsAndTutorialsInput as boolean
                                }}
                                label='Tips and Tutorials'
                            />

                            <CupertinoBtnListTile
                                input={{
                                    onChange: () => {
                                        dispatch(setUserNotificationField({ key: 'transactionUpdatesInput', value: !stateInput?.notifications?.transactionUpdatesInput as boolean }))
                                    },
                                    value: stateInput?.notifications?.transactionUpdatesInput as boolean
                                }}
                                label='Transaction Updates'
                            />

                        </View>

                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}