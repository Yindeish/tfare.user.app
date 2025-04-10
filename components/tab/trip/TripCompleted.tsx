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
    justifyBetween,
    justifyCenter,
    justifyStart,
    l,
    mb,
    mt,
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
  import { c, colorBlack, fs12, fs14, fs16, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
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
import { setStateInputField } from "@/state/slices/trip";
import { TextInput } from "react-native-paper";


export default function TripCompletedSheet() {
    const dispatch = useAppDispatch();
    const { hideBottomSheet, showBottomSheet } = useBottomSheet();
    const { requestId } = useGlobalSearchParams();
    const { riderRideDetails, driverDetails, currentTrip, stateInput: {driverRatingCommentInput, driverRatingInput} } =
      useAppSelector((state: RootState) => state.trip);
    const { token } = useAppSelector((state: RootState) => state.user);
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
  
    const rateDriver = (rating: number) => {
      dispatch(setStateInputField({ key: "driverRatingInput", value: rating }));
      // hideBottomSheet()
      // update in DB
    };
  
    const sendRating = async () => {
      setFetchState({ ...fetchState, loading: true, msg: "" });
      await FetchService.patchWithBearerToken({
        url: `/user/rider/me/ride/${currentTrip?._id}/rate-driver`,
        data: {
          requestId: requestId || riderRideDetails?._id,
          count: driverRatingInput,
          comment: driverRatingCommentInput,
        },
        token: token,
      })
        .then(async (res) => {
          setFetchState({ ...fetchState, loading: false });
          dispatch(setStateInputField({ key: "driverRatingInput", value: null }));
          dispatch(
            setStateInputField({ key: "driverRatingCommentInput", value: "" })
          );
  
          const data = res?.body ? await res.json() : res;
          const code = data?.code;
          const msg = data?.msg;
  
          setFetchState({ ...fetchState, code, msg });
  
          if (code == 200 || code == 201) {
            setQuery(null);
            hideBottomSheet();
            router.replace("/(tab)");
          }
        })
        .catch((err: any) => {
          setFetchState({ ...fetchState, loading: false, msg: err?.message });
          console.log({ err });
        });
    };
  
    return (
      <PaddedScreen styles={[tw`relative`]}>
        <View style={[flexCol, gap(32), mt(20)]}>
          <PaddedScreen>
            <View style={[flexCol, gap(20)]}>
              <View style={[wFull, flex, gap(10), itemsCenter, justifyCenter]}>
                <Image
                  style={[image.w(30), image.h(30)]}
                  source={images.greenBgCheckboxImage}
                />
  
                <Text style={[fw700, colorBlack, { fontSize: 22 }]}>
                  You have arrived Safely!
                </Text>
              </View>
  
              <Text
                style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}
              >
                You have arrived at your location. Rate your trip below
              </Text>
            </View>
          </PaddedScreen>
  
          {/* Driver block */}
  
          <TouchableOpacity
            onPress={() => {
              hideBottomSheet();
              router.push(`/(sharedScreens)/driverProfile?)` as Href)
              setTimeout(() => showBottomSheet([100, 650], <TripCompletedSheet />), 500);
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
              source={{ uri: driverDetails?.picture || driverDetails?.avatar }}
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
  
          {/* Rating */}
  
          <PaddedScreen>
            <View style={[flex, justifyBetween, wFull, h(50)]}>
              {[1, 1.3, 1.5, 1.3, 1].map((starRate, index) => (
                <TouchableOpacity
                  onPress={() => rateDriver(index + 1)}
                  style={[w(35), h(33)]}
                  key={index}
                >
                  <Image
                    source={
                      driverRatingInput && index <= driverRatingInput - 1
                        ? images.startRatingImage
                        : images.rateStarImage
                    }
                    style={[
                      image.w(35),
                      image.h(33),
                      { transform: `scale(${starRate})` },
                      image.mt(index === 2 ? "auto" : 0),
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </PaddedScreen>
  
          {/* Rating */}
  
          <TextInput
            onChangeText={(text) => {
              dispatch(
                setStateInputField({
                  key: "driverRatingCommentInput",
                  value: text,
                })
              );
            }}
            value={driverRatingCommentInput}
            autoCorrect={false}
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
  
          {/* Rating */}
  
          {/* Loading Spinner */}
          {loading && (
            <View
              style={tw`w-full h-auto absolute top-1/2 flex items-center justify-center z-5`}
            >
              <ActivityIndicator size={"small"} />
            </View>
          )}
          {/* Loading Spinner */}
  
          <CtaBtn
            img={{
              src: images.whiteBgStarRatingImage,
              w: 18,
              h: 17,
            }}
            onPress={() => sendRating()}
            text={{ name: "Rate now" }}
          />
        </View>
  
        <Text style={tw`text-[10px] font-medium text-black mt-3`}>{msg}</Text>
      </PaddedScreen>
    );
  }