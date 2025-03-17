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
import { supabase } from '@/supabase/supabase.config';
import { useStorageState } from '@/hooks/useStorageState';
import { RideConstants } from '@/constants/ride';
import usePreventGoBack from '@/hooks/usePreventGoBack';



function RideMap() {
    usePreventGoBack(true);
    

    return (
        <SafeScreen>
            <View style={[wHFull, bg(colors.transparent), relative]}>

                {/* MapView */}

                <Image style={[image.w('100%'), image.h('100%'),]} source={images.mapScreenImage} />

                {/* MapView */}

            </View>
        </SafeScreen>
    );
}

export default RideMap;