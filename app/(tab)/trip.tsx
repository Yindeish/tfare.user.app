import {
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Dimensions,
  FlatList,
  RefreshControl,
  ViewStyle,
  TextStyle,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { ActivityIndicator, Button, Snackbar, Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import SafeScreen from "@/components/shared/safeScreen";
import { image, imgAbsolute, wHFull } from "@/utils/imageStyles";
import {
  absolute,
  bg,
  borderGrey,
  flex,
  flexCenter,
  flexCol,
  gap,
  h,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  maxh,
  mb,
  ml,
  mr,
  mt,
  p,
  pb,
  pl,
  px,
  py,
  relative,
  rounded,
  w,
  wFull,
} from "@/utils/styles";
import Colors, { colors } from "@/constants/Colors";
import PaddedScreen from "@/components/shared/paddedScreen";
import { images } from "@/constants/images";
import {
  c,
  colorBlack,
  fs12,
  fs14,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { Href, router } from "expo-router";
import PageTitle from "@/components/shared/pageTitle";
import { ICurrentTrip } from "@/state/types/trip";
import FetchService from "@/services/api/fetch.service";
import { getItemAsync } from "expo-secure-store";
import tw from "@/constants/tw";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import { setTripState } from "@/state/slices/trip";
import { Utils } from "@/utils";

const { height } = Dimensions.get("window");

export default function Trip() {
  const dispatch = useAppDispatch();
  const { selectedAvailableTrip } = useAppSelector(
    (state: RootState) => state.trip
  );

  const [fetchState, setFetchState] = useState<{
    loading: boolean;
    msg: string;
    code: number | null;
    availableTrips: ICurrentTrip[];
    matchTrips: ICurrentTrip[];
    searchText: string;
  }>({
    loading: false,
    msg: "",
    code: null,
    searchText: "",
    matchTrips: [],
    availableTrips: [],
  });
  const { loading, availableTrips, matchTrips, searchText, code, msg } =
    fetchState;

  const getAvailableTrips = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));
    const returnedData = await FetchService.getWithBearerToken({
      url: "/user/rider/me/trip/available-trips",
      token: (await getItemAsync("token")) as string,
    });

    const availableTrips = returnedData?.availableTrips;
    console.log({availableTrips})
    setFetchState((prev) => ({
      ...prev,
      loading: false,
      availableTrips: availableTrips,
      matchTrips: availableTrips,
    }));
  };

  useEffect(() => {
    if (availableTrips.length == 0) getAvailableTrips();
  }, []);

  return (
    <SafeScreen>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getAvailableTrips} />
        }
        style={[wHFull, relative] as ViewStyle[]}
      >
        <PaddedScreen>
          {/* <PageTitle title="Trips" onPress={() => router.back()} /> */}

          <View style={[flexCol, gap(0), tw`pb-[150px]`]}>
            {/* //!Search Block */}
            <View
              style={[
                wFull,
                rounded(50),
                bg(colors.transparent),
                h(50),
                relative,
                tw``,
              ]}
            >
              {/* //! */}
              <Image
                style={[
                  image.w(20),
                  image.h(20),
                  imgAbsolute,
                  image.t("30%"),
                  image.l(20),
                  image.zIndex(3),
                ]}
                source={images.search}
              />
              {/* //! */}

              <TextInput
                style={
                  [
                    wHFull,
                    pl(43),
                    borderGrey(0.7),
                    rounded(50),
                    bg("#F9F7F8"),
                  ] as TextStyle[]
                }
                placeholder="Search Bus stop"
                placeholderTextColor={Colors.light.textGrey}
                value={searchText}
                onChangeText={(text) => {
                  setFetchState((prev) => ({ ...prev, searchText: text }));
                  if (text.length > 0) {
                    const matchTrips = availableTrips.filter((trip) => {
                      return (
                        trip?.route?.pickupBusstop?.name
                          .toLowerCase()
                          .includes(text.toLowerCase()) ||
                        trip?.route?.dropoffBusstop?.name
                          .toLowerCase()
                          .includes(text.toLowerCase())
                      );
                    });

                    setFetchState((prev) => ({ ...prev, matchTrips }));
                  }
                  if (text.length == 0) {
                    setFetchState((prev) => ({
                      ...prev,
                      matchTrips: availableTrips,
                    }));
                  }
                }}
              />
            </View>
            {/* //!Search Block */}

            <ScrollView style={[flexCol, gap(0), h(height * 1)]}>
              {/* //!Rides Based On Date Block */}
              <View
                style={[
                  flexCol,
                  gap(16),
                  mb(24),
                  // { flexBasis: "50%" },
                  tw`h-[700px]`,
                ]}
              >
                {/* //!Date and Filter */}
                <View style={[flex, justifyBetween, itemsCenter, tw`py-4`]}>
                  <Text style={[neurialGrotesk, fw700, fs14, c(colors.black)]}>
                    Today
                  </Text>

                  <TouchableOpacity>
                    <Image
                      style={[image.w(18), image.h(18)]}
                      source={images.settings}
                    />
                  </TouchableOpacity>
                </View>
                {/* //!Date and Filter */}

                <View style={[flexCol, gap(24), tw` h-[700px]`]}>
                  {matchTrips?.map((trip, index) => (
                    <View
                      style={[
                        bg("#F9F7F8"),
                        wFull,
                        rounded(10),
                        py(17),
                        px(9),
                        flexCol,
                        gap(20),
                        tw` h-auto`,
                      ]}
                      key={index}
                    >
                      <View style={[flex, justifyBetween, itemsCenter]}>
                        <Text style={[fw700, fs14, c(colors.black)]}>
                          {trip?.route?.pickupBusstop?.name}
                        </Text>

                        <Image
                          style={[image.w(90), image.h(5)]}
                          source={images.tripDirection}
                        />

                        <Text style={[fw700, fs14, c(colors.black)]}>
                          {trip?.route?.dropoffBusstop?.name}
                        </Text>
                      </View>

                      <View style={[wFull, flex, justifyBetween, itemsCenter]}>
                        <View style={[flexCol, gap(16)]}>
                          <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
                            {Utils.formatTime(trip?.departureTime)}
                          </Text>
                          <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
                            {Utils.formatDate(trip?.departureDate)}
                          </Text>
                        </View>

                        <View style={[flex]}>
                          <View
                            style={[
                              w("auto"),
                              h(45),
                              rounded(100),
                              flex,
                              itemsCenter,
                              gap(16),
                              bg(colors.white),
                              p(16),
                              {
                                borderWidth: 0.7,
                                borderColor: Colors.light.border,
                              },
                            ]}
                          >
                            <Image
                              style={[image.w(18), image.h(14.73)]}
                              source={images.passengersImage}
                            />
                            <Text
                              style={[
                                fs12,
                                fw500,
                                colorBlack,
                                h(20) as TextStyle,
                                tw`flex flex-row items-center`,
                              ]}
                            >
                              {trip?.availableSeats} seats Available
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              dispatch(
                                setTripState({
                                  key: "currentTrip",
                                  value: trip,
                                })
                              );
                              dispatch(
                                setTripState({
                                  key: "route",
                                  value: trip?.route,
                                })
                              );
                              dispatch(
                                setTripState({
                                  key: "driverDetails",
                                  value: trip?.driver,
                                })
                              );
                              dispatch(setTripState({key: 'paymentOptionInput', value: trip?.route?.allowedPaymentOptions[0]}))
                              router.push(
                                `/(tripScreen)/bookTripDetails` as Href
                              );
                            }}
                            style={[
                              w(45),
                              h(45),
                              bg("#5D5FEF"),
                              rounded(45),
                              flex,
                              itemsCenter,
                              justifyCenter,
                              ml(-15),
                            ]}
                          >
                            <FontAwesome6
                              name="arrow-right-long"
                              size={24}
                              color={colors.white}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
              {/* //!Rides Based On Date Block */}

              {/* //!Rides Based On Date Block */}
              {false && (
                <View
                  style={[
                    flexCol,
                    gap(24),
                    mb(height * 0.4),
                    { flexBasis: "50%" },
                  ]}
                >
                  {/* //!Date and Filter */}
                  <View style={[flex, justifyBetween, itemsCenter]}>
                    <Text
                      style={[neurialGrotesk, fw700, fs14, c(colors.black)]}
                    >
                      Tomorrow
                    </Text>

                    <TouchableOpacity>
                      <Image
                        style={[image.w(18), image.h(18)]}
                        source={images.settings}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* //!Date and Filter */}

                  <View style={[flexCol, gap(24)]}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <View
                        style={[
                          bg("#F9F7F8"),
                          wFull,
                          rounded(10),
                          py(17),
                          px(9),
                          flexCol,
                          gap(20),
                        ]}
                        key={index}
                      >
                        <View style={[flex, justifyBetween, itemsCenter]}>
                          <Text style={[fw700, fs14, c(colors.black)]}>
                            Bus Stop A
                          </Text>

                          <Image
                            style={[image.w(90), image.h(5)]}
                            source={images.tripDirection}
                          />

                          <Text style={[fw700, fs14, c(colors.black)]}>
                            Bus Stop B
                          </Text>
                        </View>

                        <View
                          style={[wFull, flex, justifyBetween, itemsCenter]}
                        >
                          <View style={[flexCol, gap(16)]}>
                            <Text
                              style={[fw400, fs12, c(Colors.light.textGrey)]}
                            >
                              7:30 AM
                            </Text>
                            <Text
                              style={[fw400, fs12, c(Colors.light.textGrey)]}
                            >
                              Apr 14
                            </Text>
                          </View>

                          <View style={[flex]}>
                            <View
                              style={[
                                w("auto"),
                                h(45),
                                rounded(100),
                                flex,
                                itemsCenter,
                                gap(16),
                                bg(colors.white),
                                p(16),
                                {
                                  borderWidth: 0.7,
                                  borderColor: Colors.light.border,
                                },
                              ]}
                            >
                              <Image
                                style={[image.w(18), image.h(14.73)]}
                                source={images.passengersImage}
                              />
                              <Text style={[fs12, fw500, colorBlack]}>
                                {3} seats Available
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() =>
                                router.push(
                                  `/(tripScreen)/tripDetails/${index}` as Href
                                )
                              }
                              style={[
                                w(45),
                                h(45),
                                bg("#5D5FEF"),
                                rounded(45),
                                flex,
                                itemsCenter,
                                justifyCenter,
                                ml(-15),
                              ]}
                            >
                              <FontAwesome6
                                name="arrow-right-long"
                                size={24}
                                color={colors.white}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {/* //!Rides Based On Date Block */}
            </ScrollView>
          </View>
        </PaddedScreen>
      </ScrollView>
    </SafeScreen>
  );
}
