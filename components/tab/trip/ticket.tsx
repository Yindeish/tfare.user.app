import {
  Image,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
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
  justifyStart,
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
} from "@/utils/styles";
import Colors, { colors } from "@/constants/Colors";
import {
  c,
  colorBlack,
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
import { image } from "@/utils/imageStyles";
import { images } from "@/constants/images";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import Checkbox from "expo-checkbox";
import {
  closeModal,
  openBottomSheet,
  openModal,
  setBottomSheetSnapPoint,
  setBottomSheetType,
} from "@/state/slices/layout";
import {
  IBusStop,
  IPlan,
  IRiderRideDetails,
  ITicketInput,
  TRideStatus,
} from "@/state/types/ride";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import FetchService from "@/services/api/fetch.service";
import { RootState } from "@/state/store";
import tw from "@/constants/tw";
import { RideConstants } from "@/constants/ride";
import { supabase } from "@/supabase/supabase.config";
import { usePathname } from "expo-router";
import { useStorageState } from "@/hooks/useStorageState";
import { setTripState } from "@/state/slices/trip";
import BookSeatSheet from "@/components/page/bookSeatSheet";

function Ticket({ index, ticket }: { index: number; ticket: ITicketInput }) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: RootState) => state.user);
  const { showBottomSheet } = useBottomSheet();

  const { currentTrip, route, riderRideDetails, ticketsInputs } =
    useAppSelector((state: RootState) => state.trip);
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);

  const path = usePathname();

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, loading, msg } = fetchState;

  const channel = supabase.channel(
    `${RideConstants.channel.ride_accepting}${ticket?.rideId}`
  );

  channel
    .on(
      "broadcast",
      { event: RideConstants.event.ride_accepted },
      (payload) => {
        console.log("====================================");
        console.log("accepting......");
        console.log("====================================");
        if (path == "/bookTrip") {
          const ride = payload?.payload?.trip as IRiderRideDetails;
          console.log("====================================");
          console.log("accepting......", ride, {
            ride,
          });
          console.log("====================================");
          const tickets = ticketsInputs.map((ticketItem) => {
            if (
              String(ride?._id) == String(ticketItem?.rideId)
              // Number(ticketItem?.number) == Number(ticket?.number) &&
              // ticket?.ticketStatus === "pending"
            ) {
              return {
                ...ticketItem,
                ticketStatus: "accepted",
                rideFee: ticket?.userCounterFare
                  ? Number(ticket?.userCounterFare)
                  : ticket?.rideFee,
              };
            } else return ticketItem;
          });

          dispatch(setTripState({ key: "ticketsInputs", value: tickets }));
        }
      }
    )
    .subscribe();

  const decline_channel = supabase.channel(
    `${RideConstants.channel.ride_declining}${ticket?.rideId}`
  );

  decline_channel
    .on(
      "broadcast",
      { event: RideConstants.event.ride_declined },
      (payload) => {
        if (path == "/bookTrip") {
          const ride = payload?.payload?.trip as IRiderRideDetails;
          console.log("====================================");
          console.log("declining......", ride, {
            ride,
          });
          console.log("====================================");

          const tickets = ticketsInputs.map((ticketItem) => {
            if (
              // Number(ticketItem?.number) == Number(ticket?.number) &&
              // ticket?.ticketStatus == "pending"
              String(ride?._id) == String(ticketItem?.rideId)
            ) {
              return {
                ...ticketItem,
                ticketStatus: "declined",
              };
            } else return ticketItem;
          });

          dispatch(setTripState({ key: "ticketsInputs", value: tickets }));
        }
      }
    )
    .subscribe();

  useEffect(() => {
    // Subscribe to channels when component mounts

    return () => {
      // Unsubscribe when component unmounts
      channel.unsubscribe();
      decline_channel.unsubscribe();
    };
  }, []);

  const negotiateTicketFare = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));

    const returnedData = await FetchService.postWithBearerToken({
      url: `/user/rider/me/trip/${currentTrip?._id}/negotiate-fare`,
      data: {
        pickupBusstopId: ticket?.pickupBusstop?._id,
        dropoffBusstopId: ticket?.dropoffBusstop?._id,
        userCounterOffer: ticket?.userCounterFare,
        requestId: ticket?.rideId
      },
      token: token as string,
    });

    const code = returnedData?.code;
    const msg = returnedData?.msg;
    console.log({returnedData})
    const userTripSaved = returnedData?.riderTrip;

    setFetchState((prev) => ({
      ...prev,
      loading: false,
      msg,
      code,
    }));

    if (code == 201 || code == 200) {
      const tickets = ticketsInputs.map((ticketItem) => {
        if (Number(ticketItem?.number) == Number(ticket?.number)) {
          return {
            ...ticketItem,
            ticketStatus: "pending",
            rideId: !ticket?.rideId && userTripSaved?._id,
          };
        } else return ticketItem;
      });

      dispatch(setTripState({ key: "ticketsInputs", value: tickets }));
      dispatch(setTripState({ key: "currentTicket", value: ticket }));
      dispatch(setTripState({ key: "riderRideDetails", value: userTripSaved }));
    }
  };


  // ?????????????????//************************ R E N D E R I N G */
  // ?????????????????//************************ R E N D E R I N G */

  return (
    <View style={[wFull, flexCol, gap(32), itemsStart, mt(40)]}>
      {/* Ticket Ticket */}
      <View style={[flex, flexCol, gap(2)]}>
        <Text style={[colorBlack, fw700, fs14]}>
          {`Ticket ${ticket?.number} (${ticket?.quantity} ${
            Number(ticket?.quantity) > 1 ? "quantities" : "quantity"
          })`}{" "}
        </Text>

       {ticket?.number > 1 && <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
          (You have selected more than 1 seat)
        </Text>}
      </View>
      {/* Ticket Ticket */}

      {/* Bus Stop Inputs */}

      {ticket.dropoffBusstop && ticket.pickupBusstop && (
        <>
          {/* Pick up block */}

          <View
            style={[
              wFull,
              flexCol,
              gap(16),
              {
                borderBottomWidth: 0.7,
                borderBottomColor: Colors.light.border,
              },
            ]}
          >
            <View style={[flexCol, gap(15)]}>
              <View style={[flex, gap(12), itemsCenter]}>
                <Image
                  source={images.greenBgCoasterImage}
                  style={[image.w(20), image.h(20)]}
                />

                <Text
                  style={[
                    c(Colors.light.textGrey),
                    neurialGrotesk,
                    fw400,
                    fs12,
                  ]}
                >
                  Pick up Bus Stop
                </Text>
              </View>

              <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>
                {ticket.pickupBusstop.name}
              </Text>
            </View>
          </View>

          {/* Pick up block */}
          {/* Drop off block */}

          <View
            style={[
              wFull,
              flex,
              justifyBetween,
              pr(16),
              {
                borderBottomWidth: 0.7,
                borderBottomColor: Colors.light.border,
              },
            ]}
          >
            <View style={[flexCol, gap(15)]}>
              <View style={[flex, gap(12), itemsCenter]}>
                <Image
                  source={images.redBgCoasterImage}
                  style={[image.w(20), image.h(20)]}
                />

                <Text
                  style={[
                    c(Colors.light.textGrey),
                    neurialGrotesk,
                    fw400,
                    fs12,
                  ]}
                >
                  Drop off Bus Stop
                </Text>
              </View>

              {/* <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.dropoffBusstop.routeName}</Text> */}
              <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>
                {ticket.dropoffBusstop.name}
              </Text>
            </View>

            <View style={[flexCol, gap(16), justifyStart]}>
              <View style={[flex, itemsCenter, gap(8)]}>
                <Image
                  style={[image.w(14), image.h(11)]}
                  source={images.rideOfferImage}
                />
                <Text
                  style={[
                    c(Colors.light.textGrey),
                    neurialGrotesk,
                    fw400,
                    fs12,
                  ]}
                >
                  Ticket fee
                </Text>
              </View>

              <Text style={[colorBlack, fw700, fs14]}>₦ {ticket?.rideFee}</Text>
            </View>
          </View>

          {/* Drop off block */}

          {/* Counter fare block */}

          <View
            style={[
              wFull,
              flexCol,
              gap(16),
              pb(16),
              {
                borderBottomWidth: 0.7,
                borderBottomColor: Colors.light.border,
              },
            ]}
          >
            <Text
              style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}
            >
              Want to send a counter offer?{" "}
            </Text>

            <View style={[wFull, flex, justifyBetween]}>
              {/* Counterfare Input Block */}
              <View
                style={[
                  flex,
                  gap(16),
                  itemsCenter,
                  justifyStart,
                  w("57%"),
                  h(50),
                  pl(16),
                  rounded(10),
                  bg(colors.white),
                  { borderWidth: 0.7, borderColor: Colors.light.border },
                ]}
              >
                <Image
                  style={[image.w(14), image.h(10)]}
                  source={images.rideOfferImage}
                />

                <View style={[flex, itemsCenter]}>
                  <Text style={[c(Colors.light.textGrey), fs14, fw500]}>₦</Text>
                  <TextInput
                    onFocus={() => {
                      dispatch(
                        setTripState({
                          key: "currentTicket",
                          value: ticket,
                        })
                      );
                      if (ticket?.ticketStatus === "declined") {
                        const tickets = ticketsInputs?.map((ticketDetails) => {
                          if (
                            Number(ticketDetails?.number) ==
                              Number(ticket?.number) &&
                            ticketDetails?.ticketStatus == "declined"
                          ) {
                            return {
                              ...ticketDetails,
                              ticketStatus: "idle",
                            };
                          } else return ticketDetails;
                        });

                        dispatch(
                          setTripState({
                            key: "ticketsInputs",
                            value: tickets,
                          })
                        );
                      }
                    }}
                    onChangeText={
                      ticket?.ticketStatus === "accepted" ||
                      ticket?.ticketStatus === "pending"
                        ? () => {}
                        : (text) => {
                            if (
                              ticket?.ticketStatus === "accepted" ||
                              ticket?.ticketStatus === "pending"
                            )
                              return;
                            if (ticket?.ticketStatus === "declined") {
                              const tickets = ticketsInputs?.map(
                                (ticketDetails) => {
                                  if (
                                    Number(ticketDetails?.number) ==
                                      Number(ticket?.number) &&
                                    ticketDetails?.ticketStatus == "declined"
                                  ) {
                                    return {
                                      ...ticketDetails,
                                      ticketStatus: "idle",
                                    };
                                  } else return ticketDetails;
                                }
                              );

                              dispatch(
                                setTripState({
                                  key: "ticketsInputs",
                                  value: tickets,
                                })
                              );
                            }

                            const tickets = ticketsInputs?.map((ticketItem) => {
                              if (
                                Number(ticket?.number) ==
                                Number(ticketItem?.number)
                              ) {
                                return {
                                  ...ticketItem,
                                  userCounterFare: text,
                                };
                              } else return ticketItem;
                            });

                            dispatch(
                              setTripState({
                                key: "ticketsInputs",
                                value: tickets,
                              })
                            );
                          }
                    }
                    value={
                      ticket?.userCounterFare
                        ? String(ticket.userCounterFare)
                        : ""
                    }
                    placeholder={"Negotiate fare"}
                    style={[
                      py(16) as TextStyle,
                      pr(10) as TextStyle,
                      ,
                      bg(colors.transparent) as TextStyle,
                      c(Colors.light.textGrey),
                      fs14,
                      fw500,
                      h(50) as TextStyle,
                      {
                        borderWidth: 0,
                        borderColor: colors.transparent,
                        flex: 0.9,
                      },
                    ]}
                    cursorColor={Colors.light.background}
                    selectionColor={colors.transparent}
                    keyboardType={"numeric"}
                    underlineColorAndroid={colors.transparent}
                    placeholderTextColor={Colors.light.textGrey}
                  />
                </View>
              </View>
              {/* Counterfare Input Block */}

              {/* Counter Fare Request Btn */}
              <View style={tw`w-[40%]`}>
                {ticket.ticketStatus === "idle" ? (
                  <TouchableOpacity
                    onPress={() => negotiateTicketFare()}
                    style={[
                      flex,
                      gap(16),
                      itemsCenter,
                      justifyCenter,
                      w("100%"),
                      h(50),
                      pl(loading ? 7 : 16),
                      rounded(10),
                      bg(Colors.light.banner),
                      {
                        borderWidth: 0.7,
                        borderColor: Colors.light.banner,
                      },
                    ]}
                  >
                    {loading && (
                      <ActivityIndicator
                        color={colors.white}
                        style={tw`w-[20px] h-[20px]`}
                      />
                    )}
                    <Text style={[neurialGrotesk, fw700, fs16, colorWhite]}>
                      Request
                    </Text>
                  </TouchableOpacity>
                ) : ticket.ticketStatus === ("accepted" as any) ? (
                  <View
                    style={[
                      flex,
                      gap(16),
                      itemsCenter,
                      justifyCenter,
                      w("100%"),
                      h(50),
                      pl(16),
                      rounded(10),
                      bg(colors.white),
                      { borderWidth: 0.7, borderColor: "#27AE65" },
                    ]}
                  >
                    <Text style={[neurialGrotesk, fw700, fs16, c("#27AE65")]}>
                      Accepted
                    </Text>
                  </View>
                ) : ticket?.ticketStatus === "declined" ? (
                  <View
                    style={[
                      flex,
                      gap(16),
                      itemsCenter,
                      justifyCenter,
                      w("100%"),
                      h(50),
                      pl(16),
                      rounded(10),
                      bg(colors.white),
                      { borderWidth: 0.7, borderColor: colors.red600 },
                    ]}
                  >
                    <Text
                      style={[neurialGrotesk, fw700, fs16, c(colors.red600)]}
                    >
                      Declined
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      flex,
                      gap(16),
                      itemsCenter,
                      justifyCenter,
                      w("100%"),
                      h(50),
                      pl(16),
                      rounded(10),
                      bg(colors.white),
                      {
                        borderWidth: 0.7,
                        borderColor: Colors.light.banner,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        neurialGrotesk,
                        fw700,
                        fs16,
                        c(Colors.light.banner),
                      ]}
                    >
                      Pending
                    </Text>
                  </View>
                )}
              </View>
              {/* Counter Fare Request Btn */}
            </View>

            {code == 400 && !loading && (
              <View style={[wFull, flex, itemsCenter, justifyStart, gap(12)]}>
                <Image
                  style={[image.w(20), image.h(21), { objectFit: "contain" }]}
                  source={images.cautionImage}
                />

                <Text style={[fw400, fs12, c(Colors.light.error)]}>
                  {msg}
                  {/* Offer too low to work with */}
                </Text>
              </View>
            )}
          </View>

          {/* Counter fare block */}
        </>
      )}

      {/* Bus Stop Inputs */}
    </View>
  );
}

export default Ticket;
