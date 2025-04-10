import BuyTicketListTile from "@/components/page/buyTicketListTile";
import Colors from "@/constants/Colors";
import tw from "@/constants/tw";
import { useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import {
  c,
  colorBlack,
  fs14,
  fw400,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import {
  flex,
  flexCol,
  gap,
  itemsCenter,
  justifyBetween,
  mb,
  mt,
  pb,
  wFull,
} from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";

const PaymentOptions = () => {
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

  const [tripCost, setTripCost] = useState(ticketsInputs[0]?.rideFee || 0);
  const serviceFee = Number(ticketsInputs[0]?.serviceFee);
  const [totalCost, setTotalCost] = useState(Number(tripCost) + serviceFee);

  // Updating Trip cost, total cost and service fee
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
  // Updating Trip cost, total cost and service fee

  return (
    <View style={[wFull, flexCol, gap(16), mt(32), mb(100)]}>
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
        <TouchableOpacity
          onPress={() => router.push("/(tripScreen)/paymentOption" as Href)}
          style={[wFull, flex, justifyBetween, itemsCenter]}
        >
          <Text style={[neurialGrotesk, fs14, fw700, colorBlack]}>
            Pay with
          </Text>

          <View style={[flex, gap(16), itemsCenter]}>
            <Text style={[fw400, fs14, colorBlack, tw`capitalize`]}>
              {paymentOptionInput}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.light.textGrey}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[wFull, flex, justifyBetween, itemsCenter]}>
          <Text style={[neurialGrotesk, fs14, fw700, c(Colors.light.border)]}>
            Offers
          </Text>

          <View style={[flex, gap(16), itemsCenter]}>
            <Text style={[neurialGrotesk, fw400, fs14, c(Colors.light.border)]}>
              Unavailable
            </Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.light.border}
            />
          </View>
        </TouchableOpacity>
      </View>

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
            text: currentTrip?._id as string,
          }}
        />
        <BuyTicketListTile
          leadingText="Trip Cost"
          trailing={{
            // text: `₦ ${ridePlans[0]?.ride?.rideFee || ridePlans[0]?.plan?.ride?.rideFee || ''}`,
            text: `₦ ${tripCost || ""}`,
          }}
        />
        <BuyTicketListTile
          leadingText="Service Fee"
          trailing={{
            text: `₦ ${serviceFee || ""}`,
          }}
        />
      </View>

      <BuyTicketListTile
        leadingText="Total"
        trailing={{
          // text: `₦ ${Number(ridePlans[0]?.plan?.ride?.rideFee || ridePlans[0]?.ride?.rideFee) + Number(ridePlans?.[0]?.plan?.serviceFee) || ''}`,
          text: `₦ ${totalCost || ""}`,
        }}
      />
    </View>
  );
};

export default PaymentOptions;
