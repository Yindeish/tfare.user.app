import {
  Href,
  Redirect,
  Stack,
  Tabs,
  useGlobalSearchParams,
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

export default function AppLayout() {
  const { userSession, isLoading } = useSession();
  const {
    booking,
    allTicketsFilled,
    currentNumberOfTickets,
    userRide,
    riderRideDetails,
    stateInput: { userRideInput, paymentOptionInput },
  } = useAppSelector((state: RootState) => state.ride);
  const { token } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const { showBottomSheet } = useBottomSheet();
  const searchParams = useGlobalSearchParams();
  const { selectedAvailableRideId } = useGlobalSearchParams();
  const { notify, Snackbar, closeSnackbar, snackbarVisible } = useSnackbar();

  const { width, height } = Dimensions.get("window");

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { loading, msg } = fetchState;

  const buyTickets = async () => {
    if (!allTicketsFilled) return;

    const sameTickets = userRideInput?.tickets?.every(
      (ticket) => ticket?.sameAsFirstTicket === true
    );

    setFetchState((prev) => ({ ...prev, loading: true }));

    if (sameTickets) {
      try {
        const returnedData = await FetchService.postWithBearerToken({
          data: {
            numberOfTickets: Number(currentNumberOfTickets),
            requestId: riderRideDetails?._id,
            paymentOption: paymentOptionInput,
          },
          token: token as string,
          url: `/user/rider/me/ride/${selectedAvailableRideId}/book`,
        });

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
        // Toast.show({
        //   type: "info",
        //   text1: returnedData?.msg,
        //   position: "bottom",
        // });
        const code = returnedData?.code;
        const msg = returnedData?.msg;
        const ticketPaid = returnedData?.ticketPaid;
        const ticketBooked = returnedData?.ticketBooked;
        const paymentLink = returnedData?.paymentLink;
        console.log({ returnedData, paymentLink });

        if (code && (code != 200 || code != 201)) {
          notify({ msg: returnedData?.msg });
          setFetchState((prev) => ({ ...prev, msg: msg }));
          // return;

          if (ticketPaid) {
            dispatch(setState({key:'sameTickets', value: ticketPaid}))
            // dispatch(setPaymentOptionsVisible(true));
            showBottomSheet(
              [800],
              <RideBookedSheet rideId={selectedAvailableRideId as string} />, true
            );
            return;
          }
          if (ticketBooked && paymentLink) {
            dispatch(setState({key:'sameTickets', value: ticketBooked}))
            openURL(paymentLink).catch((err: any) => console.error('Failed to open tfare payment link:', err?.message));
            return;
          }
        }

        // const rides = [returnedData?.ticketUnderBooking];
        // if (rides) {
        //   setFetchState((prev) => ({ ...prev, rides: rides as any }));
        // }
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
    console.log('riderRideDetails changed', {riderRideDetails});

    if(riderRideDetails && searchParams) router.setParams({...searchParams, requestId: riderRideDetails?._id});
  }, [riderRideDetails])

  return (
    <View style={tw`w-full h-full flex flex-col relative`}>
      {/* Shows when all the tickets have been filled (counter fare are optional) */}
      {/* Buy Ticket Btn */}

      {(booking || allTicketsFilled) && (
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

      {loading && (
        <View
          style={tw`w-full h-[35px] flex items-center justify-center absolute top-1/2 z-10`}
        >
          <ActivityIndicator />
        </View>
      )}

      {/* Buy Ticket Btn */}
      <Stack
        screenOptions={{
          animation: "slide_from_left",
          headerShown: false,
        }}
      >
        <Stack.Screen name={pages.orderRide} />
        <Stack.Screen name={pages.availableRides} />
        <Stack.Screen name={"bookRide"} />
        {/* <Stack.Screen name={`${pages.bookRide}/[rideId]`} /> */}
        {/* <Stack.Screen name={`${pages.rideBooked}/[rideId]`} /> */}
        {/* <Stack.Screen name={`${pages.buyTicket}/[rideId]`} /> */}
        {/* <Stack.Screen name={`${pages.chat}/[rideId]`} /> */}
        {/* <Stack.Screen name={`(sharedScreens)/${pages.driverProfile}/[rideId]`} /> */}
        <Stack.Screen name={`${pages.paymentOptions}`} />
        {/* <Stack.Screen name={`${pages.rideStarted}/[rideId]`} /> */}
      </Stack>

      <Snackbar
        msg={msg}
        onDismiss={() => closeSnackbar()}
        snackbarVisible={snackbarVisible}
      />
    </View>
  );
}
