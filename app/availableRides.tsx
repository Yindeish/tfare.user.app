import { Image, ScrollView, TouchableOpacity, View, } from 'react-native'
import React from 'react'
import PaddedScreen from '@/components/shared/paddedScreen'
import SafeScreen from '@/components/shared/safeScreen'
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, mb, mt, p, pb, px, py, relative, rounded, w, wFull, wHFull } from '@/utils/styles'
import PageFloatingTitle from '@/components/page/pageFloatingTitle'
import { router } from 'expo-router'
import Colors, { colors } from '@/constants/Colors'
import { pages } from '@/constants/pages'
import { setCurrentRideView } from '@/state/slices/ride'
import RideBlock from '@/components/page/rideBlock'

export default function AvailableRide() {
    return (
        <SafeScreen>
            <View style={[wHFull, relative, { overflow: 'scroll' }]}>

                <PageFloatingTitle title='Available Rides' color={{ icon: Colors.light.textGrey, text: colors.black }} view onPress={() => {
                    router.push(`/${pages.orderRide}`);
                    setCurrentRideView('availableRides');
                }} />

                <PaddedScreen>
                    <View style={[wFull, h('70%'), mt(130), { overflow: 'scroll', }]}>
                        <ScrollView style={[wFull, h('auto'), flexCol, gap(26),]}>
                            {['', '', '', '', '', '',].map((ride, index) => (
                                <RideBlock
                                    bgColor='#F9F7F8'
                                    ctaType='bookRide'
                                    touchable
                                    roundedCorners
                                    onPress={() => router.push(`/${pages.bookRide}`)}
                                    key={index}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}
