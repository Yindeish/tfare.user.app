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
import { IBusStop, ICurrentTrip, IRiderRideDetails } from "@/state/types/trip";
import FetchService from "@/services/api/fetch.service";
import { getItemAsync } from "expo-secure-store";
import tw from "@/constants/tw";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import { setState } from "@/state/slices/trip";

const { height } = Dimensions.get("window");

export default function Trip() {
    const dispatch = useAppDispatch();
    const {selectedAvailableTrip} = useAppSelector((state: RootState) => state.trip)


  const [fetchState, setFetchState] = useState<{
    loading: boolean;
    msg: string;
    code: number | null;
    availableTrips: ICurrentTrip[];
  }>({
    loading: false,
    msg: "",
    code: null,
    availableTrips: [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        availableSeats: 2,
        departureDate: "12, apr",
        departureTime: "3 AM",
        inRideDropoffs: [],
        ridersRides: [],
        driverId: "87697",
        route: {
          dropoffBusstop: {
            name: "tyyoup",
          },
          pickupBusstop: {
            name: "tyyoup",
          },
          inTripDropoffsIds: [],
          rideDirection: "forward",
          _id: "775678",
        },
        vehicleName: "9jhjkahjgj",
        _id: "fydfgd",
        routeId: "6757",
      },
    ],
  });
  const { loading, availableTrips, code, msg } = fetchState;

  console.log("====================================");
  console.log(availableTrips);
  console.log("====================================");

  const getAvailableTrips = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));
    const returnedData = await FetchService.getWithBearerToken({
      url: "/user/rider/me/trip/available-trips",
      token: (await getItemAsync("token")) as string,
    });

    const availableTrips = returnedData?.availableTrips;
    setFetchState((prev) => ({
      ...prev,
      loading: false,
      availableTrips: availableTrips,
    }));
  };

  useEffect(() => {
    getAvailableTrips();
  }, []);

  return (
    <SafeScreen>
      {/* <ScrollView style={[wHFull, relative]}> */}
      <PaddedScreen>
        <PageTitle title="Trips" onPress={() => router.back()} />

        <View style={[flexCol, gap(0), tw``]}>
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

            {/* <TextInput
                            style={[
                                wHFull, pl(43), borderGrey(0.7), rounded(50), bg('#F9F7F8')
                            ]}
                            placeholder='Search Bus stop'
                            placeholderTextColor={Colors.light.textGrey}
                            value={''}
                            onChangeText={() => { }}

                        /> */}
          </View>
          {/* //!Search Block */}

          <ScrollView
            style={[flexCol, gap(0), h(height * 1)]}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={getAvailableTrips}
              />
            }
          >
            {/* //!Rides Based On Date Block */}
            <View style={[flexCol, gap(16), mb(24), 
                // { flexBasis: "50%" }, 
                tw `h-[700px]`]}>
              {/* //!Date and Filter */}
              <View style={[flex, justifyBetween, itemsCenter]}>
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

              {!loading ? (
                <View style={[flexCol, gap(24), tw ` h-[700px]`]}>
                  {[
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        availableSeats: 2,
        departureDate: "12, apr",
        departureTime: "3 AM",
        inRideDropoffs: [
            {
name: 'jhjgjh'
            } ,
            {
name: 'jhjgjh'
            } ,
        ],
        ridersRides: [],
        driverId: "87697",
        route: {
          dropoffBusstop: {
            name: "tyyoup",
          },
          pickupBusstop: {
            name: "tyyoup",
          },
          inTripDropoffsIds: [],
          rideDirection: "forward",
          _id: "775678",
        },
        vehicleName: "9jhjkahjgj",
        _id: "fydfgd",
        routeId: "6757",
      },
    ]?.map((trip, index) => (
                    <View
                      style={[
                        bg("#F9F7F8"),
                        wFull,
                        rounded(10),
                        py(17),
                        px(9),
                        flexCol,
                        gap(20),
                        tw ` h-auto`
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
                            {trip?.departureTime}
                          </Text>
                          <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
                            {trip?.departureDate}
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
                              {trip?.availableSeats} seats Available
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() =>{
                                dispatch(setState({key:'selectedAvailableTrip', value: trip}))
                                router.push(
                                    `/(tripScreen)/bookTripDetails` as Href
                                  )
                            } 
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
              ) : (
                <View
                  style={tw`w-full h-auto flex flex-row items-center justify-center`}
                >
                  <ActivityIndicator style={tw``} size={"small"} />
                </View>
              )}
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
                  <Text style={[neurialGrotesk, fw700, fs14, c(colors.black)]}>
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

                      <View style={[wFull, flex, justifyBetween, itemsCenter]}>
                        <View style={[flexCol, gap(16)]}>
                          <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
                            7:30 AM
                          </Text>
                          <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>
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
      {/* </ScrollView> */}
    </SafeScreen>
  );
}
