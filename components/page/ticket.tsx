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
import RideSelectors from "@/state/selectors/ride";
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
  IRiderRideDetails,
  ITicketInput,
  TRideStatus,
} from "@/state/types/ride";
import {
  editTicketCounterFare,
  setCurrentTicket,
  setState,
  setStateInputField,
  toggleTicketAsFirstTicket,
} from "@/state/slices/ride";
import CounterFareCtaBtn from "./counterFareCtaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { TicketDetailsSheet } from "./bookRideSheetComponent";
import FetchService from "@/services/api/fetch.service";
import { RootState } from "@/state/store";
import tw from "@/constants/tw";
import { RideConstants } from "@/constants/ride";
import { supabase } from "@/supabase/supabase.config";
import { usePathname } from "expo-router";

function Ticket({ index, ticket }: { index: number; ticket: ITicketInput }) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: RootState) => state.user);
  const { showBottomSheet } = useBottomSheet();
  const {
    currentTicket,
    userRide,
    stateInput: {
      pickupBusstopInput,
      dropoffBusstopInput,
      userCounterFareInput,
      userRideInput,
    },
    currentNumberOfTickets,
  } = RideSelectors();
  const {
    selectedAvailableRide,
    currentRoute,
    riderRideDetails,
    stateInput: { ticketsDetails },
  } = useAppSelector((state: RootState) => state.ride);

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
       if(path == '/bookRide') {
        const ride = payload?.payload?.ride as IRiderRideDetails;
        console.log("====================================");
        console.log("accepting......", ride, {
          ride,
        });
        console.log("====================================");
        // dispatch(setState({key:'counterFareStatus', value: 'accepted' as TRideStatus}))

        const tickets = ticketsDetails.map((ticketItem) => {
          if (
            Number(ticketItem?.number) == Number(ticket?.number) &&
            ticket?.ticketStatus == ("pending" as any)
          ) {
            return {
              ...ticket,
              ticketStatus: "accepted",
              rideFee: ticket?.userCounterFare,
            };
          } else return ticketItem;
        });

        dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));
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
       if(path == '/bookRide') {
        const ride = payload?.payload?.ride as IRiderRideDetails;
        console.log("====================================");
        console.log("declining......", ride, {
          ride,
        });
        console.log("====================================");
        // dispatch(setState({key:'counterFareStatus', value: 'accepted' as TRideStatus}))

        const tickets = ticketsDetails.map((ticketItem) => {
          if (
            Number(ticketItem?.number) == Number(ticket?.number) &&
            ticket?.ticketStatus == ("pending" as any)
          ) {
            return {
              ...ticket,
              ticketStatus: "declined"
            };
          } else return ticketItem;
        });

        dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));
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
    
    // .on(
    //   "broadcast",
    //   { event: RideConstants.event.ride_accepted },
    //   (payload) => {
    //    if(path == '/bookRide') {
    //     const ride = payload?.payload?.ride as IRiderRideDetails;
    //     console.log("====================================");
    //     console.log("accepting......", ride, {
    //       ride,
    //     });
    //     console.log("====================================");
    //     // dispatch(setState({key:'counterFareStatus', value: 'accepted' as TRideStatus}))

    //     const tickets = ticketsDetails.map((ticketItem) => {
    //       if (
    //         Number(ticketItem?.number) == Number(ticket?.number) &&
    //         ticket?.ticketStatus == ("pending" as any)
    //       ) {
    //         return {
    //           ...ticket,
    //           ticketStatus: "accepted",
    //           rideFee: ticket?.userCounterFare,
    //         };
    //       } else return ticketItem;
    //     });

    //     dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));
    //    }
    //   }
    // )
    // .on(
    //   "broadcast",
    //   { event: RideConstants.event.ride_declined },
    //   (payload) => {
    //    if(path == '/bookRide') {
    //     const ride = payload?.payload?.ride as IRiderRideDetails;
    //     console.log("====================================");
    //     console.log("declining......", ride, {
    //       ride,
    //     });
    //     console.log("====================================");
    //     // dispatch(setState({key:'counterFareStatus', value: 'accepted' as TRideStatus}))

    //     const tickets = ticketsDetails.map((ticketItem) => {
    //       if (
    //         Number(ticketItem?.number) == Number(ticket?.number) &&
    //         ticket?.ticketStatus == ("pending" as any)
    //       ) {
    //         return {
    //           ...ticket,
    //           ticketStatus: "declined",
    //           rideFee: ticket?.userCounterFare,
    //         };
    //       } else return ticketItem;
    //     });

    //     dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));
    //    }
    //   }
    // )
    // .subscribe();

  const negotiateTicketFare = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));

    // const dropoffPlan = currentRoute?.inTripDropoffs?.find((dropoff) => String(dropoff?._id) === String(dropoffBusstopInput?._id))?.plan;
    const dropoffPlan = currentRoute?.inTripDropoffs?.find(
      (dropoff) => String(dropoff?._id) === String(ticket?.dropoffBusstop?._id)
    )?.plan;

    // const returnedData = await FetchService.postWithBearerToken({
    //   url: `/user/rider/me/ride/${selectedAvailableRide?._id}/negotiate-fare`,
    //   data: {
    //     pickupBusstopId: pickupBusstopInput?._id,
    //     dropoffBusstopId: dropoffBusstopInput?._id,
    //     userCounterOffer: userCounterFareInput,
    //     ridePlan: dropoffPlan?.ride?.rideFee || dropoffPlan?.plan?.ride?.rideFee,
    //     routeId: dropoffPlan?.routeId,
    //   },
    //   token: token as string,
    // });
    const returnedData = await FetchService.postWithBearerToken({
      url: `/user/rider/me/ride/${selectedAvailableRide?._id}/negotiate-fare`,
      data: {
        pickupBusstopId: ticket?.pickupBusstop?._id,
        dropoffBusstopId: ticket?.dropoffBusstop?._id,
        userCounterOffer: ticket?.userCounterFare,
        ridePlan:
          dropoffPlan?.ride?.rideFee || dropoffPlan?.plan?.ride?.rideFee,
        routeId: dropoffPlan?.routeId,
        requestId: ticket?.rideId
      },
      token: token as string,
    });

    const code = returnedData?.code;
    const msg = returnedData?.msg;
    const userRideSaved =
      returnedData?.userRideSaved || returnedData?.riderRide;

    setFetchState((prev) => ({
      ...prev,
      loading: false,
      msg,
      code,
    }));

    if (code == 201 || code == 200) {
      const tickets = ticketsDetails.map((ticketItem) => {
        if (ticketItem?.number == ticket?.number) {
          return {
            ...ticketItem,
            ticketStatus: "pending",
            rideId: userRideSaved?._id
          };
        } else return ticketItem;
      });

      dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));
      dispatch(setCurrentTicket(ticket));
      dispatch(setState({ key: "riderRideDetails", value: userRideSaved }));
      // dispatch(setState({key:'counterFareStatus', value: 'pending'}))
    }
  };

  const toggleTicketAsFirstTicket = (ticketNumber: number) => {
    const firstTicket = ticketsDetails.find(
      (ticket) => Number(ticket?.number) == 1
    );

    let tickets = ticketsDetails.map((ticket) => {
      if (Number(ticket?.number) == ticketNumber) {
        const sameAsFirstTicket = !ticket?.sameAsFirstTicket;

        return {
          ...ticket,
          sameAsFirstTicket: !!sameAsFirstTicket,
          pickupBusstop: sameAsFirstTicket ? firstTicket?.pickupBusstop : null,
          dropoffBusstop: sameAsFirstTicket
            ? firstTicket?.dropoffBusstop
            : null,
          ticketStatus: sameAsFirstTicket ? firstTicket?.ticketStatus : null,
          userCounterFare: sameAsFirstTicket
            ? firstTicket?.userCounterFare
            : null,
          rideFee: sameAsFirstTicket ? firstTicket?.rideFee : null,
          serviceFee: sameAsFirstTicket ? firstTicket?.serviceFee : null,
          rideId: sameAsFirstTicket ? firstTicket?.rideId : null,
        } as ITicketInput;
      } else return ticket;
    });

    dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));
  };

  // ?????????????????//************************ R E N D E R I N G */
  // ?????????????????//************************ R E N D E R I N G */

  // If ticket number is 1

  if (Number(ticket?.number) === 1) {
    return (
      <View style={[wFull, flexCol, gap(32), mt(32)]}>
        <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>Ticket 1</Text>

        {/* Pick up block */}

        <View
          style={[
            wFull,
            flexCol,
            gap(16),
            { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border },
          ]}
        >
          <View style={[flexCol, gap(15)]}>
            <View style={[flex, gap(12), itemsCenter]}>
              <Image
                source={images.greenBgCoasterImage}
                style={[image.w(20), image.h(20)]}
              />

              <Text
                style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}
              >
                Pick up Bus Stop
              </Text>
            </View>

            {/* <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.pickupBusstop?.routeName}</Text> */}
            <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>
              {ticket.pickupBusstop?.name}
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
            { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border },
          ]}
        >
          <View style={[flexCol, gap(15)]}>
            <View style={[flex, gap(12), itemsCenter]}>
              <Image
                source={images.redBgCoasterImage}
                style={[image.w(20), image.h(20)]}
              />

              <Text
                style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}
              >
                Drop off Bus Stop
              </Text>
            </View>

            {/* <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.dropoffBusstop?.routeName}</Text> */}
            <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>
              {ticket.dropoffBusstop?.name}
            </Text>
          </View>

          <View style={[flexCol, gap(16), justifyStart]}>
            <View style={[flex, itemsCenter, gap(8)]}>
              <Image
                style={[image.w(14), image.h(11)]}
                source={images.rideOfferImage}
              />
              <Text
                style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}
              >
                Ticket fee
              </Text>
            </View>

            <Text style={[colorBlack, fw700, fs14]}>₦ {ticket?.rideFee}</Text>
          </View>
        </View>

        {/* Drop off block */}
      </View>
    );
  } else {
    return (
      <View style={[wFull, flexCol, gap(32), itemsStart, mt(40)]}>
        {/* Ticket Ticket */}
        <View style={[flex, itemsCenter, gap(4)]}>
          <Text
            style={[colorBlack, fw700, fs14]}
          >{`Ticket ${ticket?.number}`}</Text>

          <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
            (You have selected more than 1 seat)
          </Text>
        </View>
        {/* Ticket Ticket */}

        {/* Ceckbox block for toggling same ticket as first ticket */}

        <TouchableOpacity
          onPress={() => toggleTicketAsFirstTicket(ticket?.number)}
          style={[flex, gap(12), itemsCenter]}
        >
          <Checkbox
            value={ticket.sameAsFirstTicket}
            // onValueChange={() => {
            //   dispatch(
            //     toggleTicketAsFirstTicket({
            //       currentNumberOfTickets: ticket.number,
            //     })
            //   );
            // }}
            onValueChange={() => toggleTicketAsFirstTicket(ticket?.number)}
            color={ticket.sameAsFirstTicket ? "#27AE65" : colors.grey500}
          />

          <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>
            Same pickup and dropoff as Ticket 1?
          </Text>
        </TouchableOpacity>

        {/* Ceckbox block for toggling same ticket as first ticket */}

        {/* If the ticket's pick and drop of bus stops are not empty, Select ticket details shows otherwise Ticket pick up and drop off bus stop inputs show  */}

        {/* Select details block */}

        {!ticket.dropoffBusstop && !ticket.pickupBusstop && (
          <TouchableOpacity
            onPress={() => {
              dispatch(setCurrentTicket(ticket));

              showBottomSheet([516, 601], <TicketDetailsSheet />);
            }}
          >
            <View
              style={[
                w("auto"),
                h(50),
                p(16),
                rounded(100),
                flex,
                itemsCenter,
                justifyCenter,
                gap(10),
                bg(colors.white),
                { borderWidth: 0.7, borderColor: Colors.light.border },
              ]}
            >
              <Image
                style={[image.w(20), image.h(20)]}
                source={images.blackBgWaitChairImage}
              />

              <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>
                Select Ticket Details
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Select details block */}

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
                      c(Colors.light.border),
                      neurialGrotesk,
                      fw400,
                      fs12,
                    ]}
                  >
                    Pick up Bus Stop
                  </Text>
                </View>

                {/* <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.pickupBusstop.routeName}</Text> */}
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
                      c(Colors.light.border),
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

                <Text style={[colorBlack, fw700, fs14]}>
                  ₦ {ticket?.rideFee}
                </Text>
              </View>
            </View>

            {/* Drop off block */}

            {/* Counter fare block */}

            {!ticket.sameAsFirstTicket && (
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
                  style={[
                    c(Colors.light.textGrey),
                    neurialGrotesk,
                    fw400,
                    fs12,
                  ]}
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
                      <Text style={[c(Colors.light.textGrey), fs14, fw500]}>
                        ₦
                      </Text>
                      <TextInput
                        onFocus={() => dispatch(setCurrentTicket(ticket))}
                        onChangeText={(ticket?.ticketStatus == 'pending' as any) ? () => {} : (text) => {
                          if(ticket?.ticketStatus == 'pending' as any) return;

                          const tickets = ticketsDetails?.map((ticketItem) => {
                            if (
                              Number(ticket?.number) == Number(ticketItem?.number)
                            ) {
                              return {
                                ...ticketItem,
                                userCounterFare: text,
                              };
                            } else return ticketItem;
                          });

                          dispatch(setStateInputField({key: 'ticketsDetails', value: tickets}));

                          console.log({currentTicket})

                          // dispatch(
                          //   setStateInputField({
                          //     key: "userCounterFareInput",
                          //     value: text,
                          //   })
                          // );
                          // dispatch(
                          //   editTicketCounterFare({
                          //     currentNumberOfTickets: Number(
                          //       currentTicket?.number
                          //     ),
                          //   })
                          // );
                        }}
                        // value={userCounterFareInput?.toString()}
                        value={ticket?.userCounterFare ? String(ticket?.userCounterFare) : ''}
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
                  {/* <CounterFareCtaBtn ticket={ticket} fetchState={fetchState} setFetchState={setFetchState} /> */}
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
                          pl(loading? 7: 16),
                          rounded(10),
                          bg(Colors.light.banner),
                          {
                            borderWidth: 0.7,
                            borderColor: Colors.light.banner,
                          },
                        ]}
                      >
                        {loading && <ActivityIndicator color={colors.white} style={tw `w-[20px] h-[20px]`} />}
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
                        <Text
                          style={[neurialGrotesk, fw700, fs16, c("#27AE65")]}
                        >
                          Accepted
                        </Text>
                      </View>
                    ) : ticket?.ticketStatus === 'declined' ? (
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
                        <Text
                          style={[neurialGrotesk, fw700, fs16, c("#27AE65")]}
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
                  <View
                    style={[wFull, flex, itemsCenter, justifyStart, gap(12)]}
                  >
                    <Image
                      style={[
                        image.w(20),
                        image.h(21),
                        { objectFit: "contain" },
                      ]}
                      source={images.cautionImage}
                    />

                    <Text
                      style={[
                        fw400,
                        fs12,
                        c(Colors.light.error),
                      ]}
                    >
                      {msg}
                      {/* Offer too low to work with */}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Counter fare block */}
          </>
        )}

        {/* Bus Stop Inputs */}
      </View>
    );
  }
}

export default Ticket;
