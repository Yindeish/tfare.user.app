import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
  Button,
  Dimensions,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import {
  absolute,
  bg,
  flex,
  flexCol,
  gap,
  h,
  hFull,
  itemsCenter,
  itemsEnd,
  itemsStart,
  justifyBetween,
  justifyCenter,
  justifyStart,
  left0,
  mLAuto,
  mRAuto,
  mXAuto,
  mb,
  ml,
  mt,
  p,
  pLAuto,
  pXAuto,
  pb,
  pl,
  pt,
  px,
  py,
  relative,
  right0,
  rounded,
  t,
  top0,
  w,
  wFull,
  wHFull,
  zIndex,
} from "@/utils/styles";
import { Text, Portal, Dialog, Paragraph } from "react-native-paper";
import {
  c,
  colorBlack,
  colorBlueBg,
  colorBorderGrey,
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
import { images } from "@/constants/images";
import { image } from "@/utils/imageStyles";
import Colors, { colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import CtaBtn from "../shared/ctaBtn";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setStateInputField } from "@/state/slices/ride";
import RideSelectors from "@/state/selectors/ride";
import { cancelRideReasons } from "@/constants/cancelRideReasons";
import RadioBtnListTile from "./RadioBtnListTile";
import { closeModal } from "@/state/slices/layout";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { Href, router, useGlobalSearchParams } from "expo-router";
import tw from "@/constants/tw";
import { RootState } from "@/state/store";
import FetchService from "@/services/api/fetch.service";
import { useSnackbar } from "@/contexts/snackbar.context";
import { supabase } from "@/supabase/supabase.config";

function TripStartedSheet() {
  const { showBottomSheet } = useBottomSheet();
  const { riderRideDetails, driverDetails, selectedAvailableRide } =
    useAppSelector((state: RootState) => state.ride);
  const { token } = useAppSelector((state: RootState) => state.user);
  const { notify, Snackbar, snackbarVisible, closeSnackbar } = useSnackbar();
  const searchParams = useGlobalSearchParams();
  const {requestId} = useGlobalSearchParams();

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
      url: `/user/rider/me/ride/${selectedAvailableRide?._id}/commit-safety-alert`,
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

  const checkRideStatus = async () => {
    setFetchState({ ...fetchState, loading: true });
    await FetchService.getWithBearerToken({
      url: `/ride/${riderRideDetails?._id}/status`,
      token: token,
    })
      .then(async (res) => {
        setFetchState({ ...fetchState, loading: false });
        console.log({ res });

        const data = res?.body ? await res.json() : res;
        const code = data?.code;
        const msg = data?.msg;
        const status = data?.status;

        setFetchState({ ...fetchState, code, msg });

        if (status === "started") {
          showBottomSheet([500], <TripStartedSheet />);
          return;
        }
        if (status === "ended") {
          showBottomSheet([500], <TripCompletedSheet />);
          return;
        }
      })
      .catch((err: any) => {
        setFetchState({ ...fetchState, loading: false });
        console.log({ err });
        notify({ msg: err?.message });
      });
  };

  const channel = supabase.channel(
    `ride_${requestId || riderRideDetails?._id}`
  );
  channel
    .on("broadcast", { event: "ride_ended" }, (payload) => {
      router.setParams({ ...searchParams, query: "RideEnded" });
      showBottomSheet([800], <TripCompletedSheet />);
    })
    .subscribe();

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
          onPress={() =>
            router.push(
              `/(sharedScreens)/driverProfile?currentRideId=${riderRideDetails?.currentRideId})` as Href
            )
          }
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

            <View style={[flex, gap(32), itemsCenter, mXAuto]}>
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
            showBottomSheet([660], <CancelRide />);
          }}
          text={{ name: "Cancel Order", color: Colors.light.textGrey }}
          bg={{ color: "#F9F7F8", borderColor: Colors.light.border }}
        />
      </View>
      <Text style={tw`text-black text-[10px] mt-3`}>{msg}</Text>
    </PaddedScreen>
  );
}

function TripCompletedSheet() {
  const dispatch = useAppDispatch();
  const { hideBottomSheet, showBottomSheet } = useBottomSheet();
  const {
    stateInput: { driverRatingInput, driverRatingCommentInput },
  } = RideSelectors();
  const {requestId} = useGlobalSearchParams();
  const { riderRideDetails, driverDetails, selectedAvailableRide } =
    useAppSelector((state: RootState) => state.ride);
  const { token } =
    useAppSelector((state: RootState) => state.user);

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
    setFetchState({ ...fetchState, loading: true, msg: '' });
    await FetchService.patchWithBearerToken({
      url: `/user/rider/me/ride/${selectedAvailableRide?._id}/rate-driver`,
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
        dispatch(setStateInputField({ key: "driverRatingCommentInput", value: "" }));

        const data = res?.body ? await res.json() : res;
        const code = data?.code;
        const msg = data?.msg;

        setFetchState({ ...fetchState, code, msg });

        if(code == 200 || code == 201) {
          hideBottomSheet();
          router.replace('/(tab)')
        }
      })
      .catch((err: any) => {
        setFetchState({ ...fetchState, loading: false, msg: err?.message });
        console.log({ err });
      });
  }

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
          onPress={() =>
            router.push(`/(sharedScreens)/driverProfile?)` as Href)
          }
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
            source={images.userProfileImage}
            style={[image.w(70), image.h(70), image.rounded(70)]}
          />

          <View style={[flexCol, itemsStart, gap(20)]}>
            <Text style={[fw700, fs16, colorBlack]}>{driverDetails?.fullName}</Text>

            <View style={[flex, gap(32), itemsCenter, mXAuto]}>
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
        {loading && <View style={tw `w-full h-auto absolute top-1/2 flex items-center justify-center z-5`}>
        <ActivityIndicator size={"small"} />
        </View>}
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

      <Text style={tw `text-[10px] font-medium text-black mt-3`}>{msg}</Text>
    </PaddedScreen>
  );
}

function CancelRide() {
  const dispatch = useAppDispatch();
  const {
    stateInput: { driverRatingCommentInput, cancelRideReasonInput },
  } = RideSelectors();

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
      style={[
        w("90%"),
        hFull,
        mXAuto,
        rounded(10),
        py(34),
        px(24),
        bg(colors.white),
        flexCol,
        gap(30),
      ]}
    >
      <View
        style={[
          pb(16),
          flex,
          itemsStart,
          gap(16),
          mXAuto,
          { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 },
        ]}
      >
        <Image style={[image.w(20), image.h(20)]} source={images.cancelImage} />

        <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>
          Cancel Ride
        </Text>
      </View>

      <View style={[flexCol, gap(2), itemsCenter, mXAuto]}>
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

export { TripStartedSheet, TripCompletedSheet, CancelRide };
