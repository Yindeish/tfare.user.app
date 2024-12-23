import { Image, ScrollView, TouchableOpacity, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import PaddedScreen from '@/components/shared/paddedScreen'
import SafeScreen from '@/components/shared/safeScreen'
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, mb, mt, p, pb, px, py, relative, rounded, w, wFull, wHFull } from '@/utils/styles'
import PageFloatingTitle from '@/components/page/pageFloatingTitle'
import { router, useGlobalSearchParams, usePathname, useRouter } from 'expo-router'
import Colors, { colors } from '@/constants/Colors'
import { pages } from '@/constants/pages'
import { setCurrentRideView, setState, setUserRide } from '@/state/slices/ride'
import RideBlock from '@/components/page/rideBlock'
import RideSelectors from '@/state/selectors/ride'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { Href } from 'expo-router'
import FetchService from '@/services/api/fetch.service'
import { IRideAccptedEvent } from '@/socket.io/socket.io.types'
import { EVENTS, socket } from '@/socket.io/socket.io.config'
import { useStorageState } from '@/hooks/useStorageState'
import { useBottomSheet } from '@/contexts/useBottomSheetContext'
import { ICurrentRide, IRide, IRiderRideDetails } from '@/state/types/ride'
import { c, colorBlack, colorWhite, fs12, fs14, fs16, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles';
import { images } from '@/constants/images';
import { image } from '@/utils/imageStyles';
import { FontAwesome6 } from '@expo/vector-icons';
import { RefreshControl } from 'react-native-gesture-handler'

export default function AvailableRide() {
    const dispatch = useAppDispatch()
    const { availableRides, stateInput: { pickupBusstopInput, dropoffBusstopInput } } = RideSelectors()
    const [[isLoading, session], setSession] = useStorageState('token');
    const { showBottomSheet, hideBottomSheet, bottomSheetType } = useBottomSheet();
    const { query, } = useGlobalSearchParams<{ query?: string, riderCounterOffer?: string }>();
    const route  = usePathname();

    useEffect(() => {
        hideBottomSheet();
    }, [query])
    // console.log({ 'ccgg': 'jkhjg', query })

    const [fetchState, setFetchState] = useState({
        loading: false,
        msg: '',
        code: null,
    })
    const { code, msg, loading, } = fetchState;

    const getAvailableRides = async () => {
        setFetchState((prev) => ({ ...prev, loading: true }));
        const returnedData = await FetchService.getWithBearerToken({
            url: '/user/rider/me/available-rides', token: session as string
        });

        const code = returnedData?.code;
        const msg = returnedData?.msg;
        const availableRidesTotal = returnedData?.availableRides.length;
        const availableRidesRequests = returnedData?.availableRides;

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (code && code == 200 && availableRidesRequests) {
            setFetchState((prev) => ({ ...prev, loading: false, msg: '', code: null }));
            if(availableRidesTotal != availableRides.length) {}
            dispatch(setState({ key:'availableRides', value: availableRidesRequests }));
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

    useEffect(() => {
        if (session && route == 'availableRides') {
          const intervalId = setInterval(() => {
            getAvailableRides();
          }, 3000);
    
        //   return () => clearInterval(intervalId);
        }
      }, [session]);

    return (
        <SafeScreen>
            <ScrollView 
            style={[wHFull, relative, { overflow: 'scroll' }]}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={getAvailableRides}
                    tintColor={Colors.light.textGrey}
                    colors={[Colors.light.textGrey]}
                />
            }
            >

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
                                        dispatch(setUserRide({riderRideDetails: ride?.riderRideDetails as IRiderRideDetails, currentRide: ride?.currentRide as ICurrentRide}));

                                        router.push(`/bookRide?rideId=${ride?.riderRideDetails?._id}&currentRideId=${ride?.currentRide?._id}` as Href)
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
