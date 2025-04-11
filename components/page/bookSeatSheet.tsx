import { image, mXAuto, wHFull } from "@/utils/imageStyles";
import {
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
  mt,
  pb,
  px,
  py,
  rounded,
  w,
  wFull,
} from "@/utils/styles";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import {
  c,
  colorBlack,
  colorBlueBg,
  colorWhite,
  fs12,
  fs14,
  fs16,
  fs18,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { images } from "@/constants/images";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import Colors, { colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { editTicketBusstops, setStateInputField } from "@/state/slices/ride";
import RideSelectors from "@/state/selectors/ride";
import { closeBottomSheet } from "@/state/slices/layout";
import CtaBtn from "../shared/ctaBtn";
import RideBlock from "./rideBlock";
import { IBusStop, IRide } from "@/state/types/ride";
import BuyTicketListTile from "./buyTicketListTile";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useEffect, useState } from "react";
import { Href, router } from "expo-router";
import { pages } from "@/constants/pages";
import { RootState } from "@/state/store";
import { ITicketInput } from "@/state/types/trip";
import { useFormik } from "formik";
import { ObjectSchema, string } from "yup";
import { setTripState } from "@/state/slices/trip";
import tw from "@/constants/tw";

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

function BookSeatSheet() {
  const dispatch = useAppDispatch();
  const { hideBottomSheet } = useBottomSheet();
  const {
    route,
    currentTrip,
    currentNumberOfTickets,
    pickupBusstopInput,
    dropoffBusstopInput,
    ticketsInputs,
  } = useAppSelector((state: RootState) => state.trip);

  const ticketQuantitySelectable = (ticketQuantity: number) => {
    const totalQuantitiesSelected = ticketsInputs?.reduce(
      (accumulator, ticket) => accumulator + Number(ticket?.quantity),
      0
    );
    const availableSeats = Number(currentTrip?.availableSeats);
    const aggregateSeatsLeft = availableSeats - totalQuantitiesSelected;

    return ticketQuantity <= aggregateSeatsLeft;
  };

  //   const selectNumberOfTickets = (ticketNumber: number) => {
  const selectTicketQuantity = (ticketQuantity: number) => {
    dispatch(
      setTripState({ key: "currentNumberOfTickets", value: ticketQuantity })
    );
  };

  const selectPickup = (busstop: IBusStop) => {
    dispatch(
      setTripState({
        key: "pickupBusstopInput",
        value: busstop,
      })
    );
  };

  const selectDropoff = (busstop: IBusStop) => {
    dispatch(
      setTripState({
        key: "dropoffBusstopInput",
        value: busstop,
      })
    );
  };

  const ticketAddable = () => {
    const totalQuantitiesSelected = ticketsInputs
      .reduce(
        (accumulator, ticket) => accumulator + Number(ticket?.quantity),
        0
      );
    const availableSeats = Number(currentTrip?.availableSeats);

    return totalQuantitiesSelected <= availableSeats;
  };

  const bookTicket = () => {
    if(!pickupBusstopInput || !dropoffBusstopInput || !ticketAddable()) return;
    // plan
    const unitFare = route?.unitFares?.find(
      (unitFare) =>
        String(unitFare?.pickupBusstopId) == String(pickupBusstopInput?._id) &&
        String(unitFare?.dropoffBusstopId) == String(dropoffBusstopInput?._id)
    );

    const matchPlan = unitFare?.plan;
    // plan

    // Ticket
    const newTicket = {
      number: ticketsInputs.length == 0 ? 1 : ticketsInputs?.[ticketsInputs.length - 1]?.number+1,
      dropoffBusstop: dropoffBusstopInput,
      pickupBusstop: pickupBusstopInput,
      quantity: currentNumberOfTickets,
      sameAsFirstTicket: ticketsInputs.length == 0,
      ticketStatus: "idle",
      unitFare,
      rideFee: matchPlan?.trip?.tripFee,
      serviceFee: matchPlan?.serviceFee,
    } as ITicketInput;

    const tickets = [...ticketsInputs, newTicket];

    dispatch(setTripState({ key: "ticketsInputs", value: tickets }));
    // Ticket

    hideBottomSheet();
  };

  return (
    <PaddedScreen>
      <View style={[flexCol, gap(16), mt(20)]}>
        <View style={[flexCol, gap(16), itemsCenter]}>
          <View
            style={[pb(16), flex, itemsStart, gap(16), mXAuto] as ViewStyle[]}
          >
            <Image style={[image.w(30), image.h(30)]} source={images.trip} />

            <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>
              Book Seat
            </Text>
          </View>

          <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>
            Input details to book seat on the ride
          </Text>
        </View>

        {/* Pick up block */}

        <View style={[wFull, h(52), flex, gap(10), itemsCenter]}>
          <TouchableOpacity>
            <Image
              style={[image.w(15), image.h(20)]}
              source={images.greenBgCoasterImage}
            />
          </TouchableOpacity>

          <Text
            style={
              [
                fs14,
                fw500,
                neurialGrotesk,
                h(20),
                {
                  color: Colors.light.textGrey,
                  borderColor: colors.transparent,
                  borderWidth: 0,
                  flex: 0.8,
                },
                tw``,
              ] as TextStyle[]
            }
          >
            {pickupBusstopInput?.name || "Your Pick up Bus Stop"}
          </Text>
        </View>

        <FlatList
          style={[wFull, h(46), flex, gap(16)]}
          horizontal
          data={route?.inTripDropoffs}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectPickup(item)}>
              <View
                style={[
                  w(98),
                  hFull,
                  rounded(100),
                  py(16),
                  px(32),
                  gap(10),
                  flex,
                  itemsCenter,
                  justifyCenter,
                  { borderWidth: 1, borderColor: Colors.light.border },
                ]}
              >
                <Text
                  style={
                    [
                      neurialGrotesk,
                      fw500,
                      fs12,
                      colorBlack,
                      h(20),
                    ] as TextStyle[]
                  }
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={[w(16), hFull, bg(colors.transparent)]} />
          )}
          keyExtractor={({ _id }) => String(_id)}
        />

        {/* Pick up block */}

        {/* Drop off block */}

        <View style={[wFull, h(52), flex, gap(10), itemsCenter]}>
          <TouchableOpacity>
            <Image
              style={[image.w(15), image.h(20)]}
              source={images.redBgCoasterImage}
            />
          </TouchableOpacity>

          <Text
            style={
              [
                fs14,
                fw500,
                neurialGrotesk,
                h(20),
                {
                  color: Colors.light.textGrey,
                  borderColor: colors.transparent,
                  borderWidth: 0,
                  flex: 0.8,
                },
                tw``,
              ] as TextStyle[]
            }
          >
            {dropoffBusstopInput?.name || "Your Dropoff Bus Stop"}
          </Text>
        </View>

        <FlatList
          style={[wFull, h(46), flex, gap(16)]}
          horizontal
          data={route?.inTripDropoffs}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectDropoff(item)}>
              <View
                style={[
                  w(98),
                  hFull,
                  rounded(100),
                  py(16),
                  px(32),
                  gap(10),
                  flex,
                  itemsCenter,
                  justifyCenter,
                  { borderWidth: 1, borderColor: Colors.light.border },
                ]}
              >
                <Text
                  style={
                    [
                      neurialGrotesk,
                      fw500,
                      fs12,
                      colorBlack,
                      h(20),
                    ] as TextStyle[]
                  }
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={[w(16), hFull, bg(colors.transparent)]} />
          )}
          keyExtractor={({ _id }) => String(_id)}
        />

        {/* Drop off block */}
      </View>

      <View
        style={[
          wFull,
          h(99),
          flexCol,
          gap(16),
          mt(30),
          { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 },
        ]}
      >
        <View style={[wFull, flex, itemsCenter, gap(12)]}>
          <Image
            style={[image.w(20), image.h(13)]}
            source={images.ticketImage}
          />

          <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>
            Tickets
          </Text>
        </View>

        {/* Tickets Tags */}
        <ScrollView>
          <View style={[wFull, flex, gap(16)]}>
            {/* 4 is the seats (total) and 3 is the available seats */}
            {Array.from({ length: 4 }).map((_, index) => (
              <View key={index}>
                {/* {index + 1 <= Number(currentTrip?.availableSeats) ? (<TouchableOpacity */}
                {ticketQuantitySelectable(index + 1) ? (
                  <TouchableOpacity
                    onPress={() => selectTicketQuantity(index + 1)}
                    style={[
                      sharedStyle,
                      currentNumberOfTickets === index + 1
                        ? selectedSeatStyle
                        : availableSeatStyle,
                    ]}
                  >
                    <Text
                      style={[
                        fw400,
                        fs14,
                        c(
                          `${
                            currentNumberOfTickets === index + 1
                              ? colors.white
                              : colors.black
                          }`
                        ),
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[sharedStyle, unavailableSeatStyle]}>
                    <Text
                      style={[
                        fw400,
                        fs14,
                        c(
                          `${
                            currentNumberOfTickets === index + 1
                              ? colors.white
                              : colors.black
                          }`
                        ),
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
        {/* Tickets Tags */}
      </View>

      <TouchableOpacity onPress={bookTicket}>
        <View
          style={[
            wFull,
            h(50),
            mt(32),
            rounded(10),
            flex,
            itemsCenter,
            justifyCenter,
            gap(10),
            bg(Colors.light.banner),
            {opacity: !pickupBusstopInput || !dropoffBusstopInput || !ticketAddable() ? 0.5: 1}
          ]}
        >
          <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>
            Book Ticket
          </Text>

          <Image
            style={[image.w(22), image.h(14)]}
            source={images.whiteBgTicketImage}
          />
        </View>
      </TouchableOpacity>
    </PaddedScreen>
  );
}

export default BookSeatSheet;
