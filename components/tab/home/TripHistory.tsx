import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import PaddedScreen from "@/components/shared/paddedScreen";
import { fonts } from "@/constants/fonts";
import Colors, { colors } from "@/constants/Colors";
import {
  flex,
  flexCol,
  gap,
  hFull,
  itemsCenter,
  itemsEnd,
  itemsStart,
  justifyBetween,
  wFull,
} from "@/utils/styles";
import {
  c,
  colorBlack,
  colorTextGrey,
  fs12,
  fs14,
  fs16,
  fw400,
  fw600,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { images } from "@/constants/images";
import { image } from "@/utils/imageStyles";
import { router } from "expo-router";
import { pages } from "@/constants/pages";
import {
  ICurrentRide,
  IRiderRideDetails,
  IRoute,
  ITicket,
  ITicketInput,
  TRideStatus,
} from "@/state/types/ride";
import { Utils } from "@/utils";
import { getItemAsync } from "expo-secure-store";
import FetchService from "@/services/api/fetch.service";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";
import { TripStartedSheet } from "@/components/page/tripStartedBottomSheetComponents";
import { RideBookedSheet } from "@/components/page/bookRideSheetComponent";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { createTicket, setState, setStateInputField } from "@/state/slices/ride";
import { IUser } from "@/state/types/user";
import { RootState } from "@/state/store";

export default function TripHistory({
  refreshCondition = [],
}: {
  refreshCondition?: any[];
}) {
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  const { showBottomSheet } = useBottomSheet();
  const dispatch = useAppDispatch();
  const {stateInput:{ticketsDetails}} = useAppSelector((state: RootState) => state.ride);

  const [fetchState, setFetchState] = useState<{
    loading: boolean;
    msg: string;
    code: number | null;
    history: (IRiderRideDetails & {
      currentRide: ICurrentRide;
      driver: IUser;
      route: IRoute;
    })[];
  }>({
    loading: false,
    msg: "",
    code: null,
    history: [],
  });
  const { loading, history, code, msg } = fetchState;

  const getHistory = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));
    const returnedData = await FetchService.getWithBearerToken({
      url: `/user/rider/me/ride/ride-history`,
      token: (await getItemAsync("token")) as string,
    });

    const rideHistory = returnedData?.rideHistory;
    const lastRides = returnedData?.lastRides;
    const paidTicket = returnedData?.paidTicket as ITicket[] | ITicket;

    setFetchState((prev) => ({...prev, loading: false, history: rideHistory}))

    const createTicket = (rideHist: IRiderRideDetails, ticketOtp?: number, index?: number) => ({
      number: index !== undefined ? index + 1 : 1,
      pickupBusstop: rideHist?.pickupBusstop,
      dropoffBusstop: rideHist?.dropoffBusstop,
      id: String(index ?? 0),
      sameAsFirstTicket: false,
      userCounterFare: rideHist?.riderCounterOffer,
      rideFee: Number(rideHist?.ridePlan?.ride?.rideFee),
      serviceFee: Number(rideHist?.ridePlan?.serviceFee),
      ticketStatus: "accepted",
      rideId: rideHist?._id,
      ticketOtp: ticketOtp ?? (paidTicket as ITicket)?.ticketOtp
    });

    setFetchState((prev) => ({
      ...prev,
      loading: false,
      history: rideHistory
    }));

    dispatch(setState({ key: "lastRides", value: lastRides }));

    const sameTickets = !(Array.isArray(paidTicket));

    if (sameTickets) {
      const tickets = rideHistory
        ?.filter((rideHist: IRiderRideDetails) => rideHist?.rideStatus === "booked")
        ?.map((rideHist: IRiderRideDetails, index: number) => createTicket(rideHist, paidTicket?.ticketOtp, index));
    
      dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));
    } else {
      // const historyWithOtps = rideHistory?.flatMap((rideHist: IRiderRideDetails) => {
      //   if (rideHist.rideStatus === "booked") {
      //     const matchingTickets = (Array.isArray(paidTicket) ? paidTicket : [paidTicket])?.filter(
      //       (paidTick) => String(paidTick?.ride?.riderRideDetailsId) === String(rideHist._id)
      //     );
    
      //     return matchingTickets.length > 0
      //       ? matchingTickets.map((paidTick) => ({ ...rideHist, ticketOtp: paidTick.ticketOtp }))
      //       : rideHist;
      //   }
      //   return rideHist;
      // });
    
      // const tickets = historyWithOtps?.map((rideItem: IRiderRideDetails & {ticketOtp:number}, index: number) => 
      //   createTicket(rideItem as IRiderRideDetails & { ticketOtp: number }, rideItem.ticketOtp, index)
      // );
    
      const tickets = paidTicket
      ?.filter((ticketItem) => {
        const riderRide = (rideHistory as IRiderRideDetails[])?.find((ride) => String(ride?._id) == String(ticketItem?.ride?.riderRideDetailsId) && ride?.rideStatus == 'booked');
        return riderRide;
      })
      ?.map((ticketItem, index) => {
        const riderRide = (rideHistory as IRiderRideDetails[])?.find((ride) => String(ride?._id) == String(ticketItem?.ride?.riderRideDetailsId) && ride?.rideStatus == 'booked') as IRiderRideDetails;

        const newTicket = createTicket(riderRide, ticketItem?.ticketOtp, index);

        return newTicket;
      })

      dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  useEffect(() => {
    getHistory();
  }, [...(refreshCondition as any[])]);

  return (
    <PaddedScreen styles={{ marginTop: 12, height: "auto" }}>
      <View style={[flexCol, { gap: 32 }]}>
        <View style={[wFull, flex, itemsCenter, justifyBetween]}>
          <Text style={[colorBlack, neurialGrotesk, fw700, fs16]}>
            Trip History
          </Text>

          <TouchableOpacity
            onPress={() => {
              router.push("/(rideScreens)/tripHistory");
            }}
            style={[flex, itemsCenter, gap(4)]}
          >
            <Text
              style={[neurialGrotesk, c(Colors.light.textGrey), fw600, fs14]}
            >
              See all
            </Text>

            <Image
              source={images.expandImage}
              style={[image.w(20), image.h(20)]}
            />
          </TouchableOpacity>
        </View>

        {!loading ? (
          <View
            style={[flexCol, { gap: 32, height: (history?.length || 0) * 100 }]}
          >
            {history?.map((item, index) => (
              <View key={index}>
                {item?.rideStatus === "started" ||
                item?.rideStatus === "paused" ||
                item?.rideStatus === "accepted" ||
                item?.rideStatus === "booked" ||
                item?.rideStatus === "requesting" ? (
                  <TouchableOpacity
                    onPress={() => {
                      const currentRide = item?.currentRide;
                      const driver = item?.driver;
                      const route = item?.route;

                      dispatch(
                        setState({ key: "riderRideDetails", value: item })
                      );
                      dispatch(
                        setState({
                          key: "selectedAvailableRide",
                          value: currentRide,
                        })
                      );
                      dispatch(
                        setState({
                          key: "currentRoute",
                          value: route,
                        })
                      );
                      dispatch(
                        setState({ key: "driverDetails", value: driver })
                      );

                      if (
                        item?.rideStatus === "started" ||
                        item?.rideStatus === "paused"
                      ) {
                        router.push("/(rideScreens)/rideMap");
                        dispatch(
                          setState({ key: "riderRideDetails", value: item })
                        );
                        setQuery(RideConstants.query.RideStarted);
                        showBottomSheet([100, 500], <TripStartedSheet />, true);
                      }
                      if (item?.rideStatus === "booked") {
                        router.push("/(rideScreens)/rideMap");

                        setQuery(RideConstants.query.RideBooked);
                        showBottomSheet(
                          [100, 800],
                          <RideBookedSheet
                            rideId={item?.currentRideId as string}
                          />,
                          true
                        );
                      }
                      if (item?.rideStatus === "accepted") {
                        const newTicket = {
                          number: index + 1,
                          pickupBusstop: item?.pickupBusstop,
                          dropoffBusstop: item?.dropoffBusstop,
                          id: String(index ?? 0),
                          sameAsFirstTicket: false,
                          userCounterFare: item?.riderCounterOffer,
                          rideFee: Number(item?.ridePlan?.ride?.rideFee),
                          serviceFee: Number(item?.ridePlan?.serviceFee),
                          ticketStatus: "accepted",
                          rideId: item?._id,
                        }

                        dispatch(setStateInputField({key: 'ticketsDetails', value: [newTicket]}))
                        
                        router.push("/(rideScreens)/bookRide");
                      }
                      if (item?.rideStatus === "requesting") {
                        router.push("/(rideScreens)/availableRides");
                      }
                    }}
                    style={[
                      flex,
                      wFull,
                      itemsStart,
                      justifyBetween,
                      {
                        paddingRight: 16,
                        paddingBottom: 16,
                        height: 59,
                        borderBottomWidth: 0.7,
                        borderBottomColor: Colors.light.border,
                      },
                    ]}
                  >
                    <View style={[flexCol, itemsStart, justifyBetween, hFull]}>
                      <Text style={[fw700, fs14, colorBlack]}>
                        {item?.dropoffBusstop?.name}
                      </Text>
                      <Text
                        style={[colorTextGrey, fs12, fw400]}
                      >{`${Utils.formatTime(
                        item?.createdAt
                      )} - ${Utils.formatDate(item?.updatedAt)}`}</Text>
                    </View>

                    <View style={[flexCol, itemsEnd, justifyBetween, hFull]}>
                      <Text
                        style={[
                          fw400,
                          fs14,
                          {
                            color:
                              item?.rideStatus == ("ended" as TRideStatus)
                                ? "#27AE65"
                                : item?.rideStatus == "accepted" ||
                                  item?.rideStatus == "booked" ||
                                  item?.rideStatus == "started"
                                ? "orange"
                                : "red",
                          },
                        ]}
                      >{`₦ ${
                        Number((item?.ridePlan as any)?.serviceFee) +
                        Number(item?.riderCounterOffer)
                      }`}</Text>
                      <Text
                        style={[colorTextGrey, fw400, fs12]}
                      >{`# ${item?._id}`}</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={[
                      flex,
                      wFull,
                      itemsStart,
                      justifyBetween,
                      {
                        paddingRight: 16,
                        paddingBottom: 16,
                        height: 59,
                        borderBottomWidth: 0.7,
                        borderBottomColor: Colors.light.border,
                      },
                    ]}
                  >
                    <View style={[flexCol, itemsStart, justifyBetween, hFull]}>
                      <Text style={[fw700, fs14, colorBlack]}>
                        {item?.dropoffBusstop?.name}
                      </Text>
                      <Text
                        style={[colorTextGrey, fs12, fw400]}
                      >{`${Utils.formatTime(
                        item?.createdAt
                      )} - ${Utils.formatDate(item?.updatedAt)}`}</Text>
                    </View>

                    <View style={[flexCol, itemsEnd, justifyBetween, hFull]}>
                      <Text style={[fw400, fs14, { color: "#27AE65" }]}>{`₦ ${
                        Number((item?.ridePlan as any)?.serviceFee) +
                        Number(item?.riderCounterOffer)
                      }`}</Text>
                      <Text
                        style={[colorTextGrey, fw400, fs12]}
                      >{`# ${item?._id}`}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </PaddedScreen>
  );
}
