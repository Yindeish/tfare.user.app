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
import BookSeatSheet from "@/components/page/bookSeatSheet";

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

  console.log("====================================");
  console.log({ query });
  console.log("====================================");

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { loading, msg } = fetchState;

  const buyTickets = async () => {
    setQuery(RideConstants.query.RideBooked)
    showBottomSheet([700], <BookSeatSheet />)
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

      <View
        style={[
          tw`w-full absolute bottom-[30px] left-[0] p-2`,
          { zIndex: 100000000, 
            // opacity: allTicketsFilled ? 1 : 0.5 
          },
        ]}
      >
        <Snackbar
          msg={msg}
          onDismiss={() => closeSnackbar()}
          snackbarVisible={snackbarVisible}
        />
        <CtaBtn
          img={{ src: images.whiteBgTripImage, w: 20, h: 20 }}
          onPress={buyTickets}
          text={{ name: "Book Seat", color: colors.white }}
          bg={{ color: Colors.light.background }}
          style={{
            container: {
              width: "90%",
              marginLeft: "5%",
              marginTop: 10,
              marginBottom: 30,
            },
          }}
        />
      </View>
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
        <Stack.Screen name={"bookTrip"} />
        <Stack.Screen name={"bookTripDetails"} />
        <Stack.Screen name={"paymentOption"} />
        <Stack.Screen name={"tripDetails"} />
        <Stack.Screen name={"tripMap"} />
      </Stack>
    </View>
  );
}
