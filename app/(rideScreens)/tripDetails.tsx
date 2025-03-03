import {
    Image,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    ScrollView,
  } from "react-native";
  import { Text } from "react-native-paper";
  import React, { useEffect, useState } from "react";
  import SafeScreen from "@/components/shared/safeScreen";
  import {
    absolute,
    b,
    bg,
    flex,
    flexCol,
    gap,
    h,
    hFull,
    itemsCenter,
    itemsStart,
    justifyBetween,
    justifyCenter,
    justifyStart,
    l,
    mb,
    mt,
    p,
    pb,
    pr,
    px,
    py,
    relative,
    rounded,
    w,
    wFull,
    wHFull,
    zIndex,
  } from "@/utils/styles";
  import PageFloatingTitle from "@/components/page/pageFloatingTitle";
  import { Href, router, useLocalSearchParams, usePathname } from "expo-router";
  import Colors, { colors } from "@/constants/Colors";
  import {
    c,
    colorBlack,
    colorWhite,
    fs12,
    fs14,
    fs18,
    fw400,
    fw500,
    fw700,
    neurialGrotesk,
  } from "@/utils/fontStyles";
  import { image } from "@/utils/imageStyles";
  import { images } from "@/constants/images";
  import { pages } from "@/constants/pages";
  // import RideBlock from "@/components/page/rideBlock";
  import PaddedScreen from "@/components/shared/paddedScreen";
  import { FlatList } from "react-native-gesture-handler";
  import RideSelectors from "@/state/selectors/ride";
  import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
  import {
    createTicket,
    setAllTicketsFilled,
    setCurrentNumberOfTickets,
    setPaymentOptionsVisible,
    setState,
  } from "@/state/slices/ride";
  import { ICurrentRide, IRide, IRiderRideDetails } from "@/state/types/ride";
  import Ticket from "@/components/page/ticket";
  import CtaBtn from "@/components/shared/ctaBtn";
  import { indices } from "@/constants/zIndices";
  import { FontAwesome6, Ionicons } from "@expo/vector-icons";
  import BuyTicketListTile from "@/components/page/buyTicketListTile";
  import FetchService from "@/services/api/fetch.service";
  import { RootState } from "@/state/store";
  import Spinner from "@/components/shared/spinner";
  // import {toast} from "burnt";
  import * as Linking from 'expo-linking';
  import Toast from 'react-native-toast-message'
  import { useGlobalSearchParams } from "expo-router";
  import tw from "@/constants/tw";
  import { useBottomSheet } from "@/contexts/useBottomSheetContext";
  import { TripCompletedSheet, TripStartedSheet } from "@/components/page/tripStartedBottomSheetComponents";
  import { RideConstants } from "@/constants/ride";
  import { useStorageState } from "@/hooks/useStorageState";
  import { RideBookedSheet } from "@/components/page/bookRideSheetComponent";
import RideBlock from "@/components/page/rideBlock";
  


function TripDetails() {

    const { rideId, currentRideId, selectedAvailableRideId, requestId } = useGlobalSearchParams();
    const { token, user } = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();
    const {
      userRide,
      allTicketsFilled,
      stateInput: { pickupBusstopInput, dropoffBusstopInput, userRideInput },
      currentNumberOfTickets,
      paymentOptionsVisible,
    } = RideSelectors();
    const {selectedAvailableRide, riderRideDetails: riderRide, ridePlans, stateInput:{paymentOptionInput}} = useAppSelector((state: RootState) => state.ride);
    const path = usePathname();
    const {showBottomSheet, hideBottomSheet} = useBottomSheet();
    const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);

     const openMap = () => {
        const riderRide = selectedAvailableRide?.ridersRides.find((ride) => String(ride?.riderId) == String(user?._id));
        const location = riderRide?.dropoffBusstop?.name || selectedAvailableRide?.inRideDropoffs[selectedAvailableRide?.inRideDropoffs.length-1]?.name;
        const mapLink = `https://www.google.com/maps?q=${location}`;
      
        Linking.openURL(mapLink).catch((err) => console.error('Failed to open map:', err));
      };
    

    return (
        <SafeScreen>
      <ScrollView style={[wHFull, relative, { overflow: "scroll" }]}>
        {/* Page Title */}
        <PageFloatingTitle
          title="Book Ride"
          color={{ icon: Colors.light.textGrey, text: colors.black }}
          onPress={() => router.push(`/${pages.availableRides}` as Href)}
          view={false}
        />
        {/* Page Title */}

        <View style={[wHFull, mt(120), flexCol, gap(32), mb(32)]}>
          <RideBlock
            ride={selectedAvailableRide as ICurrentRide}
            bgColor="#FFF7E6"
            ctaType="trackRide"
            touchable
            roundedCorners={false}
            onPress={() => {
              openMap()
            }}
          />

</View>
</ScrollView>
</SafeScreen>
    )
}

export default TripDetails;