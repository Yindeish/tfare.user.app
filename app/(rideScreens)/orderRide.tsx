import React, { useEffect, useRef, useState } from 'react';
import SafeScreen from "@/components/shared/safeScreen";
import { absolute, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyStart, l, left0, mXAuto, mb, p, px, py, relative, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { View, StyleSheet, Alert, Text, TouchableOpacity, Button, Dimensions, ScrollView, Image, FlatList } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Colors, { colors } from '@/constants/Colors';
import { c, colorBlack, colorWhite, fs12, fs14, fs16, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles';
import { router } from 'expo-router';
import { FilledForm, RecentDropoffLocations, RecentLocationsSnippet, RecentPickupLocations, RideRouteDetails, SearchingRide } from '@/components/page/orderRideBottomSheetComponents';
import LayoutSelectors from '@/state/selectors/layout';
import { closeBottomSheet, closeModal, openBottomSheet, resetBottomSheetState, setBottomSheetSnapPoint, setBottomSheetType, } from '@/state/slices/layout';
import { useAppDispatch } from '@/state/hooks/useReduxToolkit';
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

const { mapView } = StyleSheet.create({
    mapView: {
    }
});

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

    useEffect(() => {
        showBottomSheet([601], <RecentLocationsSnippet />)
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
                        router.push(`/(tab)/`)
                        hideBottomSheet()
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

                {(bottomSheetType === EBottomSheetStatus.routeRideDetails || bottomSheetType === EBottomSheetStatus.searchingRides) && (pickupBusstopInput !== '' && dropoffBusstopInput !== '') && <View style={[w('90%'), h(104), bg(colors.white), flexCol, justifyStart, gap(16), absolute, t(77), l(20), zIndex(indices.high), rounded(10), py(16), px(24)]}>

                    <View style={[flex, itemsCenter, gap(16), justifyStart]}>
                        <Image style={[image.w(15), image.h(20)]} source={images.yellowLocationImage} />

                        <Text style={[neurialGrotesk, fw500, fs14, colorBlack]}>{pickupBusstopInput}</Text>
                    </View>

                    <View style={[w(289), h(0.7), mXAuto, bg(Colors.light.border)]} />

                    <View style={[flex, itemsCenter, gap(16), justifyStart]}>
                        <Image style={[image.w(15), image.h(20)]} source={images.blueLocationImage} />

                        <Text style={[neurialGrotesk, fw500, fs14, colorBlack]}>{dropoffBusstopInput}</Text>
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
                    />
                </View>}

                {/* Loaded Rides */}

                {/* MapView */}

                <MapView
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
                </MapView>

                {/* MapView */}

            </View>
        </SafeScreen>
    );
}

export default Ride;
