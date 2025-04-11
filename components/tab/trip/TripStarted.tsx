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
    Platform,
    ViewStyle,
  } from "react-native";
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
    flexCol,
    gap,
    h,
    itemsCenter,
    itemsStart,
    justifyCenter,
    justifyStart,
    l,
    mb,
    mt,
    rounded,
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
  import BookSeatSheet from "@/components/page/bookSeatSheet";
  import DriverCTATile from "@/components/tab/trip/driverCTATile";
  import { c, colorBlack, fs12, fs14, fs16, fw400, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { getCurrentPositionAsync, LocationObject, requestForegroundPermissionsAsync } from "expo-location";
import { isDevice } from "expo-device";
import { RealtimeChannel } from "@supabase/supabase-js";
import { ITicketInput } from "@/state/types/trip";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import PaddedScreen from "@/components/shared/paddedScreen";
import RideBlock from "@/components/page/rideBlock";
import { ICurrentRide } from "@/state/types/ride";
import { image, mXAuto } from "@/utils/imageStyles";
import BuyTicketListTile from "@/components/page/buyTicketListTile";
import { supabase } from "@/supabase/supabase.config";
import TripCompletedSheet from "./TripCompleted";
import CancelRide from "./cancelTrip";


  const TripStartedSheet = () => {
    const { showBottomSheet, hideBottomSheet } = useBottomSheet();
    const { riderRideDetails, driverDetails, currentTrip,ticketsInputs } =
      useAppSelector((state: RootState) => state.trip);
    const { token } = useAppSelector((state: RootState) => state.user);
    const { notify, Snackbar, snackbarVisible, closeSnackbar } = useSnackbar();
    const searchParams = useGlobalSearchParams();
    const { requestId } = useGlobalSearchParams();
    const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  
    const [fetchState, setFetchState] = useState<{
      loading: boolean;
      code: number | null;
      msg: string;
    }>({
      loading: false,
      code: null,
      msg: "",
    });
    const { loading, code, msg } = fetchState;
  
    const commitSafetyAlert = async () => {
      setFetchState({ ...fetchState, loading: true });
      await FetchService.postWithBearerToken({
        url: `/user/rider/me/trip/${currentTrip?._id}/commit-safety-alert`,
        token: token,
      })
        .then(async (res) => {
          setFetchState({ ...fetchState, loading: false });
          console.log({ res });
  
          const data = res?.body ? await res.json() : res;
          const code = data?.code;
          const msg = data?.msg;
  
          setFetchState({ ...fetchState, code, msg });
        })
        .catch((err: any) => {
          setFetchState({ ...fetchState, loading: false });
          console.log({ err });
          notify({ msg: err?.message });
        });
    };
  
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
        const channelName = `${RideConstants.channel.ride_ending}${ride.rideId}`;
        console.log(`Listening to ride: ${channelName}`);
  
        const channel = supabase.channel(channelName);
  
        channel
          .on(
            "broadcast",
            { event: RideConstants.event.ride_ended },
            (payload) => {
              console.log(`Ride ended for ${ride.rideId}`, payload);
              if (query == RideConstants.query.RideStarted) {
                setQuery(RideConstants.query.RideEnded);
                showBottomSheet([100, 650], <TripCompletedSheet />, true);
              }
            }
          )
          .subscribe();
  
        activeChannels.push(channel); // Store the active channels
      });
    }
  
    listenToAllRides(ticketsInputs);
  
    return (
      <PaddedScreen>
        <View style={[flexCol, gap(32), mt(20), tw`w-full`]}>
          <PaddedScreen>
            <View style={[flexCol, gap(20), tw`items-center`]}>
              <View style={[wFull, flex, gap(10), itemsCenter, justifyCenter]}>
                <Image
                  style={[image.w(30), image.h(27)]}
                  source={images.tripChargeImage}
                />
  
                <Text
                  style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}
                >
                  Trip Started
                </Text>
              </View>
  
              {/* <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Driver has started the trip. You should arrive in 15 minutes</Text> */}
              <Text
                style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}
              >
                Driver has started the trip. You should soon
              </Text>
            </View>
          </PaddedScreen>
  
          {/* Driver block */}
  
          <TouchableOpacity
            onPress={() => {
              hideBottomSheet();
  
              router.push(
                `/(sharedScreens)/driverProfile?currentRideId=${riderRideDetails?.currentRideId})` as Href
              )
              setTimeout(() => showBottomSheet([100, 500], <TripStartedSheet />, true), 500);
            }}
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
              source={{ uri: driverDetails?.picture }}
              style={[image.w(70), image.h(70), image.rounded(70)]}
            />
  
            <View style={[flexCol, itemsStart, gap(20)]}>
              <Text style={[fw700, fs16, colorBlack]}>
                {driverDetails?.fullName}
              </Text>
  
              <View style={[flex, gap(32), itemsCenter, mXAuto] as ViewStyle[]}>
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
                    {driverDetails?.driverProfile?.vehicle?.plateNumber}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
  
          {/* Driver block */}
  
          {!loading ? (
            <CtaBtn
              img={{
                src: images.redBgCautionImage,
              }}
              onPress={() => commitSafetyAlert()}
              text={{ name: "Safety Alert" }}
              bg={{ color: Colors.light.error }}
            />
          ) : (
            <ActivityIndicator size={"small"} />
          )}
  
          <CtaBtn
            img={{
              src: images.cancelImage,
            }}
            onPress={() => {
              // showBottomSheet([660], <CancelRide />);
            }}
            text={{ name: "Cancel Order", color: Colors.light.textGrey }}
            bg={{ color: "#F9F7F8", borderColor: Colors.light.border }}
          />
        </View>
        <Text style={tw`text-black text-[10px] mt-3`}>{msg}</Text>
      </PaddedScreen>
    );
  }
   
  export default TripStartedSheet;
  