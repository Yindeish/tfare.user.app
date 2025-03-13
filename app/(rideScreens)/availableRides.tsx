import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import PaddedScreen from "@/components/shared/paddedScreen";
import SafeScreen from "@/components/shared/safeScreen";
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
  mb,
  mt,
  p,
  pb,
  px,
  py,
  relative,
  rounded,
  w,
  wFull,
  wHFull,
} from "@/utils/styles";
import PageFloatingTitle from "@/components/page/pageFloatingTitle";
import {
  router,
  useGlobalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import Colors, { colors } from "@/constants/Colors";
import { pages } from "@/constants/pages";
import { setCurrentRideView, setState, setStateInputField, setUserRide } from "@/state/slices/ride";
import RideBlock from "@/components/page/rideBlock";
import RideSelectors from "@/state/selectors/ride";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { Href } from "expo-router";
import FetchService from "@/services/api/fetch.service";
import { IRideAccptedEvent } from "@/socket.io/socket.io.types";
import { EVENTS, socket } from "@/socket.io/socket.io.config";
import { useStorageState } from "@/hooks/useStorageState";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { IBusStop, ICurrentRide, IRide, IRiderRideDetails, ITicketInput } from "@/state/types/ride";
import {
  c,
  colorBlack,
  colorWhite,
  fs12,
  fs14,
  fs16,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { images } from "@/constants/images";
import { image } from "@/utils/imageStyles";
import { FontAwesome6 } from "@expo/vector-icons";
import { RefreshControl } from "react-native-gesture-handler";
import { RootState } from "@/state/store";
import { supabase } from "@/supabase/supabase.config";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { TripCompletedSheet, TripStartedSheet } from "@/components/page/tripStartedBottomSheetComponents";
import { RideBookedSheet } from "@/components/page/bookRideSheetComponent";
import { RideConstants } from "@/constants/ride";
import { useSession } from "@/contexts/userSignedInContext";

export default function AvailableRide() {
  const dispatch = useAppDispatch();
  const {
    availableRides,
    stateInput: { pickupBusstopInput, dropoffBusstopInput },
  } = RideSelectors();
  const [[isLoading, session], setSession] = useStorageState("token");
  const [[_$, userSession], __] = useStorageState('user');
  const user = JSON.parse(userSession as string);

  console.log({user});

  const { showBottomSheet, hideBottomSheet, bottomSheetType } =
    useBottomSheet();
    const searchParams = useGlobalSearchParams();
  const { requestId } = useGlobalSearchParams<{
    query?: string;
    riderCounterOffer?: string;
    requestId?: string;
  }>();
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  console.log({ requestId });

  const channel = supabase.channel(RideConstants.channel.ride_accepting);
  channel
    .on("broadcast", { event: RideConstants.event.ride_accepted}, (payload) => {
      const id = payload?.payload?.ride?._id;
      dispatch(setState({key:'riderRideDetails', value: payload?.payload?.ride}))
      id && getAvailableRides(id);
    })
    .subscribe();

  // useEffect(() => {
  //   if (!requestId) router.back();
  // }, []);

  useEffect(() => {
    hideBottomSheet();
  }, [query]);

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, msg, loading } = fetchState;

  const getAvailableRides = async (id?: string) => {
    if(!id && !requestId) {
      return;
    }
    setFetchState((prev) => ({ ...prev, loading: true }));
    const returnedData = await FetchService.getWithBearerToken({
      url: `/user/rider/me/available-rides/${id || requestId}`,
      token: session as string,
    });

    const code = returnedData?.code;
    const msg = returnedData?.msg;
    const availableRidesRequests = returnedData?.availableRides;
    const route = returnedData?.route;
    const status = returnedData?.status;

    setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

    if (code && code == 200 && availableRidesRequests) {
      setFetchState((prev) => ({
        ...prev,
        loading: false,
        msg: "",
        code: null,
      }));
      dispatch(
        setState({ key: "availableRides", value: availableRidesRequests })
      );
      dispatch(
        setState({ key: "currentRoute", value: route })
      );
    } 
    
    if (code && code == 400) {
      dispatch(
        setState({ key: "riderRideDetails", value: returnedData?.riderRide })
      );
      dispatch(
        setState({
          key: "selectedAvailableRide",
          value: returnedData?.currentRide,
        })
      );
      dispatch(setState({ key: "driverDetails", value: returnedData?.driver }));
      router.setParams({ requestId: returnedData?.riderRide?._id });

      if (status === "started") {
        // router.setParams({ ...searchParams,query: "RideStarted", });
        setQuery(RideConstants.query.RideStarted);
        showBottomSheet([100, 500], <TripStartedSheet />, true);
        router.push(
          `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${requestId}`
        );
      }
      if (status === "ended") {
        // router.setParams({ query: "RideEnded"  });
        setQuery(RideConstants.query.RideEnded)
        showBottomSheet([500], <TripCompletedSheet />, true);
        router.push(
          `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${requestId}`
        );
      }
      if (status === "booked") {
        // router.setParams({...searchParams, query: 'RideBooked'});
        setQuery(RideConstants.query.RideBooked)
        dispatch(setState({key:'sameTickets', value: [returnedData?.ticketPaid]}));
        console.log('====================================');
        console.log(returnedData?.ticketPaid);
        console.log('====================================');
        router.push(
          `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${requestId}`
        );
        showBottomSheet(
          [100, 800],
          <RideBookedSheet rideId={returnedData?.riderRide?._id} />,
          true
        );
      }
    }
  };

  useEffect(() => {
    if(requestId != null || requestId != 'undefined') getAvailableRides();
  }, [requestId])

  return (
    <SafeScreen>
      <ScrollView
        style={[wHFull, relative, { overflow: "scroll" }]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              getAvailableRides();
            }}
            tintColor={Colors.light.textGrey}
            colors={[Colors.light.textGrey]}
          />
        }
      >
        <PageFloatingTitle
          title="Available Rides"
          color={{ icon: Colors.light.textGrey, text: colors.black }}
          view
          onPress={() => {
            router.push(`/${pages.orderRide}` as Href);
            setCurrentRideView("availableRides");
          }}
        />

        <PaddedScreen>
          <View style={[wFull, mt(130), { overflow: "scroll" }]}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <View style={[wFull, flexCol, gap(26)]}>
                {availableRides.map((ride, index) => (
                  <RideBlock
                    bgColor="#F9F7F8"
                    ctaType="bookRide"
                    ride={ride}
                    touchable
                    roundedCorners
                    onPress={() => {
                      dispatch(
                        setState({ key: "currentRoute", value: (ride as any)?.route })
                      );
                      dispatch(
                        setState({ key: "selectedAvailableRide", value: ride })
                      );
                      const riderAcceptedRide = ride?.ridersRides.find((ride) => String(ride?.riderId) == String(user?._id));

                      const newTicket = {
                        number:1,
                        dropoffBusstop: riderAcceptedRide?.dropoffBusstop,
                        pickupBusstop: riderAcceptedRide?.pickupBusstop,
                        rideFee: Number(riderAcceptedRide?.riderCounterOffer) || Number(riderAcceptedRide?.ridePlan?.ride?.rideFee),
                        serviceFee: Number(riderAcceptedRide?.ridePlan?.serviceFee),
                        ticketStatus: 'accepted',
                        userCounterFare: Number(riderAcceptedRide?.riderCounterOffer),
                        sameAsFirstTicket: true,
                      };

                      const tickets = [newTicket] as ITicketInput[];

                      dispatch(setStateInputField({key: 'ticketsDetails', value: tickets}))
                      router.push(
                        `/(rideScreens)/bookRide?selectedAvailableRideId=${ride?._id}&requestId=${requestId}` as Href
                      );
                    }}
                    key={index}
                  />
                ))}
              </View>
            )}
          </View>
        </PaddedScreen>
      </ScrollView>
    </SafeScreen>
  );
}
