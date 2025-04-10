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
  ViewStyle,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { ActivityIndicator, Button, Snackbar, Text } from "react-native-paper";
import React, { useEffect, useLayoutEffect } from "react";
import SafeScreen from "@/components/shared/safeScreen";
import { image, imgAbsolute, mYAuto, wHFull } from "@/utils/imageStyles";
import {
  absolute,
  bg,
  borderGrey,
  borderL,
  borderR,
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
  my,
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
import { Href, router, useNavigation } from "expo-router";
import PageTitle from "@/components/shared/pageTitle";
import TripBlock from "@/components/shared/tripBlock";
import InTripDropoffTile from "@/components/page/inTripDropoffsTile";
import CtaBtn from "@/components/shared/ctaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import BookSeatSheet from "@/components/page/bookSeatSheet";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import tw from "@/constants/tw";

const { height } = Dimensions.get("window");

function TripDetails() {
  const { showBottomSheet } = useBottomSheet();
  const dispatch = useAppDispatch();
  const { currentTrip, route, driverDetails } = useAppSelector(
    (state: RootState) => state.trip
  );


  return (
    <SafeScreen>
      <ScrollView style={[]}>
        {/* //!Trip Block */}
        <TripBlock />
        {/* //!Trip Block */}

        <PaddedScreen>
          {/* //!In Trip Dropoffs */}
          <View style={[flexCol, gap(16), mt(32), tw `pb-[150px]`]}>
            <Text style={[fw700, fs14, c(colors.black)]}>In-Trip Dropoffs</Text>

            {/* <View style={[flexCol, gap(16), bg('red'), h(height * 0.51), { overflow: 'scroll' }]}> */}
            <View style={[flexCol, gap(16), { overflow: "scroll" }]}>
              {route?.inTripDropoffs
                ?.map((dropoff, index) => ({
                  ...dropoff,
                  number: index + 1,
                }))
                ?.map((dropoff, index) => (
                  <InTripDropoffTile dropoff={dropoff} key={index} />
                ))}
            </View>
          </View>
          {/* //!In Trip Dropoffs */}
        </PaddedScreen>
      </ScrollView>
    </SafeScreen>
  );
}

export default TripDetails;
