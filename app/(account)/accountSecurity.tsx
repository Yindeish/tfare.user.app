import { View, ViewStyle, } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, mXAuto, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, mb, mt, p, pb, px, py, rounded, w, wFull } from '@/utils/styles'
import AccountPageTitle from '@/components/shared/pageTitle'
import { Href, router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import AccountSelectors from '@/state/selectors/account'
import CupertinoBtnListTile from '@/components/shared/cupertinoBtnListTile'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setUserAccountSecurityFeild } from '@/state/slices/account'
import AccountSecurityListTile from '@/components/page/accountSecurityListTile'
import AccountSecuritySheet from '@/components/page/accountSecuritySheet'
import { useBottomSheet } from '@/contexts/useBottomSheetContext'

export default function accountSecurity() {
    const dispatch = useAppDispatch()
    const { stateInput, } = AccountSelectors();
    const { showBottomSheet } = useBottomSheet()

    useEffect(() => {
        // showBottomSheet([640, 820], <AccountSecuritySheet />)
    }, [])


    return (
        <SafeScreen>
            <View style={[wHFull as ViewStyle,]}>
                <PaddedScreen>
                    {/* Page Header */}

                    <AccountPageTitle
                        title='Account Security'
                        onPress={() => router.push(`/(tab)/${tabs.account}` as Href)}
                        style={[mt(47), mb(28),]}
                    />

                    {/* Page Header */}

                    <View style={[wFull, flexCol, gap(32)]}>

                        <CupertinoBtnListTile
                            input={{
                                onChange: () => {
                                    dispatch(setUserAccountSecurityFeild({
                                        key: 'biometricLoginInput', value: !stateInput?.accountSecurity.biometricLoginInput
                                    }))

                                    // update DB
                                },
                                value: stateInput?.accountSecurity.biometricLoginInput
                            }}
                            label='Biometric Login'
                        />

                        <AccountSecurityListTile
                            label='Change Password'
                            onPress={() => router.push('/(account)/profileInfo')}
                        />

                        <AccountSecurityListTile
                            label='Deactivate Account'
                            onPress={() => showBottomSheet([640, 820], <AccountSecuritySheet />)}
                            desc='Deactivate account temporarily. You can always reactivate whenever  you are ready'
                        />

                        <AccountSecurityListTile
                            label='Delete Account'
                            onPress={() => { }}
                            desc='Permanently delete your account. You will not be able to reverse this action after 3 days of deletion'
                        />
                    </View>

                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}