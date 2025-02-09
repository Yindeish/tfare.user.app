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
import { Href, router, useLocalSearchParams } from "expo-router";
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
import Toast from 'react-native-toast-message'



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

export default function BookRide() {
  const { rideId, currentRideId } = useLocalSearchParams();
  const { token } = useAppSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch();
  const {
    userRide,
    allTicketsFilled,
    stateInput: { pickupBusstopInput, dropoffBusstopInput, userRideInput },
    currentNumberOfTickets,
    paymentOptionsVisible,
  } = RideSelectors();

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
    rides: [],
  });
  const { code, msg, loading, rides } = fetchState;

  const selectNumberOfTickets = (ticketNumber: number) => {
    dispatch(setCurrentNumberOfTickets(ticketNumber));

    dispatch(createTicket({ currentNumberOfTickets: ticketNumber }));
  };

  const buyTickets = async () => {
    const sameTickets = userRideInput?.tickets?.every(
      (ticket) => ticket?.sameAsFirstTicket === true
    );

    setFetchState((prev) => ({ ...prev, loading: true }));

    if (sameTickets) {

      const returnedData = await FetchService.postWithBearerToken({
        data: {
          numberOfTickets: Number(currentNumberOfTickets),
        },
        token: token as string,
        url: `/user/rider/me/ride/${userRide?.currentRide?._id}/book`,
      });
      console.log({ returnedData });

      setFetchState((prev) => ({
        ...prev,
        loading: false,
        code: returnedData?.code,
        msg: returnedData?.msg,
      }));

    //   toast({
    //     title: "Ticket Booking",
    //     // preset: "done",
    //     message: returnedData?.msg,
    //   });
    Toast.show({
        type: 'info',
        text1: returnedData?.msg,
        position: 'bottom',
      });

      const rides = [returnedData?.ticketUnderBooking];
      if (rides) {
        setFetchState((prev) => ({ ...prev, rides: rides as any}));
      }
      dispatch(setPaymentOptionsVisible(true));
    } else {
      const subsequentTickets = userRideInput?.tickets?.map((ticket) => ({
        pickupBusstopId: ticket?.pickupBusstop?._id,
        dropoffBusstopId: ticket?.dropoffBusstop?._id,
        ridePlanSeats: userRide?.currentRide?.availableSeats,
        ridePlanName: "standard",
        userCounterOffer: ticket?.userCounterFare,
      }));

      console.log({ subsequentTickets });

      const returnedData = await FetchService.postWithBearerToken({
        data: {
          subsequentTickets: subsequentTickets,
        },
        token: token as string,
        url: `user/rider/me/ride/${userRide?.riderRideDetails?._id}/book-unlike`,
      });

      console.log({ returnedData });
      setFetchState((prev) => ({
        ...prev,
        loading: false,
        code: null,
        msg: "",
      }));

    //   toast({
    //     title: "Burnt installed.",
    //     preset: "done",
    //     message: returnedData?.msg,
    //   });
    //   const riderExistingUnBookedRides = returnedData?.riderExistingUnBookedRides;
    //   if (riderExistingUnBookedRides) {
    //     setFetchState((prev) => ({ ...prev, ride: riderExistingUnBookedRides }));
    //   }
      dispatch(setPaymentOptionsVisible(true));
    }
  };

  //   const getRideDetails = async () => {
  //     const url = `user/rider/me/ride/${currentRideId}/ride-details`;

  //     setFetchState((prev) => ({ ...prev, loading: true }));
  //     const returnedData = await FetchService.getWithBearerToken({
  //       url: "/user/rider/me/available-rides",
  //       token: token as string,
  //     });

  //     const code = returnedData?.code;
  //     const msg = returnedData?.msg;
  //     const rideDetails = returnedData?.rides;

  //     if (code && code == 200 && rideDetails) {
  //       setFetchState((prev) => ({
  //         ...prev,
  //         loading: false,
  //         msg: "",
  //         code: null,
  //         ride: rideDetails
  //       }));
  //     } else if (code && code == 400) {
  //       setFetchState((prev) => ({
  //         ...prev,
  //         loading: false,
  //         msg: "",
  //         code: null,
  //       }));
  //     }
  //   };

  //   useEffect(() => {
  //     getRideDetails();
  //   }, []);

  // create a single ticket based on the default number of tickets
  useEffect(() => {
    if (currentNumberOfTickets === 1) {
      dispatch(createTicket({ currentNumberOfTickets: 1 }));
    }
  }, [currentNumberOfTickets]);
  // create a single ticket based on the default number of tickets

  // check if all tickets have been filled
  useEffect(() => {
    if (Number(userRideInput?.tickets?.length) > 0) {
      const allTciketsFilled = userRideInput?.tickets?.every(
        (ticket) => ticket.dropoffBusstop && ticket.dropoffBusstop
        // &&  ticket.dropoffBusstop.routeName !== '' && ticket.dropoffBusstop.routeName !== '')
      );
      if (allTciketsFilled) dispatch(setAllTicketsFilled(true));
      else dispatch(setAllTicketsFilled(false));
    }
  }, [userRideInput?.tickets]);
  // check if all tickets have been filled

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
            ride={
              userRide as {
                riderRideDetails: IRiderRideDetails;
                currentRide: ICurrentRide;
              }
            }
            bgColor="#FFF7E6"
            ctaType="trackRide"
            touchable
            roundedCorners={false}
            onPress={() => {}}
          />

          <PaddedScreen>
            {/* Ticket */}
            <View
              style={[
                wFull,
                h(99),
                flexCol,
                gap(16),
                {
                  borderBottomColor: Colors.light.border,
                  borderBottomWidth: 0.7,
                },
              ]}
            >
              <View style={[wFull, flex, itemsCenter, gap(12)]}>
                <Image
                  style={[image.w(20), image.h(13)]}
                  source={images.ticketImage}
                />

                <Text
                  style={[
                    neurialGrotesk,
                    fw400,
                    fs12,
                    c(Colors.light.textGrey),
                  ]}
                >
                  Tickets
                </Text>
              </View>

              <ScrollView>
                <View style={[wFull, flex, gap(16)]}>
                  {/* 5 is the seats (total) and 3 is the available seats */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <>
                      {index + 1 <=
                      Number(userRide?.currentRide?.availableSeats) ? (
                        <TouchableOpacity
                          onPress={() => selectNumberOfTickets(index + 1)}
                          style={[
                            sharedStyle,
                            currentNumberOfTickets === index + 1
                              ? selectedSeatStyle
                              : availableSeatStyle,
                          ]}
                          key={index}
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
                        <View
                          style={[sharedStyle, unavailableSeatStyle]}
                          key={index}
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
                        </View>
                      )}
                    </>
                  ))}
                </View>
              </ScrollView>
            </View>

            <FlatList
              horizontal={false}
              data={userRideInput?.tickets}
              renderItem={({ index, item: ticketId }) => (
                <Ticket ticket={ticketId} index={index} key={index} />
              )}
            />
            {/* Ticket */}

            {/* Add another ticket btn */}

            {/* 5 is the seats (total) and 3 is the available seats */}
            {currentNumberOfTickets <
              Number(userRide?.currentRide?.availableSeats) && (
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    setCurrentNumberOfTickets(currentNumberOfTickets + 1)
                  );
                  dispatch(
                    createTicket({
                      currentNumberOfTickets: currentNumberOfTickets + 1,
                    })
                  );
                }}
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
                    Add another ticket
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Add another ticket btn */}

            {/* Shows when all the tickets have been filled (counter fare are optional) */}
            {/* Buy Ticket Btn */}

            {allTicketsFilled && (
              <View
                style={[
                  absolute,
                  zIndex(indices.xHigh),
                  b("30%"),
                  l(20),
                  wFull,
                ]}
              >
                <CtaBtn
                  img={{
                    src: images.whiteBgTicketImage,
                    w: 22,
                    h: 14,
                  }}
                  onPress={buyTickets}
                  text={{
                    name: "Buy Ticket",
                    color: colors.white,
                  }}
                  bg={{
                    color: Colors.light.background,
                  }}
                />
              </View>
            )}

            {/* Buy Ticket Btn */}

            {/* Shows when buy ticket cta btn is clicked */}

            {/* Payment options */}

            {paymentOptionsVisible && (
              <View style={[wFull, flexCol, gap(16), mt(32)]}>
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
                    onPress={() =>
                      router.push(`/(rideScreens)/paymentOptions/1` as Href)
                    }
                    style={[wFull, flex, justifyBetween, itemsCenter]}
                  >
                    <Text style={[neurialGrotesk, fs14, fw700, colorBlack]}>
                      Pay with
                    </Text>

                    <View style={[flex, gap(16), itemsCenter]}>
                      <Text style={[neurialGrotesk, fw400, fs14, colorBlack]}>
                        Wallet
                      </Text>

                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={Colors.light.textGrey}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[wFull, flex, justifyBetween, itemsCenter]}
                  >
                    <Text
                      style={[
                        neurialGrotesk,
                        fs14,
                        fw700,
                        c(Colors.light.border),
                      ]}
                    >
                      Offers
                    </Text>

                    <View style={[flex, gap(16), itemsCenter]}>
                      <Text
                        style={[
                          neurialGrotesk,
                          fw400,
                          fs14,
                          c(Colors.light.border),
                        ]}
                      >
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
                      text: "#1234567ABC",
                    }}
                  />
                  <BuyTicketListTile
                    leadingText="Trip Cost"
                    trailing={{
                      text: " ₦ 500.00",
                    }}
                  />
                  <BuyTicketListTile
                    leadingText="Discount"
                    trailing={{
                      text: " ₦ 0000.00",
                    }}
                  />
                </View>

                <BuyTicketListTile
                  leadingText="Total"
                  trailing={{
                    text: " ₦ 500.00",
                  }}
                />
              </View>
            )}

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

function RideBlock({
  bgColor,
  ctaType,
  roundedCorners,
  ride,
  onPress,
  touchable,
}: {
  ctaType: "trackRide" | "bookRide";
  bgColor: "#F9F7F8" | "#FFF7E6";
  roundedCorners: boolean;
  ride?: { riderRideDetails: IRiderRideDetails; currentRide: ICurrentRide };
  onPress?: () => void;
  touchable?: boolean;
}) {
  return (
    <View
      style={[
        wFull,
        h(144),
        roundedCorners && rounded(10),
        py(17),
        px(9),
        flexCol,
        gap(10),
        bg(bgColor),
        ctaType === "bookRide" && mb(20),
      ]}
    >
      <View style={[wFull, h(45), flex, itemsCenter, justifyBetween, gap(14)]}>
        <View style={[flexCol, gap(12), itemsStart]}>
          <Text style={[colorBlack, fw700, fs14]}>
            Rider #{ride?.riderRideDetails?._id.slice(0, 10)}
          </Text>
          <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
            {ride?.currentRide?.vehicleName}
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
          <Text style={[fs12, fw500, colorBlack]}>
            {ride?.currentRide?.availableSeats} seats Available
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
            {/* <Text style={[colorBlack, fw500, fs14]}>{ride?.riderRideDetails?.duration}</Text> */}
          </View>
        </View>

        <View style={[flex, itemsCenter, gap(12)]}>
          <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>
            {ctaType === "bookRide" ? "Book Ride" : "Track Ride"}
          </Text>

          {touchable ? (
            <TouchableOpacity
              onPress={onPress}
              style={[
                w(45),
                h(45),
                rounded(45),
                bg(Colors.light.background),
                flex,
                itemsCenter,
                justifyCenter,
                { borderWidth: 0.7, borderColor: Colors.light.border },
              ]}
            >
              {ctaType === "bookRide" ? (
                <FontAwesome6
                  name="arrow-right-long"
                  size={24}
                  color={colors.white}
                />
              ) : (
                <Image
                  style={[image.w(22), image.h(22)]}
                  source={images.blueBgPickupImage}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View
              style={[
                w(45),
                h(45),
                rounded(45),
                bg(Colors.light.background),
                flex,
                itemsCenter,
                justifyCenter,
                { borderWidth: 0.7, borderColor: Colors.light.border },
              ]}
            >
              {ctaType === "bookRide" ? (
                <FontAwesome6
                  name="arrow-right-long"
                  size={24}
                  color={colors.white}
                />
              ) : (
                <Image
                  style={[image.w(22), image.h(22)]}
                  source={images.blueBgPickupImage}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
