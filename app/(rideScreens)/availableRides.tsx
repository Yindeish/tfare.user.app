import { Image, ScrollView, TouchableOpacity, View, } from 'react-native'
import React from 'react'
import PaddedScreen from '@/components/shared/paddedScreen'
import SafeScreen from '@/components/shared/safeScreen'
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, mb, mt, p, pb, px, py, relative, rounded, w, wFull, wHFull } from '@/utils/styles'
import PageFloatingTitle from '@/components/page/pageFloatingTitle'
import { router } from 'expo-router'
import Colors, { colors } from '@/constants/Colors'
import { pages } from '@/constants/pages'
import { setCurrentRideView, setUserRide } from '@/state/slices/ride'
import RideBlock from '@/components/page/rideBlock'
import RideSelectors from '@/state/selectors/ride'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { IRide } from '@/state/types/ride'

export default function AvailableRide() {
    const dispatch = useAppDispatch()
    const { availableRides, stateInput: { pickupBusstopInput, dropoffBusstopInput } } = RideSelectors()

    return (
        <SafeScreen>
            <ScrollView style={[wHFull, relative, { overflow: 'scroll' }]}>

                <PageFloatingTitle title='Available Rides' color={{ icon: Colors.light.textGrey, text: colors.black }} view onPress={() => {
                    router.push(`/${pages.orderRide}`);
                    setCurrentRideView('availableRides');
                }} />

                <PaddedScreen>
                    <View style={[wFull, mt(130), { overflow: 'scroll', }]}>
                        <View style={[wFull, flexCol, gap(26),]}>
                            {availableRides.map((ride, index) => (
                                <RideBlock
                                    bgColor='#F9F7F8'
                                    ctaType='bookRide'
                                    ride={ride}
                                    touchable
                                    roundedCorners
                                    onPress={() => {
                                        dispatch(setUserRide({
                                            pickupBusstop: {
                                                type: 'pickupBusstop',
                                                routeName: pickupBusstopInput
                                            },
                                            dropoffBusstop: {
                                                type: 'dropoffBusstop',
                                                routeName: dropoffBusstopInput
                                            },
                                            saved: false,
                                            status: 'idle',
                                            seats: ride.seats,
                                            tickets: []
                                        }))

                                        router.push(`/${ride.id}/${pages.bookRide}`)
                                    }}
                                    key={index}
                                />
                            ))}
                        </View>
                    </View>
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}
