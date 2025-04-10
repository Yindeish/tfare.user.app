import {
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Platform,
  ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import SafeScreen from "@/components/shared/safeScreen";
import { image, imgAbsolute, mYAuto, wHFull } from "@/utils/imageStyles";
import {
  absolute,
  b,
  bg,
  borderGrey,
  borderL,
  borderR,
  flex,
  flexCenter,
  flexCol,
  gap,
  h,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  l,
  maxh,
  mb,
  ml,
  mr,
  mt,
  my,
  p,
  pb,
  pl,
  px,
  py,
  relative,
  rounded,
  w,
  wFull,
  zIndex,
} from "@/utils/styles";
import Colors, { colors } from "@/constants/Colors";
import PaddedScreen from "@/components/shared/paddedScreen";
import { images } from "@/constants/images";
import {
  c,
  colorBlack,
  colorWhite,
  fs12,
  fs14,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { Href, router, useGlobalSearchParams, usePathname } from "expo-router";
import PageTitle from "@/components/shared/pageTitle";
import TripBlock from "@/components/shared/tripBlock";
import CtaBtn from "@/components/shared/ctaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useLocalSearchParams } from "expo-router";
import { pages } from "@/constants/pages";
import RideSelectors from "@/state/selectors/ride";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import {
  createTicket,
  setAllTicketsFilled,
  setCurrentNumberOfTickets,
} from "@/state/slices/ride";
import { indices } from "@/constants/zIndices";
import { Ionicons } from "@expo/vector-icons";
import BuyTicketListTile from "@/components/page/buyTicketListTile";
import { TripBookedSheet } from "@/components/page/bookTripSheetComponent";
import { RootState } from "@/state/store";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";
import usePreventGoBack from "@/hooks/usePreventGoBack";
import * as Location from "expo-location";
import { ITicketInput } from "@/state/types/trip";
import { setTripState } from "@/state/slices/trip";
import * as Device from "expo-device";
import { openURL } from "expo-linking";
import { RideBookedSheet } from "@/components/page/bookRideSheetComponent";
import {
  TripCompletedSheet,
  TripStartedSheet,
} from "@/components/page/tripStartedBottomSheetComponents";
import Spinner from "@/components/shared/spinner";
import tw from "@/constants/tw";
import Ticket from "@/components/tab/trip/ticket";
import BookSeatSheet from "@/components/page/bookSeatSheet";
import PaymentOptions from "@/components/tab/trip/paymentOptions";

const {
  sharedStyle,
  availableSeatStyle,
  selectedSeatStyle,
  unavailableSeatStyle,
} = StyleSheet.create({
  sharedStyle: {
    ...w(45),
    ...h(45),
    ...rounded(100),
    ...flex,
    ...itemsCenter,
    ...justifyCenter,
    borderWidth: 0.7,
    borderColor: Colors.light.border,
  },
  availableSeatStyle: {
    ...bg("#F9F7F8"),
  },
  unavailableSeatStyle: {
    ...bg(Colors.light.border),
  },
  selectedSeatStyle: {
    ...bg(Colors.light.background),
  },
});

function BookTrip() {
  const { rideId, currentTripId, requestId } = useGlobalSearchParams();
  const dispatch = useAppDispatch();
  const {
    riderRideDetails: riderRide,
    ridePlans,
    route,
    ticketsInputs,
    currentTrip,
    allTicketsFilled,
    currentNumberOfTickets,
    paymentOptionInput,
  } = useAppSelector((state: RootState) => state.trip);
  const path = usePathname();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);

  usePreventGoBack(Number(ticketsInputs?.length) > 1);

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
    rides: [],
  });
  const { code, msg, loading, rides } = fetchState;

  const [tripCost, setTripCost] = useState(ticketsInputs[0]?.rideFee || 0);
  const serviceFee = Number(ticketsInputs[0]?.serviceFee);
  const [totalCost, setTotalCost] = useState(Number(tripCost) + serviceFee);

  const ticketAddable = () => {
    const totalQuantitiesSelected = ticketsInputs
      // .filter((ticket) => ticket?.ticketStatus !== "accepted")
      .reduce(
        (accumulator, ticket) => accumulator + Number(ticket?.quantity),
        0
      );
    const availableSeats = Number(currentTrip?.availableSeats);

    return totalQuantitiesSelected < availableSeats;
  };

  //   Automatic book sheet popup
  useEffect(() => {
    if (ticketsInputs.length == 0) {
        showBottomSheet([300, 700], <BookSeatSheet />)
    }
  }, []);
  //   Automatic book sheet popup

  //   Updating Trip cost, Total cost, and ServiceFee
  useEffect(() => {
    const validTickets = ticketsInputs?.filter(
      (ticket) =>
        ticket?.ticketStatus !== "declined" &&
        ticket?.ticketStatus !== "pending"
    );

    const newTripCost = validTickets?.reduce(
      (prev, current) => prev + Number(current?.rideFee),
      0
    );

    setTripCost(newTripCost);
    setTotalCost(newTripCost + serviceFee);
  }, [ticketsInputs]);
  //   Updating Trip cost, Total cost, and ServiceFee

  //   Updating route with respect to the Current trip
  useEffect(() => {
    currentTrip?.route &&
      dispatch(setTripState({ key: "route", value: currentTrip?.route }));
  }, [route, currentTrip]);
  //   Updating route with respect to the Current trip

  // Updating buy Ticket btn with allTicketsFilled
  useEffect(() => {
    dispatch(
      setTripState({
        key: "booking",
        value:
          allTicketsFilled && path === ("/(tripScreens)/bookTrip" as Href)
            ? true
            : false,
      })
    );
  }, [allTicketsFilled, path]);
  // Updating buy Ticket btn with allTicketsFilled

  useEffect(() => {
    if (Number(ticketsInputs?.length) > 0) {
      const allTciketsFilled = ticketsInputs?.every(
        (ticket) => ticket.dropoffBusstop && ticket.dropoffBusstop
      );
      if (allTciketsFilled) {
        dispatch(setAllTicketsFilled(true));
        dispatch(setTripState({ key: "booking", value: true }));
      } else {
        dispatch(setAllTicketsFilled(false));
        dispatch(setTripState({ key: "booking", value: false }));
      }
    }
  }, [ticketsInputs]);
  // check if all tickets have been filled

  // !BottomSheets
  useEffect(() => {
    if (query === RideConstants.query.RideBooked)
      showBottomSheet(
        [100, 800],
        <RideBookedSheet rideId={riderRide?._id as string} />,
        true
      );
    if (query === RideConstants.query.RideStarted)
      showBottomSheet([100, 500], <TripStartedSheet />, true);
    if (query === RideConstants.query.RideEnded)
      showBottomSheet([100, 650], <TripCompletedSheet />, true);
    if (query === RideConstants.query.RideDeclined)
      showBottomSheet(
        [300],
        <View>
          <Text>Trip Declined</Text>
        </View>,
        true
      );
  }, [query]);
  // !BottomSheets

  useEffect(() => {console.log({ticketsInputs})}, [ticketsInputs])

  return (
    <SafeScreen>
      <ScrollView
        style={[wHFull, relative, { overflow: "scroll" }] as ViewStyle[]}
      >
        {/* //!Trip Block */}
        <TripBlock />
        {/* //!Trip Block */}

        <View
          style={[wHFull, flexCol, gap(32), mb(150)] as ViewStyle[]}
        >
          <PaddedScreen>
            {/* Ticket */}
            <FlatList
              horizontal={false}
              data={ticketsInputs}
              renderItem={({ index, item: ticketId }) => (
                <Ticket ticket={ticketId} index={index} key={index} />
              )}
            />
            {/* Ticket */}

            {/* Add another ticket btn */}

            {/* 5 is the seats (total) and 3 is the available seats */}
            {
              // currentNumberOfTickets <
              //   Number(currentTrip?.availableSeats)
              ticketAddable() && (
                <TouchableOpacity
                  onPress={() =>
                    showBottomSheet([300, 700], <BookSeatSheet />)
                  }
                >
                  <View
                    style={[
                      w("50%"),
                      h(50),
                      mt(32),
                      rounded(100),
                      flex,
                      itemsCenter,
                      justifyCenter,
                      gap(10),
                      bg(Colors.light.background),
                    ]}
                  >
                    <Image
                      style={[image.w(20), image.h(20)]}
                      source={images.waitChairImage}
                    />

                    <Text style={[neurialGrotesk, fw500, fs12, colorWhite]}>
                      {ticketsInputs.length == 0 ? 'Add a ticket': 'Add another ticket'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            }

            {/* Add another ticket btn */}

            {/* Shows when all the tickets have been filled (counter fare are optional) */}

            {/* Shows when buy ticket cta btn is clicked */}

            {/* Payment options */}

            {allTicketsFilled && <PaymentOptions />}

            {/* Payment options */}

            {/* Loading Spinner */}
            <Spinner visible={loading} />
            {/* Loading Spinner */}
          </PaddedScreen>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default BookTrip;
