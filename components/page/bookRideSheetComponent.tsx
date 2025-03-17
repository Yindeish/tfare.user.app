import { image, mXAuto, wHFull } from "@/utils/imageStyles";
import {
  absolute,
  bg,
  flex,
  flexCenter,
  flexCol,
  gap,
  h,
  hFull,
  itemsCenter,
  itemsStart,
  justifyBetween,
  justifyCenter,
  left0,
  mt,
  pb,
  px,
  py,
  relative,
  rounded,
  top0,
  w,
  wFull,
  zIndex,
} from "@/utils/styles";
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
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
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import Colors, { colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import {
  editTicketBusstops,
  setState,
  setStateInputField,
} from "@/state/slices/ride";
import RideSelectors from "@/state/selectors/ride";
import { closeBottomSheet } from "@/state/slices/layout";
import CtaBtn from "../shared/ctaBtn";
import RideBlock from "./rideBlock";
import {
  IBusStop,
  ICity,
  ICurrentRide,
  IPlan,
  IRide,
  ITicketInput,
} from "@/state/types/ride";
import BuyTicketListTile from "./buyTicketListTile";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useEffect, useState } from "react";
import { Href, router, useGlobalSearchParams } from "expo-router";
import { pages } from "@/constants/pages";
import { RootState } from "@/state/store";
import tw from "@/constants/tw";
import FetchService from "@/services/api/fetch.service";
import * as Linking from "expo-linking";
import AccountSelectors from "@/state/selectors/account";
import { getStringAsync, setStringAsync } from "expo-clipboard";
import { supabase } from "@/supabase/supabase.config";
import { TripStartedSheet } from "./tripStartedBottomSheetComponents";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { useFormik } from "formik";
import { ObjectSchema, string } from "yup";
import { setSavedAddresses } from "@/state/slices/account";
import { IAddress } from "@/state/types/account";
import { ActivityIndicator } from "react-native";
import URLS from "@/constants/urls";
import { RealtimeChannel } from "@supabase/supabase-js";

function TicketDetailsSheet() {
  const dispatch = useAppDispatch();
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  const { token: session } = useAppSelector((state: RootState) => state.user);
  const { savedAddresses } = AccountSelectors();

  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const {
    currentTicket,
    stateInput: { dropoffBusstopInput, pickupBusstopInput },
  } = RideSelectors();
  const {
    currentRoute,
    selectedAvailableRide,
    currentNumberOfTickets,
    stateInput: { ticketsDetails },
  } = useAppSelector((state: RootState) => state.ride);
  console.log({ currentTicket, currentRoute });

  const [fetchState, setFetchState] = useState({
    loading: false,
    gettingTicketdetails: false,
  });
  const { loading, gettingTicketdetails } = fetchState;

  const [searchState, setSearchState] = useState<{
    loading: boolean;
    busstops: IBusStop[];
    inputtingPickup: boolean;
    inputtingDropoff: boolean;
    pickupSearchText: string;
    dropoffSearchText: string;
  }>({
    loading: false,
    busstops: [] as never as IBusStop[],
    // busstops: currentRoute?.inTripDropoffs,
    inputtingPickup: false,
    inputtingDropoff: false,
    pickupSearchText: "",
    dropoffSearchText: "",
  });
  const {
    busstops,
    inputtingPickup,
    inputtingDropoff,
    dropoffSearchText,
    pickupSearchText,
  } = searchState;

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      pickupBusstop: "",
      dropoffBusstop: "",
    },
    validationSchema: new ObjectSchema({
      pickupBusstop: string().required(),
      dropoffBusstop: string().required(),
    }),
    onSubmit: ({ dropoffBusstop, pickupBusstop }) => {
      setQuery(RideConstants.query.FilledForm);
      // showBottomSheet([436], <FilledForm />, true);
      // router.setParams({ query: "FilledForm" });
    },
  });

  const getSavedBusstops = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));
    const returnedData = await FetchService.getWithBearerToken({
      url: "/user/rider/me/busstop/saved-busstops",
      token: session as string,
    });
    const allBusStops = returnedData?.allBusStops as IAddress[];
    console.log({ allBusStops });

    setFetchState((prev) => ({ ...prev, loading: false }));
    if (allBusStops) {
      dispatch(setSavedAddresses(allBusStops));
    }
  };

  const searchBusstops = (query: string) => {
    const busstops = currentRoute?.inTripDropoffs?.filter((busstop) =>
      String(busstop?.name)?.toLowerCase()?.includes(query?.toLowerCase())
    ) as IBusStop[];

    setSearchState((prev) => ({ ...prev, busstops }));

    // incase the user doesn't later click an busstop in the suggestion box
    if (inputtingPickup && !inputtingDropoff) {
      const matchBusstop = busstops.find((busstop) =>
        busstop?.name?.toLowerCase()?.includes(query?.toLowerCase())
      );
      dispatch(
        setStateInputField({
          key: "pickupBusstopInput",
          value: matchBusstop,
        })
      );
    }

    if (inputtingDropoff && !inputtingPickup) {
      const matchBusstop = busstops.find((busstop) =>
        busstop?.name?.toLowerCase()?.includes(query?.toLowerCase())
      );
      dispatch(
        setStateInputField({
          key: "dropoffBusstopInput",
          value: matchBusstop,
        })
      );
    }

    // incase the user doesn't later click an busstop in the suggestion box
  };

  const getRidePlan = () => {
    if (values.dropoffBusstop == "" || values.pickupBusstop == "") return;
    // plan

    const unitFare = currentRoute?.unitFares?.find(
      (unitFare) =>
        String(unitFare?.pickupBusstopId) == String(pickupBusstopInput?._id) &&
        String(unitFare?.dropoffBusstopId) == String(dropoffBusstopInput?._id)
    );

    const matchPlan = unitFare?.plan;
    // plan

    const tickets = ticketsDetails?.map((ticket) => {
      if (Number(ticket?.number) == Number(currentTicket?.number)) {
        return {
          ...ticket,
          dropoffBusstop: dropoffBusstopInput,
          pickupBusstop: pickupBusstopInput,
          rideFee: matchPlan?.ride?.rideFee,
          serviceFee: matchPlan?.serviceFee,
          unitFare,
          ticketStatus: "idle",
        };
      } else return ticket;
    });
    dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));

    // dispatch(setState({ key: "ridePlans", value: [matchPlan] }));

    // dispatch(
    //   editTicketBusstops({
    //     currentNumberOfTickets: Number(currentTicket?.number as number),
    //     ridePlan: matchPlan,
    //   })
    // );
    hideBottomSheet();
  };

  const selectPickup = (busstop: IBusStop) => {
    setFieldValue("pickupBusstop", busstop?.name);

    const tickets = ticketsDetails?.map((ticketDetails) => {
      if (Number(ticketDetails?.number) === Number(currentTicket?.number)) {
        return {
          ...ticketDetails,
          pickupBusstop: busstop,
        };
      } else return ticketDetails;
    });

    dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));

    dispatch(
      setStateInputField({
        key: "pickupBusstopInput",
        value: busstop,
      })
    );
  };

  const selectDropoff = (busstop: IBusStop) => {
    setFieldValue("dropoffBusstop", busstop?.name);

    const tickets = ticketsDetails?.map((ticketDetails) => {
      if (Number(ticketDetails?.number) === Number(currentTicket?.number)) {
        return {
          ...ticketDetails,
          dropoffBusstop: busstop,
        };
      } else return ticketDetails;
    });

    dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));

    dispatch(
      setStateInputField({
        key: "dropoffBusstopInput",
        value: busstop,
      })
    );
  };

  // Updating pickup search
  useEffect(() => {
    inputtingPickup &&
      values.pickupBusstop != "" &&
      searchBusstops(values.pickupBusstop as string);
  }, [values.pickupBusstop, inputtingPickup]);
  // Updating pickup search

  // Updating pickup search
  useEffect(() => {
    inputtingDropoff &&
      values.dropoffBusstop != "" &&
      searchBusstops(values.dropoffBusstop as string);
  }, [values.dropoffBusstop, inputtingDropoff]);
  // Updating pickup search

  useEffect(() => {
    session && savedAddresses.length <= 0 && getSavedBusstops();
  }, [session]);

  return (
    <PaddedScreen>
      <View style={[flexCol, gap(16), mt(20)]}>
        <View style={[flexCol, gap(16), itemsCenter]}>
          <View
            style={[pb(16), flex, itemsStart, gap(16), mXAuto as ViewStyle]}
          >
            <Image
              style={[image.w(30), image.h(20)]}
              source={images.ticketImage}
            />

            <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>
              Ticket Details
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

          <TextInput
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
              ] as TextStyle[]
            }
            placeholderTextColor={Colors.light.textGrey}
            cursorColor={Colors.light.textGrey}
            placeholder="Pick up Bus Stop"
            value={values.pickupBusstop}
            autoCorrect={false}
            // onChangeText={handleChange("pickupBusstop")}
            // onFocus={() => {
            //   setSearchState((prev) => ({
            //     ...prev,
            //     inputtingPickup: true,
            //     inputtingDropoff: false,
            //   }));
            // }}
            // value={pickupBusstopInput?.name}
            // onChangeText={(text) => {
            //   dispatch(
            //     setStateInputField({ key: "pickupBusstopInput", value: text })
            //   );
            // }}
          />
        </View>

        {/* In-trip Dropoff List */}

        <FlatList
          style={[wFull, h(46), flex, gap(16)]}
          horizontal
          data={currentRoute?.inTripDropoffs}
          renderItem={({ item: busstop }) => (
            <TouchableOpacity onPress={() => selectPickup(busstop)}>
              <View
                style={[
                  hFull,
                  rounded(100),
                  py(16),
                  px(32),
                  gap(10),
                  flex,
                  itemsCenter,
                  justifyCenter,
                  { borderWidth: 1, borderColor: Colors.light.border },
                  tw`w-auto`,
                ]}
              >
                <Image style={tw`w-[22px] h-[19px]`} source={images.trip} />

                <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>
                  {busstop?.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={[w(16), hFull, bg(colors.transparent)]} />
          )}
          keyExtractor={({ _id }) => String(_id)}
        />
        {/* In-trip Dropoff List */}

        {/* Pick up block */}

        {/* Drop off block */}

        <View style={[wFull, h(52), flex, gap(10), itemsCenter]}>
          <TouchableOpacity>
            <Image
              style={[image.w(15), image.h(20)]}
              source={images.redBgCoasterImage}
            />
          </TouchableOpacity>

          <TextInput
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
              ] as TextStyle[]
            }
            placeholderTextColor={Colors.light.textGrey}
            cursorColor={Colors.light.textGrey}
            placeholder="Drop off Bus Stop"
            autoCorrect={false}
            value={values.dropoffBusstop}
            onChangeText={handleChange("dropoffBusstop")}
            onFocus={() => {
              setSearchState((prev) => ({
                ...prev,
                inputtingDropoff: true,
                inputtingPickup: false,
              }));
            }}
            // value={dropoffBusstopInput?.name}
            // onChangeText={(text) => {
            //   dispatch(
            //     setStateInputField({ key: "dropoffBusstopInput", value: text })
            //   );
            // }}
          />
        </View>

        {/* In-trip Dropoff List */}

        <FlatList
          style={[wFull, h(46), flex, gap(16)]}
          horizontal
          data={currentRoute?.inTripDropoffs}
          renderItem={({ item: busstop }) => (
            <TouchableOpacity onPress={() => selectDropoff(busstop)}>
              <View
                style={[
                  hFull,
                  rounded(100),
                  py(16),
                  px(32),
                  gap(10),
                  flex,
                  itemsCenter,
                  justifyCenter,
                  { borderWidth: 1, borderColor: Colors.light.border },
                  tw`w-auto`,
                ]}
              >
                <Image style={tw`w-[22px] h-[19px]`} source={images.trip} />

                <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>
                  {busstop?.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={[w(16), hFull, bg(colors.transparent)]} />
          )}
          keyExtractor={({ _id }) => String(_id)}
        />
        {/* In-trip Dropoff List */}

        {/* Drop off block */}
      </View>

      <TouchableOpacity
        onPress={() => {
          if (values.dropoffBusstop != "" || values.pickupBusstop != "") {
            getRidePlan();
          } else return;
        }}
      >
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
            {
              opacity:
                values.dropoffBusstop == "" || values.pickupBusstop == ""
                  ? 0.5
                  : 1,
            },
          ]}
        >
          <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>
            Add Details
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

function RideBookedSheet({ rideId }: { rideId: string }) {
  const {
    paidTickets,
    riderRideDetails,
    selectedAvailableRide,
    sameTickets,
    differentTickets,
    driverDetails,
    stateInput: { ticketsDetails },
  } = useAppSelector((state: RootState) => state.ride);
  const { token, user } = useAppSelector((state: RootState) => state.user);
  const { hideBottomSheet, showBottomSheet } = useBottomSheet();
  const dispatch = useAppDispatch();
  const { requestId } = useGlobalSearchParams();
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);

  console.log("====================================");
  console.log({ ticketsDetails }, { oya: "naw" });
  console.log("====================================");

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, msg, loading } = fetchState;

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

  // const channel = supabase.channel(
  //   `${RideConstants.channel.ride_starting}${riderRideDetails?._id}`
  // );
  // channel
  //   .on("broadcast", { event: RideConstants.event.ride_started }, (payload) => {
  //     if (query == RideConstants.query.RideBooked) {
  //       setQuery(RideConstants.query.RideStarted);
  //       showBottomSheet([100, 500], <TripStartedSheet />, true);
  //       router.replace("/(rideScreens)/rideMap");
  //     }
  //   })
  //   .subscribe();
  let activeChannels: RealtimeChannel[] = [];

  function listenToAllRides(riderRides: ITicketInput[]) {
    activeChannels.forEach((channel) => {
      channel
        .unsubscribe()
        .then(() => console.log(`Unsubscribed from: ${channel.topic}`));
    });
    activeChannels = [];

    // Subscribe to each ride
    riderRides.forEach((ride) => {
      const channelName = `${RideConstants.channel.ride_starting}${ride.rideId}`;
      console.log(`Listening to ride: ${channelName}`);

      const channel = supabase.channel(channelName);

      channel
        .on(
          "broadcast",
          { event: RideConstants.event.ride_started },
          (payload) => {
            console.log(`Ride started for ${ride.rideId}`, payload);
            if (query === RideConstants.query.RideBooked) {
              setQuery(RideConstants.query.RideStarted);
              showBottomSheet([100, 500], <TripStartedSheet />, true);
              router.replace("/(rideScreens)/rideMap");
            }
          }
        )
        .subscribe();

      activeChannels.push(channel); // Store the active channels
    });
  }

  listenToAllRides(ticketsDetails);

  return (
    <PaddedScreen>
      <View style={[flexCol, gap(32), mt(20)]}>
        <PaddedScreen>
          <View style={[flexCol, gap(20)]}>
            <View style={[wFull, flex, gap(10), itemsCenter, justifyCenter]}>
              <Image
                style={[image.w(30), image.h(27)]}
                source={images.greenBgCheckTripImage}
              />

              <Text
                style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}
              >
                Ride Booked
              </Text>
            </View>

            <Text
              style={
                [
                  neurialGrotesk,
                  fw400,
                  fs12,
                  c(Colors.light.textGrey),
                  mXAuto,
                ] as TextStyle[]
              }
            >
              Your Trip has been successfully booked
            </Text>
          </View>
        </PaddedScreen>

        {/* Ride block */}
        <RideBlock
          ride={selectedAvailableRide as ICurrentRide}
          bgColor="#FFF7E6"
          ctaType="trackRide"
          touchable
          roundedCorners={false}
          onPress={openMap}
        />
        {/* Ride block */}

        {/* Driver block */}

        <TouchableOpacity
          onPress={() => router.push(`/(sharedScreens)/driverProfile` as Href)}
          style={[
            wFull,
            h(144),
            flex,
            itemsCenter,
            justifyCenter,
            bg(colors.white),
            rounded(10),
            gap(16),
            { borderWidth: 0.7, borderColor: Colors.light.border },
          ]}
        >
          <Image
            source={{ uri: driverDetails?.picture || driverDetails?.avatar }}
            style={[image.w(70), image.h(70), image.rounded(70)]}
          />

          <View style={[flexCol, itemsStart, gap(20)]}>
            <Text style={[fw700, fs16, colorBlack, tw`capitalize`]}>
              {selectedAvailableRide?.driverId}
            </Text>

            <View style={[flex, gap(32), itemsCenter, mXAuto as ViewStyle]}>
              <View style={[flex, itemsCenter, gap(12)]}>
                <Image
                  source={images.startRatingImage}
                  style={[image.w(18), image.h(18)]}
                />

                <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>5.0</Text>
              </View>

              <View style={[flex, itemsCenter, gap(12)]}>
                <Image
                  source={images.checkTripImage}
                  style={[image.w(18), image.h(17)]}
                />

                <Text style={[fw400, fs14, c(Colors.light.textGrey)]}>
                  {/* ABJ-123-XY */}
                  {selectedAvailableRide?.vehicleName}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Driver block */}

        {/* Trip Details (tickets) */}

        <View
          style={[
            wFull,
            flexCol,
            gap(16),
            pb(16),
            { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 },
          ]}
        >
          <BuyTicketListTile
            leadingText="Trip ID"
            trailing={{
              // text: '#7654321XYZ',
              text: selectedAvailableRide?._id as string,
              icon: true,
            }}
          />

          {ticketsDetails?.map((ticket, index) => (
            <BuyTicketListTile
              leadingText={`Ticket ${ticket?.number} code`}
              trailing={{
                // text: '#765XYZ',
                text: ticket?.ticketOtp
                  ? String(ticket?.ticketOtp)
                  : String(ticket?.rideId?.slice(-4)),
                icon: true,
              }}
              key={index}
            />
          ))}

          {/* Same Tickets */}
          {/* {sameTickets &&
            Array.from({ length: Number(sameTickets?.quantity) }).map(
              (_, index) => (
                <BuyTicketListTile
                  leadingText={`Ticket ${index + 1} code`}
                  trailing={{
                    // text: '#765XYZ',
                    text: sameTickets?.ticketOtp as string,
                    icon: true,
                  }}
                  key={index}
                />
              )
            )} */}
          {/* {sameTickets &&
            // (sameTickets || [])?.map(
            Array.from({ length: Number(sameTickets[0]?.quantity) })?.map(
              // (ticket, index) => (
              (_, index) => (
                <BuyTicketListTile
                  leadingText={`Ticket ${index + 1} code`}
                  trailing={{
                    // text: '#765XYZ',
                    // text: ticket?.ticketOtp as string,
                    text: String(sameTickets[0]?.ticketOtp),
                    icon: true,
                  }}
                  key={index}
                />
              )
            )} */}
          {/* Same Tickets */}
          {/* Different Tickets */}
          {/* {differentTickets &&
            Number(differentTickets?.length) > 0 &&
            differentTickets?.map((ticket, index) => (
              <BuyTicketListTile
                leadingText={`Ticket ${index + 1} code`}
                trailing={{
                  // text: '#765XYZ',
                  text: String(ticket?.ticketOtp),
                  icon: true,
                }}
                key={index}
              />
            ))} */}
          {/* Different Tickets */}
        </View>

        {/* Trip Details (tickets) */}

        {/* CTAs */}

        <View style={tw `w-full h-auto flex flex-col gap-[16px]`}>
          <CtaBtn
            img={{
              src: images.redBgCautionImage,
            }}
            onPress={() => {
              router.replace("/(rideScreens)/tripDetails");
            }}
            text={{ name: "View Trip Details" }}
            bg={{ color: Colors.light.background }}
          />

          <CtaBtn
            img={{
              src: images.cancelImage,
            }}
            onPress={() => {}}
            text={{ name: "Cancel Order", color: Colors.light.textGrey }}
            bg={{ color: "#F9F7F8", borderColor: Colors.light.border }}
          />
        </View>
        {/* CTAs */}
      </View>
    </PaddedScreen>
  );
}

export { TicketDetailsSheet, RideBookedSheet };
