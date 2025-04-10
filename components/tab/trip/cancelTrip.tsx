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
  TextInput,
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
  hFull,
  itemsCenter,
  itemsStart,
  justifyCenter,
  justifyStart,
  l,
  mb,
  pb,
  px,
  py,
  rounded,
  w,
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
import {
  c,
  colorBlack,
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
import {
  getCurrentPositionAsync,
  LocationObject,
  requestForegroundPermissionsAsync,
} from "expo-location";
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
import { cancelRideReasons } from "@/constants/cancelRideReasons";
import RadioBtnListTile from "@/components/page/RadioBtnListTile";
import { setStateInputField } from "@/state/slices/trip";
import { closeModal } from "@/state/slices/layout";

export default function CancelRide() {
  const dispatch = useAppDispatch();
  const {
    stateInput: { driverRatingCommentInput, cancelRideReasonInput },
  } = useAppSelector((state: RootState) => state.trip);

  let [commentBoxShowable, setCommentBoxShowable] = useState(false);

  // Updating the bottom Modal
  useEffect(() => {
    if (
      cancelRideReasonInput.toLowerCase() ===
        cancelRideReasons[0].toLowerCase() ||
      cancelRideReasonInput.toLowerCase() ===
        cancelRideReasons[0].toLowerCase() ||
      cancelRideReasonInput.toLowerCase() ===
        cancelRideReasons[1].toLowerCase() ||
      cancelRideReasonInput.toLowerCase() ===
        cancelRideReasons[2].toLowerCase() ||
      cancelRideReasonInput.toLowerCase() ===
        cancelRideReasons[3].toLowerCase() ||
      cancelRideReasonInput.toLowerCase() === cancelRideReasons[4].toLowerCase()
    ) {
      setCommentBoxShowable(false);
    } else setCommentBoxShowable(true);
  }, [cancelRideReasonInput]);
  // Updating the bottom Modal

  return (
    <View
      style={
        [
          w("90%"),
          hFull,
          mXAuto,
          rounded(10),
          py(34),
          px(24),
          bg(colors.white),
          flexCol,
          gap(30),
        ] as ViewStyle[]
      }
    >
      <View
        style={
          [
            pb(16),
            flex,
            itemsStart,
            gap(16),
            mXAuto,
            { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 },
          ] as ViewStyle[]
        }
      >
        <Image style={[image.w(20), image.h(20)]} source={images.cancelImage} />

        <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>
          Cancel Ride
        </Text>
      </View>

      <View style={[flexCol, gap(2), itemsCenter, mXAuto] as ViewStyle[]}>
        <Text style={[neurialGrotesk, fw700, fs14]}>
          Why do you want to cancel your order?
        </Text>
      </View>

      <View style={[flexCol, gap(10)]}>
        {cancelRideReasons.map((reason, index) => (
          <RadioBtnListTile
            input={{
              onChange: (value: string) => {
                if (reason.toLowerCase() !== "other") {
                  dispatch(
                    setStateInputField({
                      key: "cancelRideReasonInput",
                      value:
                        value.toLowerCase() ===
                        cancelRideReasonInput.toLowerCase()
                          ? ""
                          : value.toLowerCase(),
                    })
                  );
                }

                if (reason.toLowerCase() === "other") {
                  dispatch(
                    setStateInputField({
                      key: "cancelRideReasonInput",
                      value: "",
                    })
                  );
                }
              },
              value: cancelRideReasonInput.toLowerCase(),
            }}
            label={{ text: reason }}
            key={index}
          />
        ))}
      </View>

      {commentBoxShowable && (
        <TextInput
          onChangeText={(text) => {
            dispatch(
              setStateInputField({ key: "cancelRideReasonInput", value: text })
            );
          }}
          value={driverRatingCommentInput}
          placeholder={"Input Comments"}
          multiline
          numberOfLines={4}
          style={
            [
              py(16),
              px(24),
              rounded(10),
              bg(colors.transparent),
              colorBlack,
              fs14,
              fw500,
              wFull,
              { borderWidth: 0.7, borderColor: Colors.light.border },
            ] as TextStyle[]
          }
          selectionColor={colors.transparent}
          underlineColorAndroid={colors.transparent}
          placeholderTextColor={Colors.light.textGrey}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          dispatch(closeModal());

          // submit reason to the server
        }}
      >
        <View
          style={[
            wFull,
            h(50),
            rounded(10),
            flex,
            itemsCenter,
            justifyCenter,
            gap(10),
            bg(Colors.light.error),
          ]}
        >
          <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Confirm</Text>

          <Image
            style={[image.w(20), image.h(20)]}
            source={images.proceedCheckImage}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
