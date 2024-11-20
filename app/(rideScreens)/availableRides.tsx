import { Image, ScrollView, TouchableOpacity, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import PaddedScreen from '@/components/shared/paddedScreen'
import SafeScreen from '@/components/shared/safeScreen'
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, mb, mt, p, pb, px, py, relative, rounded, w, wFull, wHFull } from '@/utils/styles'
import PageFloatingTitle from '@/components/page/pageFloatingTitle'
import { router, useGlobalSearchParams } from 'expo-router'
import Colors, { colors } from '@/constants/Colors'
import { pages } from '@/constants/pages'
import { setCurrentRideView, setUserRide } from '@/state/slices/ride'
import RideBlock from '@/components/page/rideBlock'
import RideSelectors from '@/state/selectors/ride'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { Href } from 'expo-router'
import FetchService from '@/services/api/fetch.service'
import { IRideAccptedEvent } from '@/socket.io/socket.io.types'
import { EVENTS, socket } from '@/socket.io/socket.io.config'
import { useStorageState } from '@/hooks/useStorageState'
import { useBottomSheet } from '@/contexts/useBottomSheetContext'

export default function AvailableRide() {
    const dispatch = useAppDispatch()
    const { availableRides, stateInput: { pickupBusstopInput, dropoffBusstopInput } } = RideSelectors()
    const [[isLoading, session], setSession] = useStorageState('token');
    const { showBottomSheet, hideBottomSheet, bottomSheetType } = useBottomSheet();
    const { query, } = useGlobalSearchParams<{ query?: string, riderCounterOffer?: string }>();

    useEffect(() => {
        hideBottomSheet();
    }, [query])
    console.log({ 'ccgg': 'jkhjg', query })

    const [fetchState, setFetchState] = useState({
        loading: false,
        msg: '',
        code: null
    })
    const { code, msg, loading } = fetchState;

    const getAvailableRides = async () => {
        setFetchState((prev) => ({ ...prev, loading: true }));
        const returnedData = await FetchService.getWithBearerToken({
            url: '/user/rider/me/available-rides', token: session as string
        });

        const code = returnedData?.code;
        const msg = returnedData?.msg;
        const availableRides = returnedData?.availableRides;

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (code && code == 200 && availableRides) {
            console.log({ '__code && code == 200__': code && code == 200, availableRides: availableRides[0] })
            setFetchState((prev) => ({ ...prev, loading: false, msg: '', code: null }));
        }
        else if (code && code == 400) {
            console.log({ '__code && code == 400__': code && code == 400 })
            setFetchState((prev) => ({ ...prev, loading: false, msg: '', code: null }));
        }
    }

    socket.on(EVENTS.connection, () => {
        // console.log({ '___id___': socket.id });
        socket.on(EVENTS.rideRequestAccepted, (data: IRideAccptedEvent) => {
            // console.log("Ride accepted:", data);
            session && getAvailableRides();
        });
    });

    return (
        <SafeScreen>
            <ScrollView style={[wHFull, relative, { overflow: 'scroll' }]}>

                <PageFloatingTitle title='Available Rides' color={{ icon: Colors.light.textGrey, text: colors.black }} view onPress={() => {
                    router.push(`/${pages.orderRide}` as Href);
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
                                        // dispatch(setUserRide({
                                        //     pickupBusstop: {
                                        //         type: 'pickupBusstop',
                                        //         routeName: pickupBusstopInput
                                        //     },
                                        //     dropoffBusstop: {
                                        //         type: 'dropoffBusstop',
                                        //         routeName: dropoffBusstopInput
                                        //     },
                                        //     saved: false,
                                        //     status: 'idle',
                                        //     seats: ride.seats,
                                        //     tickets: []
                                        // }))

                                        router.push(`/${pages.bookRide}/${ride.id}` as Href)
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
