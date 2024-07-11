import PaddedScreen from "@/components/shared/paddedScreen";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { images } from "@/constants/images";
import { indices } from "@/constants/zIndices";
import { EBottomSheetStatus } from "@/state/enums/layout";
import LayoutSelectors from "@/state/selectors/layout";
import RideSelectors from "@/state/selectors/ride";
import { colorBlack, fs14, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image, mXAuto, wHFull } from "@/utils/imageStyles";
import { absolute, bg, flex, flexCol, gap, h, itemsCenter, justifyStart, l, px, py, relative, rounded, t, w, wFull, zIndex } from "@/utils/styles";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";
import BottomSheet from '@/components/shared/bottomSheet';
import MapView, { Marker } from 'react-native-maps';
import { CancelRide, TripCompletedSheet, TripStartedSheet } from "@/components/page/tripStartedBottomSheetComponents";
import BottomSheetModal from "@/components/shared/bottomSheetModal";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import { openModal } from "@/state/slices/layout";

type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

function TripStarted() {
    const dispatch = useAppDispatch()
    const { bottomSheet } = LayoutSelectors();
    const { pickupBusstopInput, dropoffBusstopInput } = RideSelectors()

    useEffect(() => {
        dispatch(openModal());
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
                {/* Drop off inputs block */}

                {true
                    // (bottomSheet.type === EBottomSheetStatus.tripStarted || bottomSheet.type === EBottomSheetStatus.tripCompleted) && (dropoffBusstopInput !== '')
                    && <View style={[w('90%'), h(104), bg(colors.white), flexCol, justifyStart, gap(16), absolute, t(77), l(20), zIndex(indices.high), rounded(10), py(16), px(24)]}>

                        <View style={[flex, itemsCenter, gap(16), justifyStart]}>
                            <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />

                            <Text style={[fw700, fs14, colorBlack, neurialGrotesk,]}>Destination</Text>
                        </View>

                        <View style={[wFull, h(0.7), mXAuto, bg(Colors.light.border)]} />

                        <Text style={[fw500, fs14, colorBlack]}>{dropoffBusstopInput}</Text>
                    </View>}

                {/* Drop off inputs block */}

                <MapView
                    style={[wHFull]}
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

                {/* BottomSheet */}

                <BottomSheet>

                    {false
                        // bottomSheet.type === EBottomSheetStatus.tripStarted
                        && <TripStartedSheet />}
                    {false
                        // bottomSheet.type === EBottomSheetStatus.tripCompleted
                        && <TripCompletedSheet />}

                </BottomSheet>

                {/* BottomSheet */}

                {/* BottomSheet Modal */}
                <BottomSheetModal
                    initialIdex={2}
                    bgColor={colors.transparent}
                    indicator={false}
                    onDismiss={() => {
                        // dispatch(setBottomSheetSnapPoint(-1));
                    }}>

                    {true
                        // bottomSheet.type === EBottomSheetStatus.cancelRide
                        && <CancelRide />}

                </BottomSheetModal>
                {/* BottomSheet Modal */}
            </View>
        </SafeScreen>
    )
}

export default TripStarted;