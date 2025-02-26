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
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import {
  absolute,
  b,
  bg,
  border,
  flex,
  flexCenter,
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
  ml,
  mt,
  p,
  pLAuto,
  pXAuto,
  pb,
  pl,
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
  fs10,
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
import LayoutSelectors from "@/state/selectors/layout";
import { useDispatch } from "react-redux";
import {} from "@/state/slices/layout";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import RideSelectors from "@/state/selectors/ride";
import {
  setAvailableRides,
  setState,
  setStateInputField,
  setUserRide,
  setUserRideInput,
} from "@/state/slices/ride";
import { Href, router, useGlobalSearchParams, usePathname } from "expo-router";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import BottomSheetTitle from "../shared/bottomSheetTitle";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { pages } from "@/constants/pages";
import FetchService from "@/services/api/fetch.service";
import { useSession } from "@/contexts/userTokenContext";
import { useSession as UserSession } from "@/contexts/userSignedInContext";
import { setSavedAddresses } from "@/state/slices/account";
import { IAddress } from "@/state/types/account";
import { RootState } from "@/state/store";
import AccountSelectors from "@/state/selectors/account";
import { useStorageState } from "@/hooks/useStorageState";
import { useLocalSearchParams } from "expo-router";
import { EVENTS, socket } from "@/socket.io/socket.io.config";
import { IRideAccptedEvent } from "@/socket.io/socket.io.types";
import { useFormik } from "formik";
import { ObjectSchema, string } from "yup";
import CustomModal from "../shared/modal";
import { AntDesign } from "@expo/vector-icons";
import tw from "@/constants/tw";
import {
  IBusStop,
  ICurrentRide,
  IPlan,
  IRiderRideDetails,
} from "@/state/types/ride";
import ScaleUpDown from "../shared/scale_animator";
import URLS from "@/constants/urls";
import { useSnackbar } from "@/contexts/snackbar.context";
import { State } from "react-native-gesture-handler";
import {
  TripCompletedSheet,
  TripStartedSheet,
} from "./tripStartedBottomSheetComponents";
import { RideBookedSheet } from "./bookRideSheetComponent";
import { IUser } from "@/state/types/user";
import { supabase } from "@/supabase/supabase.config";

const RecentLocationsSnippet = () => {
  const dispatch = useDispatch();
  //   const [[isLoading, session], setSession] = useStorageState("token");
  const { token: session } = useAppSelector((state: RootState) => state.user);
  const { savedAddresses } = AccountSelectors();

  const { showBottomSheet } = useBottomSheet();
  const {
    stateInput: { dropoffBusstopInput, pickupBusstopInput },
  } = RideSelectors();

  const [fetchState, setFetchState] = useState({
    loading: false,
  });
  const { loading } = fetchState;

  const [searchState, setSearchState] = useState({
    loading: false,
    busstops: [],
    inputtingPickup: false,
    inputtingDropoff: false,
    pickupSearchText: "",
    dropoffSearchText: "",
  });
  const {
    busstops,
    inputtingPickup,
    inputtingDropoff,
    dropoffSearchText,
    pickupSearchText,
  } = searchState;

  const searchBusstops = async (query: string) => {
    setSearchState((prev) => ({ ...prev, loading: true }));

    const returnedData = await FetchService.getWithBearerToken({
      url: `/user/rider/me/busstop/search?searchValue=${query}`,
      token: session as string,
    });

    setSearchState((prev) => ({ ...prev, loading: false }));

    const busstops = returnedData?.matchSearchBusStops as IAddress[];
    console.log({ busstops });
    if (busstops) {
      setSearchState((prev) => ({ ...prev, busstops: busstops as never[] }));
      dispatch(setSavedAddresses(busstops));
    }
  };

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      pickupBusstop: pickupBusstopInput?.name,
      dropoffBusstop: dropoffBusstopInput?.name,
    },
    validationSchema: new ObjectSchema({
      pickupBusstop: string().required(),
      dropoffBusstop: string().required(),
    }),
    onSubmit: ({ dropoffBusstop, pickupBusstop }) => {
      showBottomSheet([436], <FilledForm />, true);
      // router.setParams({ query: "FilledForm" });
    },
  });

  const getSavedBusstops = async () => {
    setFetchState({ loading: true });
    const returnedData = await FetchService.getWithBearerToken({
      url: "/user/rider/me/busstop/saved-busstops",
      token: session as string,
    });
    const allBusStops = returnedData?.allBusStops as IAddress[];
    console.log({ allBusStops });

    setFetchState({ loading: false });
    if (allBusStops) {
      dispatch(setSavedAddresses(allBusStops));
    }
  };

  const openRecentPickupLocations = () => {
    showBottomSheet([508], <RecentPickupLocations />, true);
    router.setParams({ query: "RecentPickupLocations" });
  };

  const openRecentDropoffLocations = () => {
    showBottomSheet([508], <RecentDropoffLocations />, true);
    router.setParams({ query: "RecentDropoffLocations" });
  };

  useEffect(() => {
    session && savedAddresses.length <= 0 && getSavedBusstops();
  }, [session]);

  return (
    <PaddedScreen>
      <View style={[flexCol, gap(56), mt(20)]}>
        <View style={[flexCol, gap(20)]}>
          <View style={[wFull, flex, itemsCenter, justifyBetween]}>
            <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>
              Pick up bus stop
            </Text>
            <TouchableOpacity onPress={openRecentPickupLocations}>
              <Text style={[neurialGrotesk, fw400, fs14, colorBlueBg]}>
                recent locations
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              wFull,
              h(52),
              rounded(10),
              py(16),
              px(24),
              bg("#F9F7F8"),
              flex,
              gap(10),
              itemsCenter,
              justifyCenter,
            ]}
          >
            <TouchableOpacity>
              <Image
                style={[image.w(15), image.h(20)]}
                source={images.locationImage}
              />
            </TouchableOpacity>

            <TextInput
              style={[
                fs14,
                fw500,
                h(20) as TextStyle,
                {
                  color: Colors.light.textGrey,
                  borderColor: colors.transparent,
                  borderWidth: 0,
                  flex: 0.8,
                },
              ]}
              placeholderTextColor={Colors.light.textGrey}
              cursorColor={Colors.light.textGrey}
              placeholder="Enter Location"
              value={values.pickupBusstop}
              // onChangeText={handleChange("pickupBusstop")}
              // onBlur={handleBlur("pickupBusstop")}
              onChangeText={(text) => {
                searchBusstops(text);
                setFieldValue("pickupBusstop", text);
              }}
              onFocus={() => {
                setSearchState((prev) => ({ ...prev, inputtingPickup: true }));
              }}
            />

            <TouchableOpacity>
              <Image
                style={[image.w(22), image.h(22)]}
                source={images.pickUpImage}
              />
            </TouchableOpacity>
          </View>

          {/* Pickup Suggestion Dropodwon */}
          {inputtingPickup && (
            <View style={[relative, wFull, h(10)]}>
              {!searchState.loading ? (
                <ScrollView
                  style={[
                    absolute,
                    top0,
                    left0,
                    zIndex(20),
                    wFull,
                    bg(colors.white),
                    h(176),
                    flexCol,
                    gap(30),
                    py(16),
                    px(24),
                    bg("#F9F7F8"),
                    { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 },
                  ]}
                >
                  {(busstops as IBusStop[])?.map((busstop, index) => (
                    <Text
                      onPress={() => {
                        setFieldValue("pickupBusstop", busstop?.name);
                        dispatch(
                          setStateInputField({
                            key: "pickupBusstopInput",
                            value: busstop,
                          })
                        );
                        setSearchState((prev) => ({
                          ...prev,
                          inputtingPickup: false,
                          pickupSearchText: busstop.name,
                        }));
                        console.log({ busstop, pickupBusstopInput });
                      }}
                      style={[h(30) as TextStyle]}
                      key={index}
                    >
                      {busstop?.name}
                    </Text>
                  ))}
                </ScrollView>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          )}
          {/* Pickup Suggestion Dropodwon */}

          {/* Saved Bustop List */}
          {!loading ? (
            <FlatList
              style={[wFull, h(46), flex, gap(16)]}
              horizontal
              data={savedAddresses}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      setStateInputField({
                        key: "pickupBusstopInput",
                        value: item?.busStop,
                      })
                    );
                    setFieldValue("pickupBusstop", item?.busStop?.name);
                  }}
                >
                  <View
                    style={[
                      w("auto"),
                      hFull,
                      rounded(100),
                      px(32),
                      gap(10),
                      flex,
                      itemsCenter,
                      justifyCenter,
                      { borderWidth: 1, borderColor: Colors.light.border },
                    ]}
                  >
                    <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>
                      {item?.busstopTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={[w(16), hFull, bg(colors.transparent)]} />
              )}
              keyExtractor={({}) => Math.random().toString()}
            />
          ) : (
            <View style={[wFull, h(50), flexCenter]}>
              <ActivityIndicator style={[w(50), h(50)]} />
            </View>
          )}
          {/* Saved Bustop List */}
        </View>

        <View style={[flexCol, gap(20)]}>
          <View style={[wFull, flex, itemsCenter, justifyBetween]}>
            <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>
              Drop off bus stop
            </Text>
            <TouchableOpacity onPress={openRecentDropoffLocations}>
              <Text style={[neurialGrotesk, fw400, fs14, colorBlueBg]}>
                recent locations
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              wFull,
              h(52),
              rounded(10),
              py(16),
              px(24),
              bg("#F9F7F8"),
              flex,
              gap(10),
              itemsCenter,
              justifyCenter,
            ]}
          >
            <Image
              style={[image.w(15), image.h(20)]}
              source={images.locationImage}
            />

            <BottomSheetTextInput
              style={[
                fs14,
                fw500,
                h(20) as TextStyle,
                {
                  color: Colors.light.textGrey,
                  borderColor: colors.transparent,
                  borderWidth: 0,
                  flex: 0.8,
                },
              ]}
              placeholderTextColor={Colors.light.textGrey}
              cursorColor={Colors.light.textGrey}
              placeholder="Enter Destination"
              value={values.dropoffBusstop}
              onChangeText={(text) => {
                searchBusstops(text);
                setFieldValue("dropoffBusstop", text);
              }}
              onFocus={() => {
                setSearchState((prev) => ({ ...prev, inputtingDropoff: true }));
              }}
            />

            <Image
              style={[image.w(22), image.h(24)]}
              source={images.dropOffImage}
            />
          </View>

          {/* Dropoff Suggestion Dropodwon */}
          {inputtingDropoff && (
            <View style={[relative, wFull, h(10), mt(-32)]}>
              {!searchState.loading ? (
                <ScrollView
                  style={[
                    absolute,
                    top0,
                    left0,
                    zIndex(20),
                    wFull,
                    bg(colors.white),
                    h(176),
                    flexCol,
                    gap(30),
                    py(16),
                    px(24),
                    bg("#F9F7F8"),
                    { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 },
                  ]}
                >
                  {(busstops as IBusStop[])?.map((busstop, index) => (
                    <Text
                      onPress={() => {
                        setFieldValue("dropoffBusstop", busstop?.name);
                        dispatch(
                          setStateInputField({
                            key: "dropoffBusstopInput",
                            value: busstop,
                          })
                        );
                        setSearchState((prev) => ({
                          ...prev,
                          inputtingDropoff: false,
                          dropoffSearchText: busstop.name,
                        }));
                      }}
                      style={[h(30) as TextStyle]}
                      key={index}
                    >
                      {busstop?.name}
                    </Text>
                  ))}
                </ScrollView>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          )}
          {/* Dropoff Suggestion Dropodwon */}

          {!loading ? (
            <FlatList
              style={[wFull, h(46), flex, gap(16)]}
              horizontal
              data={savedAddresses}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      setStateInputField({
                        key: "dropoffBusstopInput",
                        value: item?.busStop,
                      })
                    );
                    setFieldValue("dropoffBusstop", item?.busStop?.name);
                  }}
                >
                  <View
                    style={[
                      w("auto"),
                      hFull,
                      rounded(100),
                      px(32),
                      gap(10),
                      flex,
                      itemsCenter,
                      justifyCenter,
                      { borderWidth: 1, borderColor: Colors.light.border },
                    ]}
                  >
                    <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>
                      {item.busstopTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={[w(16), hFull, bg(colors.transparent)]} />
              )}
              keyExtractor={({}) => Math.random().toString()}
            />
          ) : (
            <View style={[wFull, h(50), flexCenter]}>
              <ActivityIndicator style={[w(50), h(50)]} />
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => handleSubmit()}>
          <View
            style={[
              wFull,
              h(50),
              rounded(10),
              flex,
              itemsCenter,
              justifyCenter,
              gap(10),
              bg(Colors.light.background),
            ]}
          >
            <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>
              Proceed
            </Text>

            <Image
              style={[image.w(20), image.h(20)]}
              source={images.proceedCheckImage}
            />
          </View>
        </TouchableOpacity>
      </View>
    </PaddedScreen>
  );
};

const RecentPickupLocations = () => {
  const dispatch = useAppDispatch();
  const { bottomSheet } = LayoutSelectors();
  const { showBottomSheet } = useBottomSheet();
  const {
    stateInput: { pickupBusstopInput },
  } = RideSelectors();
  const { token } = useAppSelector((state: RootState) => state.user);

  const [searchState, setSearchState] = useState({
    loading: false,
    busstops: [],
    inputting: false,
    searchText: "",
  });
  const { loading, busstops, inputting, searchText } = searchState;

  const searchBusstops = async (query: string) => {
    setSearchState((prev) => ({ ...prev, loading: true }));

    const returnedData = await FetchService.getWithBearerToken({
      url: `/user/rider/me/busstop/search?searchValue=${query}`,
      token: token as string,
    });
    console.log(returnedData);

    setSearchState((prev) => ({ ...prev, loading: false }));

    const busstops = returnedData?.matchSearchBusStops as IAddress[];
    if (busstops) {
      setSearchState((prev) => ({ ...prev, busstops: busstops as never[] }));
      dispatch(setSavedAddresses(busstops));
    }
  };

  const { width, height } = Dimensions.get("window");

  const [modalState, setModalState] = useState({
    visible: false,
  });
  const { visible } = modalState;

  return (
    <PaddedScreen>
      <View style={[flexCol, gap(56), mt(20)]}>
        <View style={[flexCol, gap(20), relative]}>
          <BottomSheetTitle
            title="Pick up bus stop"
            onPressFn={() => {
              showBottomSheet([601, 800], <RecentLocationsSnippet />, true);
              router.setParams({ query: "RecentLocationsSnippet" });
            }}
          />

          <View
            style={[
              wFull,
              h(52),
              rounded(10),
              py(16),
              px(24),
              bg("#F9F7F8"),
              flex,
              gap(10),
              itemsCenter,
              justifyCenter,
            ]}
          >
            <TouchableOpacity>
              <Image
                style={[image.w(15), image.h(20)]}
                source={images.locationImage}
              />
            </TouchableOpacity>

            <BottomSheetTextInput
              onFocus={() =>
                setSearchState((prev) => ({ ...prev, inputting: true }))
              }
              onBlur={() =>
                setSearchState((prev) => ({ ...prev, inputting: false }))
              }
              style={[
                fs14,
                fw500,
                h(20) as TextStyle,
                {
                  color: Colors.light.textGrey,
                  borderColor: colors.transparent,
                  borderWidth: 0,
                  flex: 0.8,
                },
              ]}
              placeholderTextColor={Colors.light.textGrey}
              cursorColor={Colors.light.textGrey}
              placeholder="Enter Location"
              value={searchText}
              onChangeText={(text) => {
                setSearchState((prev) => ({ ...prev, searchText: text }));
                searchBusstops(text);
                // dispatch(
                //   setStateInputField({ key: "pickupBusstopInput", value: text })
                // )
              }}
            />

            <Image
              style={[image.w(22), image.h(22)]}
              source={images.pickUpImage}
            />
          </View>

          {(inputting || pickupBusstopInput?.name != "") && (
            <View style={[relative, wFull, h(10), mt(-32)]}>
              {!searchState.loading ? (
                <ScrollView
                  style={[
                    absolute,
                    top0,
                    left0,
                    zIndex(20),
                    wFull,
                    bg(colors.white),
                    h(176),
                    flexCol,
                    gap(30),
                    py(16),
                    px(24),
                    bg("#F9F7F8"),
                    { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 },
                  ]}
                >
                  {(busstops as IBusStop[])?.map((busstop, index) => (
                    <Text
                      onPress={() => {
                        setSearchState((prev) => ({
                          ...prev,
                          searchText: busstop.name,
                        }));
                        dispatch(
                          setStateInputField({
                            key: "pickupBusstopInput",
                            value: busstop,
                          })
                        );
                      }}
                      style={[h(30) as TextStyle]}
                      key={index}
                    >
                      {busstop?.name}
                    </Text>
                  ))}
                </ScrollView>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          )}

          <View
            style={[
              wFull,
              h(bottomSheet.snapPoint === 5 ? "100%" : 350),
              flexCol,
              gap(32),
            ]}
          >
            <View style={[wFull, flex, itemsCenter, gap(15)]}>
              <Image
                style={[image.w(21.77), image.h(20)]}
                source={images.recentImage}
              />

              <Text style={[colorBlack, neurialGrotesk, fw400, fs14]}>
                Recent locations
              </Text>
            </View>

            <BottomSheetFlatList
              style={[wFull, h(75 * busstops.length), flexCol, gap(16)]}
              horizontal={false}
              data={busstops as IBusStop[]}
              renderItem={({ item }) => (
                <TouchableOpacity style={[wFull]}>
                  <View
                    style={[wFull, h(59), flex, itemsCenter, justifyBetween]}
                  >
                    <View style={[flexCol, itemsStart, gap(12)]}>
                      <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>
                        {item.name}
                      </Text>

                      <Text
                        style={[
                          neurialGrotesk,
                          fw400,
                          fs12,
                          c(Colors.light.textGrey),
                        ]}
                      >{`${item?.name} ${item?.name} ${item?.name} ${item?.name}`}</Text>
                    </View>

                    <View
                      style={[w("auto"), h(18.06), gap(32), flex, itemsCenter]}
                    >
                      <Text style={[neurialGrotesk, fw400, fs14, colorBlack]}>
                        0.8km
                      </Text>

                      <Pressable
                        onPress={() => {
                          setModalState((prev) => ({ ...prev, visible: true }));
                        }}
                      >
                        <Image
                          style={[image.w(14), image.h(18.06)]}
                          source={images.saveLocationImage}
                        />
                      </Pressable>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    wFull,
                    h(16),
                    bg(colors.transparent),
                    {
                      borderBottomWidth: 0.7,
                      borderBottomColor: Colors.light.border,
                    },
                  ]}
                />
              )}
              keyExtractor={({ _id }) => (_id as any)?.toString()}
            />
          </View>

          {/* Modal */}
          <CustomModal
            isVisible={visible}
            onClose={() => {}}
            style={{
              width: width,
              paddingLeft: 8,
              paddingRight: 8,
              backgroundColor: colors.white,
              padding: 0,
            }}
            closeBtn={
              <TouchableOpacity
                onPress={() => {
                  setModalState((prev) => ({ ...prev, visible: false }));
                  router.setParams({ space: null });
                }}
                style={[
                  tw`bg-[#00BF63] w-[70px] h-[70px] flex flex-row items-center justify-center rounded-full absolute z-[5]`,
                  { top: height * 0.75, right: 20 },
                ]}
              >
                <AntDesign name="close" size={26} color="white" />
              </TouchableOpacity>
            }
          >
            <Dialog.Title style={[pXAuto as TextStyle]}>
              <View
                style={[
                  wFull,
                  flex,
                  itemsCenter,
                  justifyCenter,
                  gap(16),
                  pb(16),
                  {
                    borderBottomWidth: 0.7,
                    borderBottomColor: Colors.light.border,
                  },
                ]}
              >
                <Image
                  style={[image.w(14), image.h(18.06)]}
                  source={images.saveLocationImage}
                />

                <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>
                  Save Bus Stop
                </Text>
              </View>
            </Dialog.Title>

            <Dialog.Content>
              <View style={[wFull, flexCol, gap(10)]}>
                <View style={[wFull, flex, gap(10), py(16), px(24)]}>
                  <TextInput
                    style={[
                      fs14,
                      fw500,
                      neurialGrotesk,
                      h(20) as TextStyle,
                      {
                        color: Colors.light.textGrey,
                        borderColor: colors.transparent,
                        borderWidth: 0,
                        flex: 1,
                      },
                    ]}
                    placeholderTextColor={Colors.light.textGrey}
                    cursorColor={Colors.light.textGrey}
                    placeholder="Enter Location"
                    value=""
                  />
                </View>

                <View
                  style={[wFull, flex, itemsCenter, h(52), gap(10), px(24)]}
                >
                  <TouchableOpacity style={[]}>
                    <Image
                      style={[image.w(15), image.h(20)]}
                      source={images.locationImage}
                    />
                  </TouchableOpacity>

                  <Text
                    style={[
                      fs14,
                      fw500,
                      neurialGrotesk,
                      c(Colors.light.textGrey),
                      {
                        borderColor: colors.transparent,
                        borderWidth: 0,
                        flex: 0.8,
                      },
                    ]}
                  >
                    Obafemi Awolowo Uni..
                  </Text>
                </View>
              </View>
            </Dialog.Content>

            <Dialog.Actions style={[]}>
              <TouchableOpacity
                onPress={() =>
                  setModalState((prev) => ({ ...prev, visible: false }))
                }
                style={[
                  wFull,
                  h(50),
                  flex,
                  itemsCenter,
                  justifyCenter,
                  gap(10),
                  bg(Colors.light.background),
                  rounded(10),
                ]}
              >
                <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>
                  Save
                </Text>
                <Image
                  style={[image.w(20), image.h(20)]}
                  source={images.proceedCheckImage}
                />
              </TouchableOpacity>
            </Dialog.Actions>
          </CustomModal>
          {/* Modal */}
        </View>
      </View>
    </PaddedScreen>
  );
};

const RecentDropoffLocations = () => {
  const dispatch = useAppDispatch();
  const { bottomSheet } = LayoutSelectors();
  const { showBottomSheet } = useBottomSheet();
  const {
    stateInput: { dropoffBusstopInput },
  } = RideSelectors();

  const { token } = useAppSelector((state: RootState) => state.user);

  const [searchState, setSearchState] = useState({
    loading: false,
    busstops: [],
    inputting: false,
    searchText: "",
  });
  const { loading, busstops, inputting, searchText } = searchState;

  const searchBusstops = async (query: string) => {
    setSearchState((prev) => ({ ...prev, loading: true }));

    const returnedData = await FetchService.getWithBearerToken({
      url: `/user/rider/me/busstop/search?searchValue=${query}`,
      token: token as string,
    });
    console.log(returnedData);

    setSearchState((prev) => ({ ...prev, loading: false }));

    const busstops = returnedData?.matchSearchBusStops as IAddress[];
    if (busstops) {
      setSearchState((prev) => ({ ...prev, busstops: busstops as never[] }));
      dispatch(setSavedAddresses(busstops));
    }
  };

  const { width, height } = Dimensions.get("window");

  const [modalState, setModalState] = useState({
    visible: false,
  });
  const { visible } = modalState;

  return (
    <PaddedScreen>
      <View style={[flexCol, gap(56), mt(20)]}>
        <View style={[flexCol, gap(20), relative]}>
          <BottomSheetTitle
            title="Drop off bus stop"
            onPressFn={() => {
              showBottomSheet([601], <RecentLocationsSnippet />, true);
              router.setParams({ query: "RecentLocationsSnippet" });
            }}
          />

          <View
            style={[
              wFull,
              h(52),
              rounded(10),
              py(16),
              px(24),
              bg("#F9F7F8"),
              flex,
              gap(10),
              itemsCenter,
              justifyCenter,
            ]}
          >
            <TouchableOpacity>
              <Image
                style={[image.w(15), image.h(20)]}
                source={images.locationImage}
              />
            </TouchableOpacity>

            <BottomSheetTextInput
              onFocus={() =>
                setSearchState((prev) => ({ ...prev, inputting: true }))
              }
              onBlur={() =>
                setSearchState((prev) => ({ ...prev, inputting: false }))
              }
              style={[
                fs14,
                fw500,
                h(20) as TextStyle,
                {
                  color: Colors.light.textGrey,
                  borderColor: colors.transparent,
                  borderWidth: 0,
                  flex: 0.8,
                },
              ]}
              placeholderTextColor={Colors.light.textGrey}
              cursorColor={Colors.light.textGrey}
              placeholder="Enter Location"
              value={searchText}
              onChangeText={(text) => {
                setSearchState((prev) => ({ ...prev, searchText: text }));
                searchBusstops(text);
                // dispatch(
                //   setStateInputField({ key: "pickupBusstopInput", value: text })
                // )
              }}
            />

            <Image
              style={[image.w(22), image.h(22)]}
              source={images.pickUpImage}
            />
          </View>

          {(inputting || dropoffBusstopInput?.name != "") && (
            <View style={[relative, wFull, h(10), mt(-32)]}>
              {!loading ? (
                <ScrollView
                  style={[
                    absolute,
                    top0,
                    left0,
                    zIndex(20),
                    wFull,
                    bg(colors.white),
                    h(176),
                    flexCol,
                    gap(30),
                    py(16),
                    px(24),
                    bg("#F9F7F8"),
                    { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 },
                  ]}
                >
                  {(busstops as IBusStop[])?.map((busstop, index) => (
                    <Text
                      onPress={() => {
                        setSearchState((prev) => ({
                          ...prev,
                          searchText: busstop.name,
                        }));
                        dispatch(
                          setStateInputField({
                            key: "dropoffBusstopInput",
                            value: busstop,
                          })
                        );
                      }}
                      style={[h(30) as TextStyle]}
                      key={index}
                    >
                      {busstop?.name}
                    </Text>
                  ))}
                </ScrollView>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          )}

          <View style={[wFull, h(350), flexCol, gap(32)]}>
            <View style={[wFull, flex, itemsCenter, gap(15)]}>
              <Image
                style={[image.w(21.77), image.h(20)]}
                source={images.recentImage}
              />

              <Text style={[colorBlack, neurialGrotesk, fw400, fs14]}>
                Recent locations
              </Text>
            </View>

            <BottomSheetFlatList
              style={[wFull, h(75 * busstops.length), flexCol, gap(16)]}
              horizontal={false}
              data={busstops as IBusStop[]}
              renderItem={({ item }) => (
                <TouchableOpacity style={[wFull]}>
                  <View
                    style={[wFull, h(59), flex, itemsCenter, justifyBetween]}
                  >
                    <View style={[flexCol, itemsStart, gap(12)]}>
                      <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>
                        {item.name}
                      </Text>

                      <Text
                        style={[
                          neurialGrotesk,
                          fw400,
                          fs12,
                          c(Colors.light.textGrey),
                        ]}
                      >{`${item.name} ${item.name} ${item.name} ${item.name}`}</Text>
                    </View>

                    <View
                      style={[w("auto"), h(18.06), gap(32), flex, itemsCenter]}
                    >
                      <Text style={[neurialGrotesk, fw400, fs14, colorBlack]}>
                        0.8km
                      </Text>

                      <Pressable
                        onPress={() => {
                          setModalState((prev) => ({ ...prev, visible: true }));
                        }}
                      >
                        <Image
                          style={[image.w(14), image.h(18.06)]}
                          source={images.saveLocationImage}
                        />
                      </Pressable>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    wFull,
                    h(16),
                    bg(colors.transparent),
                    {
                      borderBottomWidth: 0.7,
                      borderBottomColor: Colors.light.border,
                    },
                  ]}
                />
              )}
              keyExtractor={({ _id }) => (_id as any).toString()}
            />
          </View>

          {/* Modal */}
          <CustomModal
            isVisible={visible}
            onClose={() => {}}
            style={{
              width: width,
              paddingLeft: 8,
              paddingRight: 8,
              backgroundColor: colors.white,
              padding: 0,
            }}
            closeBtn={
              <TouchableOpacity
                onPress={() => {
                  setModalState((prev) => ({ ...prev, visible: false }));
                  router.setParams({ space: null });
                }}
                style={[
                  tw`bg-[#00BF63] w-[70px] h-[70px] flex flex-row items-center justify-center rounded-full absolute z-[5]`,
                  { top: height * 0.75, right: 20 },
                ]}
              >
                <AntDesign name="close" size={26} color="white" />
              </TouchableOpacity>
            }
          >
            <Dialog.Title style={[pXAuto as TextStyle]}>
              <View
                style={[
                  wFull,
                  flex,
                  itemsCenter,
                  justifyCenter,
                  gap(16),
                  pb(16),
                  {
                    borderBottomWidth: 0.7,
                    borderBottomColor: Colors.light.border,
                  },
                ]}
              >
                <Image
                  style={[image.w(14), image.h(18.06)]}
                  source={images.saveLocationImage}
                />

                <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>
                  Save Bus Stop
                </Text>
              </View>
            </Dialog.Title>

            <Dialog.Content>
              <View style={[wFull, flexCol, gap(10)]}>
                <View style={[wFull, flex, gap(10), py(16), px(24)]}>
                  <TextInput
                    style={[
                      fs14,
                      fw500,
                      neurialGrotesk,
                      h(20) as TextStyle,
                      {
                        color: Colors.light.textGrey,
                        borderColor: colors.transparent,
                        borderWidth: 0,
                        flex: 1,
                      },
                    ]}
                    placeholderTextColor={Colors.light.textGrey}
                    cursorColor={Colors.light.textGrey}
                    placeholder="Enter Location"
                    value=""
                  />
                </View>

                <View
                  style={[wFull, flex, itemsCenter, h(52), gap(10), px(24)]}
                >
                  <TouchableOpacity style={[]}>
                    <Image
                      style={[image.w(15), image.h(20)]}
                      source={images.locationImage}
                    />
                  </TouchableOpacity>

                  <Text
                    style={[
                      fs14,
                      fw500,
                      neurialGrotesk,
                      c(Colors.light.textGrey),
                      {
                        borderColor: colors.transparent,
                        borderWidth: 0,
                        flex: 0.8,
                      },
                    ]}
                  >
                    Obafemi Awolowo Uni..
                  </Text>
                </View>
              </View>
            </Dialog.Content>

            <Dialog.Actions style={[]}>
              <TouchableOpacity
                onPress={() =>
                  setModalState((prev) => ({ ...prev, visible: false }))
                }
                style={[
                  wFull,
                  h(50),
                  flex,
                  itemsCenter,
                  justifyCenter,
                  gap(10),
                  bg(Colors.light.background),
                  rounded(10),
                ]}
              >
                <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>
                  Save
                </Text>
                <Image
                  style={[image.w(20), image.h(20)]}
                  source={images.proceedCheckImage}
                />
              </TouchableOpacity>
            </Dialog.Actions>
          </CustomModal>
          {/* Modal */}
        </View>
      </View>
    </PaddedScreen>
  );
};

const FilledForm = () => {
  const dispatch = useAppDispatch();
  const [[isLoading, session], setSession] = useStorageState("token");
  const {} = AccountSelectors();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const {
    stateInput: { pickupBusstopInput, dropoffBusstopInput },
  } = RideSelectors();
  const { notify } = useSnackbar();
  const searchParams = useGlobalSearchParams();
  const { query } = useGlobalSearchParams();

  let [inputting, setInputting] = useState({
    pickupBusstop: false,
    dropoffpickupBusstop: false,
  });
  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { loading, code, msg } = fetchState;

  const onChange = (key: string, val: boolean) =>
    setInputting((prev) => ({ ...prev, [key]: val }));

  const findRidePlans = async () => {
    try {
      setFetchState((prev) => ({ ...prev, loading: true }));
      await fetch(`${URLS.baseUrl}/user/rider/me/ride-plans`, {
        method: "POST",
        body: JSON.stringify({
          pickupBusstopId: pickupBusstopInput?._id,
          dropoffBusstopId: dropoffBusstopInput?._id,
        }),
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          const data = await res.json();

          const code = data?.code;
          const msg = data?.msg;
          const status = data?.status;

          setFetchState((prev) => ({ ...prev, loading: false, msg, code }));
          const ridePlan = data?.ridePlan;

          dispatch(setState({ key: "ridePlans", value: [ridePlan] }));

          if (code == 200) {
            showBottomSheet([477, 601], <RideRouteDetails />, true);
            router.setParams({ query: "RideRouteDetails" });
          }
          if (code === 400) {
            dispatch(
              setState({ key: "riderRideDetails", value: data?.riderRide })
            );
            dispatch(
              setState({
                key: "selectedAvailableRide",
                value: data?.currentRide,
              })
            );
            dispatch(setState({ key: "driverDetails", value: data?.driver }));
            router.setParams({ requestId: data?.riderRide?._id });

            if (status === "requesting") {
              showBottomSheet(
                [477, 601],
                <RideRouteDetails code={200} msg={data?.msg} />,
                true
              );
            }
            if (status === "started") {
              showBottomSheet([500], <TripStartedSheet />);
              router.setParams({ ...searchParams, query: "RideStarted" });
              router.push(
                `/(rideScreens)/bookRide?selectedAvailableRideId=${data?.riderRide?.currentRideId}&requestId=${data?.riderRide?._id}`
              );
            }
            if (status === "ended") {
              showBottomSheet([500], <TripCompletedSheet />, true);
              router.setParams({ ...searchParams, query: "RideEnded" });
              router.push(
                `/(rideScreens)/bookRide?selectedAvailableRideId=${data?.riderRide?.currentRideId}&requestId=${data?.riderRide?._id}`
              );
            }
            if (status === "booked") {
              router.setParams({ ...searchParams, query: "RideBooked" });
              dispatch(
                setState({ key: "sameTickets", value: [data?.ticketPaid] })
              );
              router.push(
                `/(rideScreens)/bookRide?selectedAvailableRideId=${data?.riderRide?.currentRideId}&requestId=${data?.riderRide?._id}?query='RideBooked'`
              );
              showBottomSheet(
                [800],
                <RideBookedSheet rideId={data?.riderRide?._id} />,
                true
              );
            }
            if (status == "accepted") {
              hideBottomSheet();
              router.push(
                `/(rideScreens)/availableRides?selectedAvailableRideId=${data?.riderRide?.currentRideId}&requestId=${data?.riderRide?._id}`
              );
            }
          }
        })
        .catch((err) => {
          setFetchState((prev) => ({ ...prev, loading: false }));
          console.log({ err });
        });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <PaddedScreen>
      <View style={[flexCol, gap(56), mt(20)]}>
        <View style={[flexCol, gap(20)]}>
          <BottomSheetTitle
            title="Pick up bus stop"
            onPressFn={() => {
              showBottomSheet([601], <RecentLocationsSnippet />);
            }}
          />

          <View
            style={[
              wFull,
              h(52),
              rounded(10),
              py(16),
              px(24),
              bg("#F9F7F8"),
              flex,
              gap(10),
              itemsCenter,
              justifyCenter,
            ]}
          >
            <TouchableOpacity>
              <Image
                style={[image.w(15), image.h(20)]}
                source={images.locationImage}
              />
            </TouchableOpacity>

            <TextInput
              style={[
                fs14,
                fw500,
                h(20) as TextStyle,
                {
                  color: Colors.light.textGrey,
                  borderColor: colors.transparent,
                  borderWidth: 0,
                  flex: 0.8,
                },
              ]}
              placeholderTextColor={Colors.light.textGrey}
              cursorColor={Colors.light.textGrey}
              placeholder="Enter Location"
              // onFocus={() => onChange("pickupBusstop", true)}
              // onBlur={() => onChange("pickupBusstop", false)}
              // value={pickupBusstopInput?.name}
              value={pickupBusstopInput?.name}
              // onChangeText={(text) => dispatch(setStateInputField({ key: 'pickupBusstopInput', value: text }))}
            />
          </View>
        </View>

        <View style={[flexCol, gap(20)]}>
          <View style={[wFull, flex, itemsCenter, justifyBetween]}>
            <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>
              Drop off bus stop
            </Text>
          </View>

          <View
            style={[
              wFull,
              h(52),
              rounded(10),
              py(16),
              px(24),
              bg("#F9F7F8"),
              flex,
              gap(10),
              itemsCenter,
              justifyCenter,
            ]}
          >
            <TouchableOpacity>
              <Image
                style={[image.w(15), image.h(20)]}
                source={images.locationImage}
              />
            </TouchableOpacity>

            <BottomSheetTextInput
              style={[
                fs14,
                fw500,
                h(20) as TextStyle,
                {
                  color: Colors.light.textGrey,
                  borderColor: colors.transparent,
                  borderWidth: 0,
                  flex: 0.8,
                },
              ]}
              placeholderTextColor={Colors.light.textGrey}
              cursorColor={Colors.light.textGrey}
              placeholder="Enter Destination"
              // onFocus={() => onChange("pickupBusstop", true)}
              // onBlur={() => onChange("pickupBusstop", false)}
              // value={dropoffBusstopInput?.name}
              value={dropoffBusstopInput?.name}
              // onChangeText={(text) => dispatch(setStateInputField({ key: 'dropoffBusstopInput', value: text }))}
            />
          </View>
          {/* 
          {inputting.dropoffpickupBusstop && (
            <View style={[relative, wFull, h(10), mt(-32)]}>
              <ScrollView
                style={[
                  absolute,
                  top0,
                  left0,
                  zIndex(20),
                  wFull,
                  bg(colors.white),
                  h(176),
                  flexCol,
                  gap(30),
                  py(16),
                  px(24),
                  bg("#F9F7F8"),
                  { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 },
                ]}
              >
                {["", "", "", "", "", "", "", ""].map((_, index) => (
                  <Text style={[h(30) as TextStyle]} key={index}>
                    meeee
                  </Text>
                ))}
              </ScrollView>
            </View>
          )} */}
        </View>

        {msg?.length > 0 && (code !== 200 || code != 201) && (
          <Text style={[fs10, c(colors.red500)]}>{msg}</Text>
        )}

        <TouchableOpacity
          onPress={() => {
            findRidePlans();
          }}
          style={[flexCenter]}
        >
          {!loading ? (
            <View
              style={[
                wFull,
                h(50),
                rounded(10),
                flex,
                itemsCenter,
                justifyCenter,
                gap(10),
                bg(Colors.light.background),
              ]}
            >
              <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>
                Proceed
              </Text>

              <Image
                style={[image.w(20), image.h(20)]}
                source={images.proceedCheckImage}
              />
            </View>
          ) : (
            <ActivityIndicator style={[h(50), w(50)]} />
          )}
        </TouchableOpacity>
      </View>
    </PaddedScreen>
  );
};

const RideRouteDetails = ({
  code,
  msg,
}: {
  code?: number | null;
  msg?: string;
}) => {
  const { showBottomSheet } = useBottomSheet();
  const {
    stateInput: {
      pickupBusstopInput,
      dropoffBusstopInput,
      userCounterFareInput,
    },
  } = RideSelectors();
  const dispatch = useAppDispatch();

  const [[isLoading, session], setSession] = useStorageState("token");
  const [formData, setFormData] = useState({
    riderCounterOffer: "",
  });
  const { riderCounterOffer } = formData;
  const { ridePlans } = useAppSelector((state: RootState) => state.ride);

  const [plans, setPlans] = useState(
    // ridePlans.map((plan, index) => ({ ...plan, selected: false, id: index }))
    ridePlans.map((plan, index) => ({ ...plan, selected: true, id: index }))
  );

  // const selectPlan = (id: number) => {
  const selectPlan = (plan: {
    ride: { rideFee: number };
    planName: "standard";
    serviceFee: number;
    riderTolerance: number;
    driverTolerance: number;
    vehicleSeats: number;
    _id: string;
  }) => {
    // const newPlans = plans.map((plan) =>
    //   plan.id == id
    //     ? { ...plan, selected: plan?.selected == true ? false : true }
    //     : plan
    // );

    // setPlans(newPlans);

    // const selectedPlan = plans.find((plan) => plan.id == id && plan.selected == true);
    // const selectedPlan = plans.find((plan) => plan.id == id);
    // console.log({ selectedPlan });

    dispatch(setStateInputField({ key: "selectedPlan", value: plan }));
  };

  return (
    <PaddedScreen>
      <View style={[flexCol, gap(56), mt(20)]}>
        <View style={[wFull, flexCol, gap(20)]}>
          <BottomSheetTitle
            title=""
            onPressFn={() => {
              showBottomSheet([436, 601], <FilledForm />);
            }}
          />

          {ridePlans?.map(({ plan }, index) => (
            <TouchableOpacity
              onPress={() => selectPlan(plan)}
              style={[
                wFull,
                flex,
                itemsCenter,
                justifyBetween,
                py(17),
                px(9),
                bg("#F9F7F8"),
                rounded(8),
                // plan?.selected == true || ridePlans[0] != null
                plan != null
                  ? border(0.7, Colors.light.background)
                  : border(0.7, colors.grey500),
              ]}
              key={index}
            >
              <Image
                style={[image.w(50), image.h(18)]}
                source={images.carImage}
              />

              <View style={[flexCol, gap(12), { flex: 0.8 }]}>
                <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>
                  Standard Ride
                </Text>

                <View style={[flex, h(14.73), gap(4), itemsCenter]}>
                  <Image
                    style={[image.w(18), image.h(14.73)]}
                    source={images.passengersImage}
                  />

                  <Text style={[fw400, fs12, c(Colors.light.border)]}>
                    {plan?.vehicleSeats} seats
                  </Text>
                </View>
              </View>

              <Text style={[fw400, fs14, colorBlack]}>
                ₦{plan?.ride?.rideFee}
              </Text>
            </TouchableOpacity>
          ))}

          <View
            style={[
              wFull,
              py(20),
              flexCol,
              gap(16),
              {
                borderTopWidth: 0.7,
                borderTopColor: Colors.light.border,
                borderBottomWidth: 0.7,
                borderBottomColor: Colors.light.border,
              },
            ]}
          >
            <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.border)]}>
              Want to send a counter offer?
            </Text>

            <View
              style={[
                wFull,
                h(50),
                rounded(10),
                p(16),
                flex,
                justifyStart,
                itemsCenter,
                gap(10),
                bg(colors.white),
                {
                  borderWidth: 0.7,
                  borderColor:
                    code == 400 ? Colors.light.error : Colors.light.border,
                },
              ]}
            >
              <Image
                style={[image.w(14), image.h(10)]}
                source={images.rideOfferImage}
              />

              <BottomSheetTextInput
                style={[
                  fs14,
                  fw500,
                  h(20) as TextStyle,
                  {
                    color:
                      code == 400 ? Colors.light.error : Colors.light.textGrey,
                    borderColor: colors.transparent,
                    borderWidth: 0,
                    flex: 0.8,
                  },
                ]}
                keyboardType="number-pad"
                placeholderTextColor={Colors.light.textGrey}
                cursorColor={Colors.light.textGrey}
                placeholder="Input your offer"
                value={riderCounterOffer}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, riderCounterOffer: text }));
                  router.setParams({ riderCounterOffer: text });
                }}
              />
            </View>

            {code == 400 && (
              <View style={[wFull, flex, itemsCenter, justifyStart, gap(12)]}>
                <Image
                  style={[image.w(20), image.h(21), { objectFit: "contain" }]}
                  source={images.cautionImage}
                />

                {code == 400 && (
                  <Text style={[fw400, fs12, c(Colors.light.error)]}>
                    {/* Offer too low to work with */}
                    {msg}
                  </Text>
                )}
              </View>
            )}

            {code == 200 && (
              <Text style={[fw400, fs12, c(colors.black)]}>{msg}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            showBottomSheet(
              [400],
              <SearchingRide riderCounterOffer={riderCounterOffer} />,
              true
            );
            router.setParams({ query: "SearchingRide" });
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
              bg(Colors.light.background),
            ]}
          >
            <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>
              Find Available Rides
            </Text>

            <Image
              style={[image.w(20), image.h(20)]}
              source={images.proceedCheckImage}
            />
          </View>
        </TouchableOpacity>
      </View>
    </PaddedScreen>
  );
};

const SearchingRide = ({
  riderCounterOffer,
}: {
  riderCounterOffer: string;
}) => {
  const dispatch = useAppDispatch();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const { price, duration, seats } = useAppSelector(
    (state: RootState) => state.ride
  );

  const {
    stateInput: {
      pickupBusstopInput,
      dropoffBusstopInput,
      userCounterFareInput,
      selectedPlan,
    },
  } = RideSelectors();
  const [[isLoading, session], setSession] = useStorageState("token");
  const searchParams = useGlobalSearchParams();
  const { riderRideDetails, selectedAvailableRide, ridePlans } = useAppSelector(
    (state: RootState) => state.ride
  );
  const { requestId } = useGlobalSearchParams();

  let interval: any;
  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, msg, loading } = fetchState;

  const findAvailableRides = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));

    const returnedData = await FetchService.postWithBearerToken({
      url: "/user/rider/me/available-rides/find",
      data: {
        pickupBusstopId: pickupBusstopInput?._id,
        dropoffBusstopId: dropoffBusstopInput?._id,
        userCounterOffer: riderCounterOffer,
        // ridePlan: selectedPlan?.plan,
        ridePlan: ridePlans[0]?.plan,
        // routeId: selectedPlan?.routeId,
        routeId: ridePlans[0]?.routeId,
      },
      token: session as string,
    });

    const code = returnedData?.code;
    const status = returnedData?.status;
    const userRideSaved = returnedData?.userRideSaved;

    setFetchState((prev) => ({
      ...prev,
      loading: false,
      msg: returnedData?.msg,
      code,
    }));

    if (code == 201 || code == 200) {
      dispatch(setState({ key: "riderRideDetails", value: userRideSaved }));
    }

    if (code === 400) {
      if (!status) {
        showBottomSheet([477, 601], <RideRouteDetails code={code} msg={msg} />);
        return;
      }
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

      if (status === "requesting") {
        showBottomSheet(
          [477, 601],
          <RideRouteDetails code={200} msg={returnedData?.msg} />,
          true
        );
      }
      if (status === "started") {
        showBottomSheet([500], <TripStartedSheet />);
        router.setParams({ ...searchParams, query: "RideStarted" });
        router.push(
          `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${returnedData?.riderRide?._id}`
        );
      }
      if (status === "ended") {
        showBottomSheet([500], <TripCompletedSheet />, true);
        router.setParams({
          ...searchParams,
          query: "RideEnded",
          riderCounterOffer,
        });
        router.push(
          `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${returnedData?.riderRide?._id}`
        );
      }
      if (status === "booked") {
        router.setParams({ ...searchParams, query: "RideBooked" });
        dispatch(
          setState({ key: "sameTickets", value: [returnedData?.ticketPaid] })
        );
        router.push(
          `/(rideScreens)/bookRide?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${returnedData?.riderRide?._id}`
        );
        showBottomSheet(
          [800],
          <RideBookedSheet rideId={returnedData?.riderRide?._id} />,
          true
        );
      }
      if (status == "accepted") {
        hideBottomSheet();
        router.push(
          `/(rideScreens)/availableRides?selectedAvailableRideId=${returnedData?.riderRide?.currentRideId}&requestId=${returnedData?.riderRide?._id}`
        );
      }
    }
  };

  const cancelRide = async () => {
    // run some async db stuffs
    hideBottomSheet();
    router.push(`/(tab)/` as Href);
  };

  useEffect(() => {
    router.setParams({ query: "SearchingRide", riderCounterOffer });
  }, []);

  useEffect(() => {
    findAvailableRides();
  }, []);

  const channel = supabase.channel(`ride_accepting`);
  channel
    .on("broadcast", { event: "ride_accepted" }, (payload) => {
      const ride = payload?.payload;
      console.log('====================================');
      console.log({requestId:requestId || riderRideDetails?._id, ride});
      console.log('====================================');

      if(String(ride?._id) === String(requestId) || String(riderRideDetails?._id)) {
        router.push(
          `/(rideScreens)/availableRides?selectedAvailableRideId=${ride?._id || 
            selectedAvailableRide?._id
          }&requestId=${requestId || riderRideDetails?._id}`
        );
      }
     
    })
    .subscribe();

  return (
    <PaddedScreen>
      <View style={[wHFull, flexCol, itemsCenter, gap(44)]}>
        <View style={[flexCol, itemsCenter, gap(16)]}>
          <View style={[flex, gap(16)]}>
            <Image
              style={[image.w(30), image.h(25.91)]}
              source={images.yellowTripImage}
            />

            <Text style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}>
              Searching for Rides
            </Text>
          </View>

          <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>
            Searching for nearby available rides
          </Text>

          {code == 201 && <Text style={[c(colors.green500), fs10]}>{msg}</Text>}
        </View>

        <ScaleUpDown>
          <Image
            style={[image.w(120), image.h(120)]}
            source={images.searchingRideImage}
          />
        </ScaleUpDown>

        <TouchableOpacity
          onPress={cancelRide}
          style={[
            bg("#F9F7F8"),
            wFull,
            h(50),
            rounded(10),
            flex,
            itemsCenter,
            justifyCenter,
            gap(10),
            { borderWidth: 0.7, borderColor: Colors.light.border },
          ]}
        >
          <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw700, fs16]}>
            Cancel
          </Text>

          <Image
            style={[image.w(20), image.h(20)]}
            source={images.cancelImage}
          />
        </TouchableOpacity>
      </View>
    </PaddedScreen>
  );
};

export {
  RecentLocationsSnippet,
  RecentPickupLocations,
  RecentDropoffLocations,
  FilledForm,
  RideRouteDetails,
  SearchingRide,
};
