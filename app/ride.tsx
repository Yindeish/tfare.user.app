import React, { useEffect, useRef, useState } from 'react';
import SafeScreen from "@/components/safeScreen";
import { absolute, bg, flex, gap, h, itemsCenter, justifyBetween, justifyStart, l, left0, relative, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { View, StyleSheet, Alert, Text, TouchableOpacity, Button, Dimensions } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Colors, { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { colorWhite, fs16, fw700, neurialGrotesk } from '@/utils/fontStyles';
import { router } from 'expo-router';
import BottomSheet from '@/components/bottomSheet';
import OrderRideBottomSheet from '@/components/page/orderRideBottomSheet';
import { Portal, Dialog, Paragraph } from 'react-native-paper';

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
    // const [initialRegion, setInitialRegion] = useState<Region | null>(null);
    // const [markerCoordinate, setMarkerCoordinate] = useState<{ latitude: number, longitude: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             let { status } = await Location.requestForegroundPermissionsAsync();
    //             if (status !== 'granted') {
    //                 setLocationError('Permission to access location was denied');
    //                 return;
    //             }

    //             let location = await Location.getCurrentPositionAsync({
    //             });
    //             console.log({ location })

    //             setInitialRegion({
    //                 latitude: location.coords.latitude,
    //                 longitude: location.coords.longitude,
    //                 latitudeDelta: 0.005,
    //                 longitudeDelta: 0.005,
    //             });
    //             setMarkerCoordinate({
    //                 latitude: location.coords.latitude,
    //                 longitude: location.coords.longitude,
    //             });
    //         } catch (error) {
    //             setLocationError('Unable to fetch location');
    //             console.error(error);
    //         }
    //     })();
    // }, []);

    // if (locationError) {
    //     return (
    //         <SafeScreen>
    //             <View style={[wHFull, { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
    //                 <Text>{locationError}</Text>
    //             </View>
    //         </SafeScreen>
    //     );
    // }

    // if (!initialRegion) {
    //     return (
    //         <SafeScreen>
    //             <View style={[wHFull, { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
    //                 <Text>Loading...</Text>
    //             </View>
    //         </SafeScreen>
    //     );
    // }
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

    const refRBSheet = useRef();
    let [currentHeight, setCurrentHeight] = useState<637 | 508 | 490 | 436 | number>(436);
    useEffect(() => {
        (refRBSheet?.current as any)?.open();
    }, [])

    return (
        <SafeScreen>
            <View style={[wHFull, bg(colors.transparent), relative]}>

                <View style={[w(132), h(20), bg(colors.transparent), flex, justifyStart, gap(16), absolute, t(77), l(20), zIndex(10)]}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={20} color={colors.white} />
                    </TouchableOpacity>

                    <Text style={[colorWhite, fs16, fw700, neurialGrotesk,]}>Order a Ride</Text>
                </View>

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

                <BottomSheet controller={refRBSheet} currentHeight={currentHeight}>
                    <OrderRideBottomSheet />
                </BottomSheet>
            </View>
        </SafeScreen>
    );
}

export default Ride;
