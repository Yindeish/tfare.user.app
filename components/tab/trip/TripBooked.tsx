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
  

const TripBookedSheet = () => {
    const {
        paidTickets,
        riderRideDetails,
        selectedAvailableRide,
        sameTickets,
        differentTickets,
        driverDetails,
        stateInput: { ticketsDetails },
      } = useAppSelector((state) => state.ride);
      const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
    
      const { hideBottomSheet, showBottomSheet } = useBottomSheet();
      const dispatch = useAppDispatch();
      const [location, setLocation] = useState<LocationObject | null>(
        null
      );
      const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
      async function getCurrentLocation() {
        if (Platform.OS === "android" && !isDevice) {
          setErrorMsg(
            "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
          );
          return;
        }
        let { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
    
        let location = await getCurrentPositionAsync({});
        setLocation(location);
      }
    
      const openMap = () => {
        getCurrentLocation();
        if (location) {
          const { latitude, longitude } = location.coords;
          const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
          openURL(url);
        }
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
        <BottomSheetScrollView style={[tw``]} contentContainerStyle={[tw`w-full`]}>
          <PaddedScreen>
            {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
            <View style={[{ flexDirection: "column", gap: 32, marginTop: 20 }, tw `pb-[15px]`]}>
              {/* Header Section */}
              <View
                style={[
                  { alignItems: "center", justifyContent: "center", gap: 10 },
                  tw`flex flex-row`,
                ]}
              >
                <Image
                  style={{ width: 30, height: 27 }}
                  source={images.greenBgCheckTripImage}
                />
                <Text
                  style={{
                    fontFamily: "NeurialGrotesk",
                    fontWeight: "700",
                    fontSize: 22,
                    color: colors.black,
                  }}
                >
                  Ride Booked
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "NeurialGrotesk",
                  fontWeight: "400",
                  fontSize: 12,
                  color: Colors.light.textGrey,
                  marginHorizontal: "auto",
                }}
              >
                Your Trip has been successfully booked
              </Text>
    
              {/* Ride Block */}
              <RideBlock
                ride={selectedAvailableRide as ICurrentRide}
                bgColor="#FFF7E6"
                ctaType="trackRide"
                touchable
                roundedCorners={false}
                onPress={openMap}
              />
    
              {/* Driver Block */}
              <TouchableOpacity
                onPress={() => {
                  hideBottomSheet();
    
                  router.push(`/(sharedScreens)/driverProfile` as Href);
                  setTimeout(() => showBottomSheet(
                    [100, 400, 800],
                    <RideBookedSheet rideId={''} />,
                    true
                  ), 500);
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
                  tw `py-[15px]`
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
    
                      <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
                        5.0
                      </Text>
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
              {/* Driver Block */}
    
              {/* Ticket Details */}
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  gap: 16,
                  paddingBottom: 16,
                  borderBottomWidth: 0.7,
                  borderBottomColor: Colors.light.border,
                }}
              >
                <BuyTicketListTile
                  leadingText="Trip ID"
                  trailing={{
                    text: selectedAvailableRide?._id as string,
                    icon: true,
                  }}
                />
                {ticketsDetails?.map((ticket, index) => (
                  <BuyTicketListTile
                    leadingText={`Ticket ${ticket?.number} code`}
                    trailing={{
                      text: ticket?.ticketOtp
                        ? String(ticket?.ticketOtp)
                        : String(ticket?.rideId?.slice(-4)),
                      icon: true,
                    }}
                    key={index}
                  />
                ))}
              </View>
    
              {/* CTA Buttons */}
              <View style={{ width: "100%", flexDirection: "column", gap: 16 }}>
                <CtaBtn
                  img={{ src: images.redBgCautionImage }}
                  onPress={() => {
                    hideBottomSheet();
                   
                    router.replace("/(rideScreens)/tripDetails");
                    setTimeout(() => showBottomSheet(
                      [100, 400, 800],
                      <RideBookedSheet rideId={''} />,
                      true
                    ), 500);
                  }}
                  text={{ name: "View Trip Details" }}
                  bg={{ color: Colors.light.background }}
                />
                <CtaBtn
                  img={{ src: images.cancelImage }}
                  onPress={() => {}}
                  text={{ name: "Cancel Order", color: Colors.light.textGrey }}
                  bg={{ color: "#F9F7F8", borderColor: Colors.light.border }}
                />
              </View>
            </View>
          </PaddedScreen>
        </BottomSheetScrollView>
      );
}
 
export default TripBookedSheet;