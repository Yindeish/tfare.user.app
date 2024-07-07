import { View, Text } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { wHFull } from '@/utils/imageStyles'
import { flex, flexCol, gap, itemsCenter, justifyBetween, mt, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, colorWhite, fs12, fs14, fw500, neurialGrotesk } from '@/utils/fontStyles'
import AccountPageTitle from '@/components/page/accountPageTitle'
import { router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function emergencyContacts() {
    return (
        <SafeScreen>
            <View style={[wHFull,]}>
                <PaddedScreen>
                    {/* Page Header */}

                    <View style={[wFull, flex, itemsCenter, justifyBetween, mt(47),]}>
                        <AccountPageTitle
                            title='Emergency Contacts'
                            onPress={() => router.push(`/(tab)/${tabs.account}`)}
                            style={[]}
                        />

                    </View>

                    {/* Page Header */}

                    <View style={[wFull, flexCol, gap(40), mt(28)]}>
                        <View></View>

                        <TouchableOpacity>

                        </TouchableOpacity>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}