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
import { FontAwesome, Ionicons } from "@expo/vector-icons";
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
  flex,
  flexCenter,
  gap,
  h,
  itemsCenter,
  justifyStart,
  l,
  mb,
  wFull,
  zIndex,
} from "@/utils/styles";
import CtaBtn from "@/components/shared/ctaBtn";
import { indices } from "@/constants/zIndices";
import Toast from "react-native-toast-message";
import FetchService from "@/services/api/fetch.service";
import { ActivityIndicator } from "react-native";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useSnackbar } from "@/contexts/snackbar.context";
import { openURL } from "expo-linking";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";
import DriverCTATile from "@/components/tab/trip/driverCTATile";
import { colorBlack, fs16, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { setTripState } from "@/state/slices/trip";
import TripBookedSheet from "@/components/tab/trip/TripBooked";
import TripStartedSheet from "@/components/tab/trip/TripStarted";
import TripCompletedSheet from "@/components/tab/trip/TripCompleted";
import { IRiderRideDetails, ITicket } from "@/state/types/ride";

export default function AppLayout() {
  const { userSession, isLoading } = useSession();
  const {
    booking,
    allTicketsFilled,
    currentNumberOfTickets,
    userTrip,
    selectedAvailableTrip,
    riderRideDetails,
    stateInput: { userRideInput, paymentOptionInput },
  } = useAppSelector((state: RootState) => state.trip);
  const { token } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const { showBottomSheet } = useBottomSheet();
  const searchParams = useGlobalSearchParams();
  const { selectedAvailableTripId, requestId } = useGlobalSearchParams();
  const path = usePathname();
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  const { riderCounterOffer } = useGlobalSearchParams<{
    query?: string;
    riderCounterOffer?: string;
  }>();
  const { Snackbar, snackbarVisible, closeSnackbar, notify } = useSnackbar();
  const { ticketsInputs, currentTrip, route } = useAppSelector((state: RootState) => state.trip);

  console.log("====================================");
  console.log({ query });
  console.log("====================================");

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { loading, msg } = fetchState;

  const someTicketsUnderNegotiation = ticketsInputs?.find(
    (ticket) => ticket?.ticketStatus == "pending"
  );

  const buyTickets = async () => {
    if (!allTicketsFilled || someTicketsUnderNegotiation) return;

    const sameTickets = ticketsInputs?.every(
      (ticket) => ticket?.sameAsFirstTicket === true
    );

    setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

    if (sameTickets) {
      const firstTicket = ticketsInputs?.find((ticketItem) => Number(ticketItem?.number) == 1);

      try {
        const returnedData = await FetchService.postWithBearerToken({
          data: {
            numberOfTickets: Number(ticketsInputs?.length),
            requestId: firstTicket?.rideId,
            paymentOption: paymentOptionInput,
          },
          token: token as string,
          url: `/user/rider/me/ride/${currentTrip?._id}/book`,
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
        const trip = returnedData?.currentTrip;

        let ticket = ticketPaid || ticketBooked || bookedTicket;

        const riderRideDetailsId = String(ticket?.ride?.riderRideDetailsId);

        let tickets = ticketsInputs?.map((ticketInput) =>
          String(ticketInput?.rideId) === riderRideDetailsId
            ? {
                ...ticketInput,
                ticketOtp: ticket.ticketOtp,
                ticketStatus: ticket.ticketStatus,
              }
            : ticketInput
        );

        dispatch(setTripState({ key: "ticketsInputs", value: tickets }));
        dispatch(
          setTripState({ key: "currentTrip", value: trip })
        );

        if (code && (code == 200 || code == 201)) {
          if (ticketPaid) {

            if (riderRide)
              dispatch(
                setTripState({
                  key: "riderRideDetails",
                  value: returnedData?.riderRide,
                })
              );
            if (currentTrip)
              dispatch(
                setTripState({
                  key: "currentTrip",
                  value: returnedData?.currentTrip,
                })
              );
            if (driver)
              dispatch(
                setTripState({ key: "driverDetails", value: returnedData?.driver })
              );
            setQuery(RideConstants.query.RideBooked);
            showBottomSheet(
              [100, 400, 800],
              <TripBookedSheet />,
              true
            );
            router.replace("/(tripScreen)/tripMap" as Href);
            return;
          }

          if ((ticketBooked && paymentLink) || (bookedTicket && paymentLink)) {
            openURL(paymentLink).catch((err: any) =>
              console.error("Failed to open tfare payment link:", err?.message)
            );
            return;
          }
        }

        if (code && code == 400) {
          alert(msg);

          dispatch(
            setTripState({
              key: "riderRideDetails",
              value: returnedData?.riderRide,
            })
          );
          dispatch(
            setTripState({
              key: "currentTrip",
              value: returnedData?.currentTrip,
            })
          );
          dispatch(
            setTripState({ key: "driverDetails", value: returnedData?.driver })
          );

          if (status === "started") {
            setQuery(RideConstants.query.RideStarted);
            router.replace("/(tripScreen)/tripMap" as Href);
            showBottomSheet([100, 500], <TripStartedSheet />, true);
            return;
          }
          if (status === "ended") {
            setQuery(RideConstants.query.RideEnded);
            showBottomSheet([500], <TripCompletedSheet />, true);
            return
          }
          if (status === "booked") {
            setQuery(RideConstants.query.RideBooked);
            showBottomSheet(
              [100, 400, 800],
              <TripBookedSheet />,
              true
            );
            router.replace("/rideMap" as Href);
            return;
          }
        }

        else {
          notify({ msg });
        }
      } catch (error: any) {
        console.log({ error });

        setFetchState((prev) => ({
          ...prev,
          loading: false,
          msg: error?.message,
        }));
      }
      return;
    } else {
      const unnegotiatedTickets = ticketsInputs?.filter(
        (ticket) => ticket?.ticketStatus == "idle"
        //  || ticket?.ticketStatus == "declined" // We don't want to include declined tickets
      );

      if (unnegotiatedTickets.length > 0) {
        const ticketsAsFirstTicket = ticketsInputs
        ?.filter((ticketItem) => ticketItem?.sameAsFirstTicket == true)
        ?.map((ticketItem) => {
          const unitFare = route?.unitFares?.find(
            (unitFare) =>
              String(unitFare?.pickupBusstopId) == String(ticketItem?.pickupBusstop?._id) &&
              String(unitFare?.dropoffBusstopId) == String(ticketItem?.dropoffBusstop?._id)
          );
      
          return {...ticketItem, unitFare}
        });

        const returnedData = await FetchService.postWithBearerToken({
          data: {
            unitFaresIds: [
              ...unnegotiatedTickets?.map((ticket) =>
              String(ticket?.unitFare?._id)),
              ...ticketsAsFirstTicket?.map((ticket) =>
              String(ticket?.unitFare?._id)),
            ],
            paymentOption: paymentOptionInput,
          },
          token: token as string,
          url: `/user/rider/me/ride/${currentTrip?._id}/book-unlike`,
        });

        setFetchState((prev) => ({
          ...prev,
          loading: false,
          code: null,
          msg: "",
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
        const riderRides = returnedData?.riderRides as IRiderRideDetails[];
        const trip = returnedData?.currentTrip;

        let ticketsArray = ticketPaid || ticketBooked || bookedTicket;

        let tickets = riderRides
          ?.filter((riderRideItem) => {
            const hasTicket = (ticketsArray as ITicket[])?.find(
              (ticketItem) =>
                String(ticketItem?.ride?.riderRideDetailsId) ==
                String(riderRideItem?._id)
            );
            return hasTicket && riderRideItem?.rideStatus == "booked";
          })
          .map((riderRideItem, index) => {
            const matchTicket = (ticketsArray as ITicket[])?.find(
              (ticketItem) =>
                String(ticketItem?.ride?.riderRideDetailsId) ==
                String(riderRideItem?._id)
            );

            if (matchTicket && riderRideItem?.rideStatus == "booked") {
              return {
                number: index + 1,
                ticketOtp: matchTicket?.ticketOtp,
                dropoffBusstop: riderRideItem?.dropoffBusstop,
                id: String(index + 1),
                pickupBusstop: riderRideItem?.pickupBusstop,
                quantity: matchTicket?.quantity,
                rideFee: riderRideItem?.ridePlan?.ride?.rideFee,
                rideId: riderRideItem?._id,
                sameAsFirstTicket: false,
                serviceFee: riderRideItem?.ridePlan?.serviceFee,
                ticketStatus: matchTicket?.ticketStatus,
                userCounterFare: riderRideItem?.riderCounterOffer,
              };
            } else return null;
          });

        dispatch(setTripState({ key: "ticketsInputs", value: tickets }));
        dispatch(
          setTripState({ key: "currentTrip", value: trip })
        );
        if (code && (code == 200 || code == 201)) {
          if (ticketPaid) {
            if (riderRide)
              dispatch(
                setTripState({
                  key: "riderRideDetails",
                  value: returnedData?.riderRide,
                })
              );
            if (trip)
              dispatch(
                setTripState({
                  key: "currentTrip",
                  value: returnedData?.currentTrip,
                })
              );
            if (driver)
              dispatch(
                setTripState({ key: "driverDetails", value: returnedData?.driver })
              );
            setQuery(RideConstants.query.RideBooked);
            showBottomSheet(
              [100, 400, 800],
              <TripBookedSheet />,
              true
            );
            router.replace("/(tripScreen)/tripMap" as Href);
            return;
          }

          if ((ticketBooked && paymentLink) || (bookedTicket && paymentLink)) {
            const sameTickets = ticketBooked || bookedTicket;

            dispatch(setTripState({ key: "sameTickets", value: sameTickets }));
            openURL(paymentLink).catch((err: any) =>
              console.error("Failed to open tfare payment link:", err?.message)
            );
            return;
          }
        }

        if (code && code == 400) {
          alert(msg);

          dispatch(
            setTripState({
              key: "riderRideDetails",
              value: returnedData?.riderRide,
            })
          );
          dispatch(
            setTripState({
              key: "currentTrip",
              value: returnedData?.currentTrip,
            })
          );
          dispatch(
            setTripState({ key: "driverDetails", value: returnedData?.driver })
          );
          router.setParams({ requestId: returnedData?.riderRide?._id });

          if (status === "started") {
            // router.setParams({ ...searchParams, query: "RideStarted" });
            setQuery(RideConstants.query.RideStarted);
            // router.push(
            //   `/(rideScreens)/bookRide?selectedAvailableTripId=${returnedData?.riderRide?.currentRideId}&requestId=${returnedData?.riderRide?._id}`
            // );
            router.replace("/rideMap" as Href);
            showBottomSheet([100, 500], <TripStartedSheet />, true);
            return;
          }
          if (status === "ended") {
            // router.setParams({ query: "RideEnded" });
            setQuery(RideConstants.query.RideEnded);
            showBottomSheet([500], <TripCompletedSheet />, true);
            return;
          }
          if (status === "booked") {
            setQuery(RideConstants.query.RideBooked);
            showBottomSheet(
              [100, 400, 800],
              <TripBookedSheet />,
              true
            );
            router.replace("/rideMap" as Href);
            return;
          }
        }

        else {
          notify({ msg });
        }

        return;
      }

      console.log({ticketsInputs, diff: 'diff'})

      const returnedData = await FetchService.postWithBearerToken({
        data: {
          paymentOption: paymentOptionInput,
        },
        token: token as string,
        url: `/user/rider/me/ride/${currentTrip?._id}/book-unlike`,
      });

      setFetchState((prev) => ({
        ...prev,
        loading: false,
        code: null,
        msg: "",
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
      const riderRides = returnedData?.riderRides as IRiderRideDetails[];
      const trip = returnedData?.currentTrip;

      let ticketsArray = ticketPaid || ticketBooked || bookedTicket;

      let tickets = riderRides
        ?.filter((riderRideItem) => {
          const hasTicket = (ticketsArray as ITicket[])?.find(
            (ticketItem) =>
              String(ticketItem?.ride?.riderRideDetailsId) ==
              String(riderRideItem?._id)
          );
          return hasTicket && riderRideItem?.rideStatus == "booked";
        })
        .map((riderRideItem, index) => {
          const matchTicket = (ticketsArray as ITicket[])?.find(
            (ticketItem) =>
              String(ticketItem?.ride?.riderRideDetailsId) ==
              String(riderRideItem?._id)
          );

          if (matchTicket && riderRideItem?.rideStatus == "booked") {
            return {
              number: index + 1,
              ticketOtp: matchTicket?.ticketOtp,
              dropoffBusstop: riderRideItem?.dropoffBusstop,
              id: String(index + 1),
              pickupBusstop: riderRideItem?.pickupBusstop,
              quantity: matchTicket?.quantity,
              rideFee: riderRideItem?.ridePlan?.ride?.rideFee,
              rideId: riderRideItem?._id,
              sameAsFirstTicket: false,
              serviceFee: riderRideItem?.ridePlan?.serviceFee,
              ticketStatus: matchTicket?.ticketStatus,
              userCounterFare: riderRideItem?.riderCounterOffer,
            };
          } else return null;
        });

      dispatch(setTripState({ key: "ticketsInputs", value: tickets }));
      dispatch(
        setTripState({ key: "currentTrip", value: currentTrip })
      );
      if (code && (code == 200 || code == 201)) {
        if (ticketPaid) {
          if (riderRide)
            dispatch(
              setTripState({
                key: "riderRideDetails",
                value: returnedData?.riderRide,
              })
            );
          if (currentTrip)
            dispatch(
              setTripState({
                key: "currentTrip",
                value: returnedData?.currentTrip,
              })
            );
          if (driver)
            dispatch(
              setTripState({ key: "driverDetails", value: returnedData?.driver })
            );
          setQuery(RideConstants.query.RideBooked);
          showBottomSheet(
            [100, 400, 800],
            <TripBookedSheet />,
            true
          );
          router.replace("/(tripScreen)/tripMap" as Href);
          return;
        }

        if ((ticketBooked && paymentLink) || (bookedTicket && paymentLink)) {
          openURL(paymentLink).catch((err: any) =>
            console.error("Failed to open tfare payment link:", err?.message)
          );
          return;
        }
      }

      if (code && code == 400) {
        alert(msg);

        dispatch(
          setTripState({
            key: "riderRideDetails",
            value: returnedData?.riderRide,
          })
        );
        dispatch(
          setTripState({
            key: "currentTrip",
            value: returnedData?.currentTrip,
          })
        );
        dispatch(
          setTripState({ key: "driverDetails", value: returnedData?.driver })
        );
        router.setParams({ requestId: returnedData?.riderRide?._id });

        if (status === "started") {
          setQuery(RideConstants.query.RideStarted);
          router.replace("/(tripScreen)/tripMap" as Href);
          showBottomSheet([100, 500], <TripStartedSheet />, true);
          return;
        }
        if (status === "ended") {
          setQuery(RideConstants.query.RideEnded);
          showBottomSheet([500], <TripCompletedSheet />, true);
          return;
        }
        if (status === "booked") {
          setQuery(RideConstants.query.RideBooked);
        
          showBottomSheet(
            [100,400, 800],
            <TripBookedSheet />,
            true
          );
          return;
        }
      }
      else {
        notify({ msg });
      }
    }
  };

  useEffect(() => {
    if (riderRideDetails && searchParams)
      router.setParams({ ...searchParams, requestId: riderRideDetails?._id });
  }, [riderRideDetails]);

  useEffect(() => {
    if (selectedAvailableTrip && searchParams)
      router.setParams({
        ...searchParams,
        selectedAvailableTripId: selectedAvailableTrip?._id,
      });
  }, [selectedAvailableTrip]);

  return (
    <View style={tw`w-full h-full flex flex-col relative`}>
      {/* Shows when all the tickets have been filled (counter fare are optional) */}
      {/* Buy Ticket Btn */}
      {
      (booking || allTicketsFilled) &&
        !someTicketsUnderNegotiation &&
        path === "/bookTrip" && (
          <View
            style={[
              tw`w-full absolute bottom-[30px] left-[0] px-[20px]`,
              { zIndex: 100000000 },
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

      {/* Book Seat Btn */}
      {ticketsInputs.length == 0 && path === "/bookTripDetails" && (
        <View
          style={[
            tw`w-full absolute bottom-[30px] left-[0] px-[20px]`,
            { zIndex: 100000000 },
          ]}
        >
          <CtaBtn
            img={{
              src: images.whiteBgTripImage,
              w: 22,
              h: 20,
            }}
            onPress={() => {
              router.push('/(tripScreen)/bookTrip')
            }}
            text={{
              name: "Book Seat",
              color: colors.white,
            }}
            bg={{
              color: Colors.light.background,
            }}
          />
        </View>
      )}
      {/* Book Seat Btn */}

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
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name={"bookTrip"}
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <View
              style={[
                h(20),
                bg(colors.transparent),
                flex,
                justifyStart,
                itemsCenter,
                gap(10),
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  // router.back();
                  router.push('/(tripScreen)/bookTripDetails')
                }}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={Colors.light.textGrey}
                />
              </TouchableOpacity>

              <Text style={[colorBlack, fs16, fw700, neurialGrotesk]}>
              Book Trip
              </Text>
            </View>
          ),
        }}
        />
        <Stack.Screen
          name={"bookTripDetails"}
          options={{
            headerShown: true,
            headerTitle: '',
            headerLeft: () => (
              <View
                style={[
                  h(20),
                  bg(colors.transparent),
                  flex,
                  justifyStart,
                  itemsCenter,
                  gap(10),
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    // router.back();
                    router.push('/(tab)/trip')
                  }}
                >
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color={Colors.light.textGrey}
                  />
                </TouchableOpacity>

                <Text style={[colorBlack, fs16, fw700, neurialGrotesk]}>
                  Trip Details
                </Text>
              </View>
            ),
            headerRight: () => <DriverCTATile />,
          }}
        />
        <Stack.Screen name={"paymentOption"} />
        <Stack.Screen name={"tripDetails"} />
        <Stack.Screen name={"tripMap"} />
      </Stack>
    </View>
  );
}
