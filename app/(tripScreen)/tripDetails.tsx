import {
  Image,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
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
  pl,
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
// import TripBlock from "@/components/page/rideBlock";
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
import {
  ICurrentRide,
  IRide,
  IRiderRideDetails,
  ITicket,
} from "@/state/types/ride";
import CtaBtn from "@/components/shared/ctaBtn";
import { indices } from "@/constants/zIndices";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import BuyTicketListTile from "@/components/page/buyTicketListTile";
import FetchService from "@/services/api/fetch.service";
import { RootState } from "@/state/store";
import Spinner from "@/components/shared/spinner";
// import {toast} from "burnt";
import * as Linking from "expo-linking";
import Toast from "react-native-toast-message";
import { useGlobalSearchParams } from "expo-router";
import tw from "@/constants/tw";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import {
  TripCompletedSheet,
  TripStartedSheet,
} from "@/components/page/tripStartedBottomSheetComponents";
import { RideConstants } from "@/constants/ride";
import { useStorageState } from "@/hooks/useStorageState";
import { RideBookedSheet } from "@/components/page/bookRideSheetComponent";
import Ticket from "@/components/page/ticket";
import * as Device from "expo-device";
import * as Location from "expo-location";
import ScaleUpDown from "@/components/shared/scale_animator";
import { Utils } from "@/utils";

function TripDetails() {
  const { rideId, currentRideId, selectedAvailableRideId, requestId } =
    useGlobalSearchParams();
  const { token, user } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const {
    userRide,
    allTicketsFilled,
    stateInput: { pickupBusstopInput, dropoffBusstopInput, userRideInput },
    currentNumberOfTickets,
    paymentOptionsVisible,
  } = RideSelectors();
  const {
    currentTrip,
    riderRideDetails: riderRide,
    ridePlans,
    ticketsInputs
  } = useAppSelector((state: RootState) => state.trip);
  const path = usePathname();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);

  console.log({ticketsInputs})

  return (
    <SafeScreen>
      <ScrollView style={[wHFull, relative, { overflow: "scroll" }]}>
        {/* Page Title */}
        <PageFloatingTitle
          title="Trip Details"
          color={{ icon: Colors.light.textGrey, text: colors.black }}
          onPress={() => router.push(`/(rideScreens)/rideMap` as Href)}
          view={false}
        />
        {/* Page Title */}

        <View style={[wHFull, mt(120), flexCol, gap(32), px(20)]}>
          <TripBlock />

          <FlatList
              horizontal={false}
              data={ticketsInputs}
              renderItem={({ index, item: ticketId }) => (
                <Ticket ticket={ticketId} index={index} key={index} />
              )}
            />

          <View style={[wFull, flexCol, gap(16)]}>
                <View
                  style={[
                    wFull,
                    flexCol,
                    gap(16),
                    pb(120),
                    {
                      borderBottomColor: Colors.light.border,
                      borderBottomWidth: 0.7,
                    },
                  ]}
                >
                <View
                  style={[
                    wFull,
                    flexCol,
                    gap(16),
                    pb(16),
                    {
                      borderBottomColor: Colors.light.border,
                      borderBottomWidth: 0.7,
                    },
                  ]}
                >
                  <BuyTicketListTile
                    leadingText="Trip ID"
                    trailing={{
                      text: currentTrip?._id || selectedAvailableRideId as string,
                    }}
                  />
                  <BuyTicketListTile
                    leadingText="Trip Cost"
                    trailing={{
                      text: `₦ ${ridePlans[0]?.ride?.rideFee || ridePlans[0]?.plan?.ride?.rideFee || ''}`,
                    }}
                  />
                  <BuyTicketListTile
                    leadingText="Service Fee"
                    trailing={{
                      text: `₦ ${ridePlans?.[0]?.plan?.serviceFee || ''}`,
                    }}
                  />
                </View>

                <BuyTicketListTile
                  leadingText="Total"
                  trailing={{
                    text: `₦ ${Number(ridePlans[0]?.plan?.ride?.rideFee || ridePlans[0]?.ride?.rideFee) + Number(ridePlans?.[0]?.plan?.serviceFee) || ''}`,
                  }}
                />
              </View>
        </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default TripDetails;

function TripBlock() {
  const { currentTrip } = useAppSelector(
    (state: RootState) => state.trip
  );

   const [location, setLocation] = useState<Location.LocationObject | null>(
      null
    );
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
    async function getCurrentLocation() {
      if (Platform.OS === "android" && !Device.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
  
    const openMap = () => {
      getCurrentLocation();
  
       if (location) {
        const { latitude, longitude } = location.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        Linking.openURL(url);
      }
    };

  return (
    <View
      style={[
        wFull,
        h(144),
        py(17),
        px(9),
        flexCol,
        gap(10),
        bg("#FFF7E6"),
        mb(20),
      ]}
    >
      <View style={[wFull, h(45), flex, itemsCenter, justifyBetween, gap(14)]}>
        <View style={[flexCol, gap(12), itemsStart]}>
          <Text style={[colorBlack, fw700, fs14]}>
            Ride #{currentTrip?._id.slice(0, 10)}
          </Text>
          <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
            {currentTrip?.vehicleName}
          </Text>
        </View>

        <View
          style={[
            w("auto"),
            h(45),
            rounded(100),
            flex,
            itemsCenter,
            gap(16),
            bg(colors.white),
            p(16),
            { borderWidth: 0.7, borderColor: Colors.light.border },
          ]}
        >
          <Image
            style={[image.w(18), image.h(14.73)]}
            source={images.passengersImage}
          />
          <Text style={[fs12, fw500, colorBlack, tw `h-[20px]`]}>
            {currentTrip?.availableSeats} seats Available
          </Text>
        </View>
      </View>

      <View style={[wFull, h(45), flex, itemsCenter, justifyBetween, gap(49)]}>
        <View style={[h(18), flex, itemsCenter, gap(4)]}>
          <View style={[hFull, flex, itemsCenter, gap(12)]}>
            <Image
              style={[image.w(20), image.h(18)]}
              source={images.recentImage}
            />
            <Text
              style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}
            >
              ETA
            </Text>
          </View>

          <View style={[hFull, flex, itemsCenter, gap(12)]}>
            <View style={[w(5), h(5), rounded(5), bg(colors.black)]} />
            {/* <Text style={[colorBlack, fw500, fs14]}>{ride?.duration}</Text> */}
            <Text style={[colorBlack, fw500, fs14]}>{Utils.formatTime(currentTrip?.departureTime as string)}</Text>
          </View>
        </View>

        <View style={[flex, itemsCenter, gap(12)]}>
          <ScaleUpDown>
          <TouchableOpacity
            onPress={openMap}
            style={[
              w(45),
              h(45),
              rounded(45),
              // bg(Colors.light.background),
              flex,
              itemsCenter,
              justifyCenter,
              { borderWidth: 0.7, borderColor: Colors.light.border },
            ]}
          >
            (
            <Image
              style={[image.w(55), image.h(55)]}
              source={images.trackOngoing}
            />
            )
          </TouchableOpacity>
          </ScaleUpDown>

          <Text style={[c("#27AE65"), neurialGrotesk, fw700, fs14]}>
            Ongoing
          </Text>
        </View>
      </View>
    </View>
  );
}
