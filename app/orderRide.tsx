import React, { useEffect, useRef, useState } from 'react';
import SafeScreen from "@/components/safeScreen";
import { absolute, bg, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyStart, l, left0, mXAuto, mb, p, px, py, relative, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { View, StyleSheet, Alert, Text, TouchableOpacity, Button, Dimensions, ScrollView, Image, FlatList } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Colors, { colors } from '@/constants/Colors';
import { colorBlack, colorWhite, fs14, fs16, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles';
import { router } from 'expo-router';
import { FilledForm, RecentDropoffLocations, RecentLocationsSnippet, RecentPickupLocations, RideRouteDetails, SearchingRide } from '@/components/page/orderRideBottomSheet';
import LayoutSelectors from '@/state/selectors/layout';
import { closeBottomSheet, openBottomSheet, resetBottomSheetState, } from '@/state/slices/layout';
import { useAppDispatch } from '@/state/hooks/useReduxToolkit';
import { EBottomSheetStatus } from '@/state/enums/layout';
import { images } from '@/constants/images';
import { image } from '@/utils/imageStyles';
import PageFloatingTitle from '@/components/page/pageFloatingTitle';
import BottomSheet from '@/components/bottomSheet';
import { pages } from '@/constants/pages';

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
    const { bottomSheet, modal } = LayoutSelectors();

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

                <PageFloatingTitle onPress={() => {
                    dispatch(resetBottomSheetState());
                    dispatch(closeBottomSheet());
                }} title='Order a Ride' />

                {(bottomSheet.type === EBottomSheetStatus.routeRideDetails || bottomSheet.type === EBottomSheetStatus.searchingRides) && <View style={[w('90%'), h(104), bg(colors.white), flexCol, justifyStart, gap(16), absolute, t(77), l(20), zIndex(100), rounded(10), py(16), px(24)]}>
                    <View style={[flex, itemsCenter, gap(16), justifyStart]}>
                        <Image style={[image.w(15), image.h(20)]} source={images.yellowLocationImage} />

                        <Text style={[neurialGrotesk, fw500, fs14, colorBlack]}>Sangotedo Bus stop</Text>
                    </View>

                    <View style={[w(289), h(0.7), mXAuto, bg(Colors.light.border)]} />

                    <View style={[flex, itemsCenter, gap(16), justifyStart]}>
                        <Image style={[image.w(15), image.h(20)]} source={images.blueLocationImage} />

                        <Text style={[neurialGrotesk, fw500, fs14, colorBlack]}>Ojodu Bus stop</Text>
                    </View>
                </View>}


                {bottomSheet.type === EBottomSheetStatus.searchingRides && <View style={[w('90%'), h('70%'), bg(colors.transparent), absolute, t(200), l(20), zIndex(100), py(8), { overflow: 'hidden' }]}>

                    <ScrollView style={[wFull, bg(colors.transparent), flexCol, gap(32)]}>
                        {['', '', '', '', '', '', ''].map((item, index) => (
                            <TouchableOpacity onPress={() => router.push(`/${pages.bookRide}`)} style={[wFull, h(170), bg(colors.white), rounded(10), flexCol, gap(32), p(12), mb(20)]} key={index}>

                                <View style={[wFull, flex, justifyBetween, itemsCenter]}>
                                    <View style={[flexCol, gap(20)]}>
                                        <Text>Rider #234HYI</Text>
                                        <Text>Honda 240</Text>
                                    </View>

                                    <View style={[w('auto'), rounded(12), p(10)]}>
                                        <Image style={[image.w(20), image.h(23)]} source={images.passengersImage} />

                                        <Text>3 seats available</Text>
                                    </View>
                                </View>

                                <View>

                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                </View>}

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

                <BottomSheet>
                    {bottomSheet.type === EBottomSheetStatus.recentLocationsSnippet && <RecentLocationsSnippet />}

                    {bottomSheet.type === EBottomSheetStatus.recentPickupLocations && <RecentPickupLocations />}

                    {bottomSheet.type === EBottomSheetStatus.recentDropoffLocations && <RecentDropoffLocations />}

                    {bottomSheet.type === EBottomSheetStatus.filledForm && <FilledForm />}

                    {bottomSheet.type === EBottomSheetStatus.routeRideDetails && <RideRouteDetails />}

                    {bottomSheet.type === EBottomSheetStatus.searchingRides && <SearchingRide />}
                </BottomSheet>
            </View>
        </SafeScreen>
    );
}

export default Ride;
