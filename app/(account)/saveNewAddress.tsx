import {
  View,
  Text,
  Image,
  TextInput,
  ViewStyle,
  TextStyle,
} from "react-native";
import React, { useEffect, useState } from "react";
import SafeScreen from "@/components/shared/safeScreen";
import PaddedScreen from "@/components/shared/paddedScreen";
import { image, wHFull } from "@/utils/imageStyles";
import {
    absolute,
  bg,
  flex,
  flexCol,
  gap,
  h,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  left0,
  mt,
  p,
  px,
  py,
  relative,
  rounded,
  top0,
  wFull,
  zIndex,
} from "@/utils/styles";
import Colors, { colors } from "@/constants/Colors";
import { images } from "@/constants/images";
import {
  c,
  colorBlack,
  colorWhite,
  fs12,
  fs14,
  fs18,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import AccountPageTitle from "@/components/shared/pageTitle";
import { Href, router } from "expo-router";
import { tabs } from "@/constants/tabs";
import { TouchableOpacity } from "react-native-gesture-handler";
import EmergencyContactListTile from "@/components/page/emergencyContactsListTile";
import AccountSelectors from "@/state/selectors/account";
import { pages } from "@/constants/pages";
import AddNewContactListTile from "@/components/page/AddNewContactListTile";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import {
  setEmergencyContactField,
  setSaveAddressesField,
} from "@/state/slices/account";
import {
    IAddress,
  IStateInputAddNewContact,
  IStateInputSaveNewAddress,
} from "@/state/types/account";
import { number, ObjectSchema, string } from "yup";
import { useSession } from "@/contexts/userTokenContext";
import { useFormik } from "formik";
import FetchService from "@/services/api/fetch.service";
import ErrorMsg from "@/components/shared/error_msg";
import { ActivityIndicator } from "react-native";
import { ScrollView } from "react-native";
import tw from "@/constants/tw";
import { IBusStop } from "@/state/types/ride";
import { setStateInputField } from "@/state/slices/ride";

export default function SaveNewAddress() {
  const dispatch = useAppDispatch();
  const {} = AccountSelectors();

  const { tokenSession } = useSession();

  const [state, setState] = useState({
    msg: "",
    code: null,
    loading: false,
    busstops: [],
    inputtingLocation: false,
    saving: false,
    busstopInput: null
  });
  const { code, msg, loading, busstops, inputtingLocation, saving, busstopInput } = state;

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue
  } = useFormik({
    initialValues: {
      busstopName: (busstopInput as any)?.name,
      busstopTitle: "",
    },
    validationSchema: new ObjectSchema({
      busstopName: string().required(),
      busstopTitle: string().required(),
    }),
    onSubmit: async ({ busstopName, busstopTitle }) => {
      setState((prev) =>({...prev, saving: true}))
      onChange({ key: "msg", value: "" });

      const returnedData = await FetchService.postWithBearerToken({
        token: tokenSession as string,
        url: "/user/rider/me/busstop/save",
        data: { name: busstopName, city: (busstopInput as any)?.city, busstopTitle },
      });

      setState((prev) =>({...prev, saving: false}))
      onChange({ key: "code", value: returnedData?.code });
      onChange({ key: "msg", value: returnedData.msg });

      if (returnedData?.code == 200 || returnedData?.code == 201) {
        setValues({
          busstopName: "",
          busstopTitle: "",
        });
        router.push("/(account)/savedAddresses");
      }
    },
  });

  const onChange = ({
    key,
    value,
  }: {
    key: "code" | "msg" | "loading";
    value: string | number | boolean;
  }) => setState((prev) => ({ ...prev, [key]: value }));

  const searchBusstops = async (query: string) => {
    setState((prev) => ({ ...prev, loading: true }));

    const returnedData = await FetchService.getWithBearerToken({
      url: `/user/rider/me/busstop/search?searchValue=${query}`,
      token: tokenSession as string,
    });

    setState((prev) => ({ ...prev, loading: false }));

    const busstops = returnedData?.matchSearchBusStops as IAddress[];
    console.log({ busstops });
    if (busstops) {
      setState((prev) => ({ ...prev, busstops: busstops as never[] }));
      // dispatch(setSavedAddresses(busstops));
    }
  };

  // Updating search
    useEffect(() => {
      inputtingLocation && searchBusstops(values.busstopName as string);
    }, [values.busstopName, inputtingLocation]);
    // Updating search

  return (
    <SafeScreen>
      <View style={[wHFull as ViewStyle]}>
        <PaddedScreen>
          {/* Page Header */}

          <View style={[wFull, flex, itemsCenter, justifyBetween, mt(47)]}>
            <AccountPageTitle
              title="Save New Address"
              onPress={() =>
                router.push(`/(account)/${pages.savedAddresses}` as Href)
              }
              style={[]}
            />
          </View>

          {/* Page Header */}

          {/* {loading && <ActivityIndicator />} */}

          <View style={[wFull, flexCol, gap(40), mt(28)]}>
            <View style={[wFull, flexCol, gap(16)]}>
              <View
                style={[
                  wFull,
                  h(50),
                  rounded(10),
                  py(16),
                  px(24),
                  flex,
                  gap(10),
                  bg("#F9F7F8"),
                ]}
              >
                <TextInput
                  onChangeText={handleChange("busstopTitle")}
                  onBlur={handleBlur("busstopTitle")}
                  value={values.busstopTitle}
                  autoCorrect={false}
                  placeholder={"Enter Address Name"}
                  style={[wHFull as TextStyle, { borderWidth: 0 }]}
                  // others
                  cursorColor={Colors.light.background}
                  selectionColor={colors.transparent}
                  underlineColorAndroid={colors.transparent}
                  placeholderTextColor={Colors.light.textGrey}
                />
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
                  onChangeText={handleChange("busstopName")}
                  onBlur={handleBlur("busstopName")}
                  onFocus={() => {
                    setState((prev) => ({
                      ...prev,
                      inputtingLocation: true
                    }));
                  }}
                  value={values.busstopName}
                  autoCorrect={false}
                  style={[
                    fs14,
                    fw500,
                    neurialGrotesk,
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
                />

                <TouchableOpacity>
                  <Image
                    style={[image.w(22), image.h(22)]}
                    source={images.pickUpImage}
                  />
                </TouchableOpacity>
              </View>

              {/* Suggestion Dropodwon */}
              {inputtingLocation && (
                <View style={[relative, wFull, h(10)]}>
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
                        {
                          borderBottomRightRadius: 10,
                          borderBottomLeftRadius: 10,
                        },
                      ]}
                    >
                      {(busstops as IBusStop[])?.map((busstop, index) => (
                        <TouchableOpacity
                          onPress={() => {
                            setFieldValue("busstopName", busstop?.name);
                            setState((prev) => ({
                              ...prev,
                              inputtingLocation: false,
                              pickupSearchText: busstop.name,
                              busstopInput: busstop as never
                            }));
                          }}
                          key={index}
                          style={tw``}
                        >
                          <Text style={[h(30) as TextStyle, tw``]}>
                            {busstop?.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : (
                    <ActivityIndicator />
                  )}
                </View>
              )}
              {/* Suggestion Dropodwon */}
            </View>

            <ErrorMsg msg={msg} code={code} />

            <TouchableOpacity disabled={saving} onPress={() => {
                if(!saving) handleSubmit();
                else return;
            }}>
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
                  Save
                </Text>

               {!saving ? ( <Image
                  style={[image.w(20), image.h(20)]}
                  source={images.proceedCheckImage}
                />): (<ActivityIndicator size={'small'} />)}
              </View>
            </TouchableOpacity>
          </View>
        </PaddedScreen>
      </View>
    </SafeScreen>
  );
}

{
  /* <View style={[wFull, h(50), rounded(10), py(16), px(24), flex, gap(10), bg('#F9F7F8')]}>
    <Image style={[image.w(icon.w as number), image.h(icon.h as number)]} source={icon.src} />}

    <TextInput
        onChangeText={(text) => input.onChangeText(input.fieldKey, text)}

        value={input.value} placeholder={input.palceHolder}

        style={[!icon.present ? wHFull : { flex: 0.8 }, { borderWidth: 0 }]}

        // others
        cursorColor={Colors.light.background}
        selectionColor={colors.transparent}
        keyboardType={'' || input.keyboardType}
        underlineColorAndroid={colors.transparent}
        placeholderTextColor={Colors.light.textGrey}
    />
</View> */
}
