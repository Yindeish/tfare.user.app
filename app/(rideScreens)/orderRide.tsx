import React, { useEffect, useRef, useState } from 'react';
import SafeScreen from "@/components/shared/safeScreen";
import { absolute, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyStart, l, left0, mXAuto, mb, p, px, py, relative, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { View, StyleSheet, Alert, Text, TouchableOpacity, Button, Dimensions, ScrollView, Image, FlatList } from "react-native";
import Colors, { colors } from '@/constants/Colors';
import { c, colorBlack, colorWhite, fs12, fs14, fs16, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles';
import { Href, router, usePathname } from 'expo-router';
import { FilledForm, RecentDropoffLocations, RecentLocationsSnippet, RecentPickupLocations, RideRouteDetails, SearchingRide } from '@/components/page/orderRideBottomSheetComponents';
import LayoutSelectors from '@/state/selectors/layout';
import { closeBottomSheet, closeModal, openBottomSheet, resetBottomSheetState, setBottomSheetSnapPoint, setBottomSheetType, } from '@/state/slices/layout';
import { useAppDispatch, useAppSelector } from '@/state/hooks/useReduxToolkit';
import { EBottomSheetStatus } from '@/state/enums/layout';
import { images } from '@/constants/images';
import { image } from '@/utils/imageStyles';
import PageFloatingTitle from '@/components/page/pageFloatingTitle';
import { pages } from '@/constants/pages';
import RideSelectors from '@/state/selectors/ride';
import { indices } from '@/constants/zIndices';
import { setCurrentRideView, setUserRide } from '@/state/slices/ride';
import { FontAwesome6 } from '@expo/vector-icons';
import RideBlock from '@/components/page/rideBlock';
import { IRide } from '@/state/types/ride';
import { useBottomSheet } from '@/contexts/useBottomSheetContext';
import { useGlobalSearchParams } from 'expo-router';
import { EVENTS, socket } from '@/socket.io/socket.io.config';
import { IRideAccptedEvent } from '@/socket.io/socket.io.types';
import { useSnackbar } from '@/contexts/snackbar.context';
import { TripCompletedSheet, TripStartedSheet } from '@/components/page/tripStartedBottomSheetComponents';
import { RideBookedSheet } from '@/components/page/bookRideSheetComponent';


type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

function Ride() {
    const dispatch = useAppDispatch()
    const { showBottomSheet, hideBottomSheet, bottomSheetType } = useBottomSheet();
    const { stateInput: { pickupBusstopInput, dropoffBusstopInput }, currentRideView, availableRides, } = RideSelectors()
    const { query, riderCounterOffer } = useGlobalSearchParams<{ query?: string, riderCounterOffer?: string }>();
    const {Snackbar, msg,loading, code,} = useSnackbar();
    const {riderRideDetails: riderRide} = useAppSelector((state) => state.ride);
    console.log({ query });

    useEffect(() => {
        if (query === 'RecentLocationsSnippet') showBottomSheet([601], <RecentLocationsSnippet />, true);
        if (query === 'RecentPickupLocations') showBottomSheet([508,], <RecentPickupLocations />, true);
        if (query === 'RecentDropoffLocations') showBottomSheet([508,], <RecentDropoffLocations />, true);
        if (query === 'FilledForm') showBottomSheet([436, 601], <FilledForm />, true);
        if (query === 'RideRouteDetails') showBottomSheet([477, 601], <RideRouteDetails />, true);
        if (query === 'SearchingRide') showBottomSheet([400], <SearchingRide riderCounterOffer={riderCounterOffer as string} />, true);
        if (query === 'RideBooked') showBottomSheet([800], <RideBookedSheet rideId={riderRide?._id as string} />, true);
        if (query === 'RideStarted') showBottomSheet([500], <TripStartedSheet />);
        if (query === 'RideCompleted') showBottomSheet([500], <TripCompletedSheet />);
        if (query === 'RideEnded') showBottomSheet([500], <TripCompletedSheet />, true);
        if (query === 'RideDeclined') showBottomSheet([300], <View><Text>Trip Declined</Text></View>, true);
    }, [query])


    useEffect(() => {
        !query && router.setParams({ query: 'RecentLocationsSnippet' });
        // showBottomSheet([601], <RecentLocationsSnippet />)
    }, [])

    const [locationError, setLocationError] = useState<string | null>(null);
    const initialRegionObject = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const markerCoordinateObject = {
        latitude: 37.78825,
        longitude: -122.4324,
    };

    const [initialRegion, setInitialRegion] = useState<Region | null>(initialRegionObject);
    const [markerCoordinate, setMarkerCoordinate] = useState<{ latitude: number, longitude: number } | null>(markerCoordinateObject);

    return (
        <SafeScreen>
            <View style={[wHFull, bg(colors.transparent), relative]}>

                {/* Page Title */}

                {currentRideView === 'orderRide' ?
                    (<PageFloatingTitle view={false} onPress={() => {
                        router.push(`/(tab)/` as Href)
                        hideBottomSheet();
                        router.setParams({ query });
                    }} title='Order a Ride' />) :
                    (<PageFloatingTitle view onPress={() => {
                        dispatch(closeBottomSheet());
                        dispatch(setCurrentRideView('orderRide'));
                        dispatch(setBottomSheetType('recentLocationsSnippet'));
                        dispatch(openBottomSheet());
                        dispatch(setBottomSheetSnapPoint(0));
                    }} title='Available Rides' />)}

                {/* Page Title */}

                {/* Pick and drop off inputs block */}

                {(bottomSheetType === EBottomSheetStatus.routeRideDetails || bottomSheetType === EBottomSheetStatus.searchingRides) && (pickupBusstopInput && dropoffBusstopInput) && <View style={[w('90%'), h(104), bg(colors.white), flexCol, justifyStart, gap(16), absolute, t(77), l(20), zIndex(indices.high), rounded(10), py(16), px(24)]}>

                    <View style={[flex, itemsCenter, gap(16), justifyStart]}>
                        <Image style={[image.w(15), image.h(20)]} source={images.yellowLocationImage} />

                        <Text style={[neurialGrotesk, fw500, fs14, colorBlack]}>{pickupBusstopInput.name}</Text>
                    </View>

                    <View style={[w(289), h(0.7), mXAuto, bg(Colors.light.border)]} />

                    <View style={[flex, itemsCenter, gap(16), justifyStart]}>
                        <Image style={[image.w(15), image.h(20)]} source={images.blueLocationImage} />

                        <Text style={[neurialGrotesk, fw500, fs14, colorBlack]}>{dropoffBusstopInput.name}</Text>
                    </View>
                </View>}

                {/* Pick and drop off inputs block */}

                {/* Loaded Rides */}

                {currentRideView === 'availableRides' && bottomSheetType === EBottomSheetStatus.searchingRides && <View style={[w('90%'), h('70%'), bg(colors.transparent), absolute, t(200), l(20), zIndex(indices.high), py(8), { overflow: 'scroll', }]}>

                    <FlatList
                        contentContainerStyle={[h('auto')]}
                        style={[h('auto')]}
                        horizontal={false}
                        data={availableRides}
                        renderItem={(({ index, item: ride }) => (
                            <RideBlock
                                ride={ride}
                                bgColor='#F9F7F8'
                                ctaType='bookRide'
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

                                    router.push(`/${ride._id}/${pages.bookRide}` as Href)
                                }}
                                key={index}
                            />
                        ))}
                    />
                </View>}

                {/* Loaded Rides */}

                {/* MapView */}

                {/* Disabling map on client for the moment */}
                {/* <MapView
                    style={[mapView, wHFull]}
                    // customMapStyle={customMapStyle}
                    userInterfaceStyle='dark'
                    showsMyLocationButton
                    // onUserLocationChange={(location) => console.log({ location })}
                    showsTraffic
                    initialRegion={initialRegion as Region}
                    showsUserLocation={true}
                    zoomEnabled={true}
                    onRegionChange={(val) => {
                        setInitialRegion({
                            latitude: val.latitude,
                            latitudeDelta: val.latitudeDelta,
                            longitude: val.longitude,
                            longitudeDelta: val.longitudeDelta
                        })
                        setMarkerCoordinate({
                            latitude: val.latitude,
                            longitude: val.longitude
                        })
                    }}
                >
                    {markerCoordinate && (
                        <Marker
                            coordinate={markerCoordinate}
                            title="My Location"
                            description={`(${initialRegion?.latitude.toFixed(2)}),(${initialRegion?.longitude.toFixed(2)})`}
                        />
                    )}
                </MapView> */}

                <Image style={[image.w('100%'), image.h('100%'),]} source={images.mapImage} />

                <Snackbar msg={msg} onDismiss={() => {}} snackbarVisible />

                {/* MapView */}

            </View>
        </SafeScreen>
    );
}

export default Ride;
