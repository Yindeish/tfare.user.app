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
import { setCurrentRideView, setState, setUserRide } from "@/state/slices/ride";
import RideBlock from "@/components/page/rideBlock";
import RideSelectors from "@/state/selectors/ride";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { Href } from "expo-router";
import FetchService from "@/services/api/fetch.service";
import { IRideAccptedEvent } from "@/socket.io/socket.io.types";
import { EVENTS, socket } from "@/socket.io/socket.io.config";
import { useStorageState } from "@/hooks/useStorageState";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { ICurrentRide, IRide, IRiderRideDetails } from "@/state/types/ride";
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

export default function AvailableRide() {
  const dispatch = useAppDispatch();
  const {
    availableRides,
    stateInput: { pickupBusstopInput, dropoffBusstopInput },
  } = RideSelectors();
  const [[isLoading, session], setSession] = useStorageState("token");
  const { showBottomSheet, hideBottomSheet, bottomSheetType } =
    useBottomSheet();
    const searchParams = useGlobalSearchParams();
  const { query, requestId } = useGlobalSearchParams<{
    query?: string;
    riderCounterOffer?: string;
    requestId?: string;
  }>();
  const route = usePathname();
  console.log({ requestId });

  const channel = supabase.channel(`ride_accepting`);
  channel
    .on("broadcast", { event: "ride_accepted" }, (payload) => {
      const id = payload?.payload?.ride?._id;
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
    setFetchState((prev) => ({ ...prev, loading: true }));
    const returnedData = await FetchService.getWithBearerToken({
      url: `/user/rider/me/available-rides/${id || requestId}`,
      token: session as string,
    });

    const code = returnedData?.code;
    const msg = returnedData?.msg;
    const availableRidesRequests = returnedData?.availableRides;
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
        showBottomSheet([500], <TripStartedSheet />);
        router.setParams({ ...searchParams,query: "RideStarted", });
        router.push(
          `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${requestId}`
        );
      }
      if (status === "ended") {
        showBottomSheet([500], <TripCompletedSheet />, true);
        router.setParams({ query: "RideEnded"  });
        router.push(
          `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${requestId}`
        );
      }
      if (status === "booked") {
        router.setParams({...searchParams, query: 'RideBooked'});
        dispatch(setState({key:'sameTickets', value: returnedData?.ticketPaid}));
        console.log('====================================');
        console.log(returnedData?.ticketPaid);
        console.log('====================================');
        router.push(
          `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${requestId}`
        );
        showBottomSheet(
          [800],
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
                        setState({ key: "selectedAvailableRide", value: ride })
                      );
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
