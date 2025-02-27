import {
  Href,
  Redirect,
  Stack,
  Tabs,
  useGlobalSearchParams,
  usePathname,
} from "expo-router";
import {
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  TextStyle,
  Text,
} from "react-native";
import { useSession } from "../../contexts/userSignedInContext";
import { useEffect, useState } from "react";
import { pages } from "@/constants/pages";
import { FontAwesome } from "@expo/vector-icons";
import { tabs } from "@/constants/tabs";
import Colors, { colors } from "@/constants/Colors";
import TabBartTitle from "@/components/tab/tabTitle";
import { images } from "@/constants/images";
import { router } from "expo-router";
import tw from "@/constants/tw";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import {
  absolute,
  b,
  bg,
  flexCenter,
  h,
  l,
  mb,
  wFull,
  zIndex,
} from "@/utils/styles";
import CtaBtn from "@/components/shared/ctaBtn";
import { indices } from "@/constants/zIndices";
import Toast from "react-native-toast-message";
import FetchService from "@/services/api/fetch.service";
import { setPaymentOptionsVisible, setState } from "@/state/slices/ride";
import { ActivityIndicator } from "react-native";
import { RideBookedSheet } from "@/components/page/bookRideSheetComponent";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useSnackbar } from "@/contexts/snackbar.context";
import { openURL } from "expo-linking";
import {
  TripCompletedSheet,
  TripStartedSheet,
} from "@/components/page/tripStartedBottomSheetComponents";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";
import {
  FilledForm,
  RecentDropoffLocations,
  RecentLocationsSnippet,
  RecentPickupLocations,
  RideRouteDetails,
  SearchingRide,
} from "@/components/page/orderRideBottomSheetComponents";

export default function AppLayout() {
  const { userSession, isLoading } = useSession();
  const {
    booking,
    allTicketsFilled,
    currentNumberOfTickets,
    userRide,
    selectedAvailableRide,
    riderRideDetails,
    stateInput: { userRideInput, paymentOptionInput },
  } = useAppSelector((state: RootState) => state.ride);
  const { token } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const { showBottomSheet } = useBottomSheet();
  const searchParams = useGlobalSearchParams();
  const { selectedAvailableRideId, requestId } = useGlobalSearchParams();
  const path = usePathname();
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  const { riderCounterOffer } = useGlobalSearchParams<{
    query?: string;
    riderCounterOffer?: string;
  }>();
  const { riderRideDetails: riderRide } = useAppSelector((state) => state.ride);

  console.log("====================================");
  console.log({ query });
  console.log("====================================");
  console.log("====================================");
  console.log({ selectedAvailableRideId, selectedAvailableRide });
  console.log("====================================");

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { loading, msg } = fetchState;

  const buyTickets = async () => {
    console.log("====================================");
    console.log({
      selectedAvailableRideId,
      selectedAvailableRide,
      requestId,
      riderRideDetails,
    });
    console.log("====================================");
    if (!allTicketsFilled) return;

    const sameTickets = userRideInput?.tickets?.every(
      (ticket) => ticket?.sameAsFirstTicket === true
    );

    setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

    if (sameTickets) {
      try {
        const returnedData = await FetchService.postWithBearerToken({
          data: {
            numberOfTickets: Number(currentNumberOfTickets),
            requestId: requestId || riderRideDetails?._id,
            paymentOption: paymentOptionInput,
          },
          token: token as string,
          url: `/user/rider/me/ride/${
            selectedAvailableRideId || selectedAvailableRide?._id
          }/book`,
        });

        setFetchState((prev) => ({
          ...prev,
          loading: false,
          code: returnedData?.code,
          msg: returnedData?.msg,
        }));

        const code = returnedData?.code;
        const msg = returnedData?.msg;
        const ticketPaid = returnedData?.ticketPaid;
        const bookedTicket = returnedData?.bookedTicket;
        const ticketBooked = returnedData?.ticketBooked;
        const paymentLink = returnedData?.paymentLink;
        const status = returnedData?.status;
        const driver = returnedData?.driver;
        const riderRide = returnedData?.riderRide;
        const currentRide = returnedData?.currentRide;

        if (code && (code == 200 || code == 201)) {
          if (ticketPaid) {
            dispatch(setState({ key: "sameTickets", value: [ticketPaid] }));
            if (riderRide)
              dispatch(
                setState({
                  key: "riderRideDetails",
                  value: returnedData?.riderRide,
                })
              );
            if (currentRide)
              dispatch(
                setState({
                  key: "selectedAvailableRide",
                  value: returnedData?.currentRide,
                })
              );
            if (driver)
              dispatch(
                setState({ key: "driverDetails", value: returnedData?.driver })
              );
            // dispatch(setPaymentOptionsVisible(true));
            router.setParams({ ...searchParams, query: "RideBooked" });
            showBottomSheet(
              [800],
              <RideBookedSheet rideId={selectedAvailableRideId as string} />,
              true
            );
            return;
          }

          if ((ticketBooked && paymentLink) || (bookedTicket && paymentLink)) {
            const sameTickets = ticketBooked || bookedTicket;

            dispatch(setState({ key: "sameTickets", value: sameTickets }));
            openURL(paymentLink).catch((err: any) =>
              console.error("Failed to open tfare payment link:", err?.message)
            );
            return;
          }
        }

        if (code && code == 400) {
          alert(msg);

          dispatch(
            setState({
              key: "riderRideDetails",
              value: returnedData?.riderRide,
            })
          );
          dispatch(
            setState({
              key: "selectedAvailableRide",
              value: returnedData?.currentRide,
            })
          );
          dispatch(
            setState({ key: "driverDetails", value: returnedData?.driver })
          );
          router.setParams({ requestId: returnedData?.riderRide?._id });

          if (status === "started") {
            showBottomSheet([500], <TripStartedSheet />);
            router.setParams({ ...searchParams, query: "RideStarted" });
            router.push(
              `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${returnedData?.riderRide?._id}`
            );
          }
          if (status === "ended") {
            showBottomSheet([500], <TripCompletedSheet />, true);
            router.setParams({ query: "RideEnded" });
          }
          if (status === "booked") {
            router.setParams({ ...searchParams, query: "RideBooked" });
            dispatch(
              setState({
                key: "sameTickets",
                value: [returnedData?.ticketPaid],
              })
            );
            router.push(
              `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${returnedData?.riderRide?._id}`
            );
            showBottomSheet(
              [800],
              <RideBookedSheet rideId={returnedData?.riderRide?._id} />,
              true
            );
          }

          // const rides = [returnedData?.ticketUnderBooking];
          // if (rides) {
          //   setFetchState((prev) => ({ ...prev, rides: rides as any }));
          // }
        }
      } catch (error: any) {
        console.log({ error });

        setFetchState((prev) => ({
          ...prev,
          loading: false,
          msg: error?.message,
        }));
      }
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

  useEffect(() => {
    if (query === RideConstants.query.RecentLocationsSnippet)
      showBottomSheet([601], <RecentLocationsSnippet />, true);
    if (query === RideConstants.query.RecentPickupLocations)
      showBottomSheet([508], <RecentPickupLocations />, true);
    if (query === RideConstants.query.RecentDropoffLocations)
      showBottomSheet([508], <RecentDropoffLocations />, true);
    if (query === RideConstants.query.FilledForm)
      showBottomSheet([436, 601], <FilledForm />, true);
    if (query === RideConstants.query.RideRouteDetails)
      showBottomSheet([477, 601], <RideRouteDetails />, true);
    if (query === RideConstants.query.SearchingRide)
      showBottomSheet(
        [400],
        <SearchingRide riderCounterOffer={riderCounterOffer as string} />,
        true
      );
    if (query === RideConstants.query.RideBooked)
      showBottomSheet(
        [800],
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

  useEffect(() => {
    if (riderRideDetails && searchParams)
      router.setParams({ ...searchParams, requestId: riderRideDetails?._id });
  }, [riderRideDetails]);

  useEffect(() => {
    if (selectedAvailableRide && searchParams)
      router.setParams({
        ...searchParams,
        selectedAvailableRideId: selectedAvailableRide?._id,
      });
  }, [selectedAvailableRide]);

  return (
    <View style={tw`w-full h-full flex flex-col relative`}>
      {/* Shows when all the tickets have been filled (counter fare are optional) */}
      {/* Buy Ticket Btn */}

      {(booking || allTicketsFilled) && path === "/bookRide" && (
        <View
          style={[
            tw`w-full absolute bottom-[30px] left-[0] p-2`,
            { zIndex: 100000000, opacity: allTicketsFilled ? 1 : 0.5 },
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

      {/* Loading Spinner */}
      {loading && (
        <View
          style={[
            tw`w-full h-[35px] flex items-center justify-center absolute top-1/2 z-10`,
            { zIndex: 100000000 },
          ]}
        >
          <ActivityIndicator />
        </View>
      )}
      {/* Loading Spinner */}

      <Stack
        screenOptions={{
          animation: "slide_from_left",
          headerShown: false,
        }}
      >
        <Stack.Screen name={pages.orderRide} />
        <Stack.Screen name={pages.availableRides} />
        <Stack.Screen name={"bookRide"} />
        <Stack.Screen name={`${pages.paymentOptions}`} />
      </Stack>
    </View>
  );
}
