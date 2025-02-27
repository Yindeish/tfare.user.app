import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import PaddedScreen from "@/components/shared/paddedScreen";
import { fonts } from "@/constants/fonts";
import Colors, { colors } from "@/constants/Colors";
import {
  flex,
  flexCol,
  gap,
  hFull,
  itemsCenter,
  itemsEnd,
  itemsStart,
  justifyBetween,
  wFull,
} from "@/utils/styles";
import {
  c,
  colorBlack,
  colorTextGrey,
  fs12,
  fs14,
  fs16,
  fw400,
  fw600,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { images } from "@/constants/images";
import { image } from "@/utils/imageStyles";
import { router } from "expo-router";
import { pages } from "@/constants/pages";
import { IRiderRideDetails } from "@/state/types/ride";
import { Utils } from "@/utils";
import { getItemAsync } from "expo-secure-store";
import FetchService from "@/services/api/fetch.service";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";

const {} = StyleSheet.create({});

interface IItem {
  name: string;
  startTime: string;
  endTime: string;
  amount: string;
  routeID: string;
}

export default function TripHistory() {

  // const DATA: IItem[] = [
  //     {
  //         name: 'Dugbe Bus Stop',
  //         amount: '0000.00',
  //         endTime: 'Apr 14, 2024',
  //         routeID: '1234567ABC',
  //         startTime: '8:41 AM'
  //     },
  //     {
  //         name: 'Dugbe Bus Stop',
  //         amount: '0000.00',
  //         endTime: 'Apr 14, 2024',
  //         routeID: '1234567DBC',
  //         startTime: '8:41 AM'
  //     },
  //     {
  //         name: 'Dugbe Bus Stop',
  //         amount: '0000.00',
  //         endTime: 'Apr 14, 2024',
  //         routeID: '1234567CBC',
  //         startTime: '8:41 AM'
  //     },
  // ];

  const [fetchState, setFetchState] = useState<{
    loading: boolean;
    msg: string;
    code: number | null;
    history: IRiderRideDetails[];
  }>({
    loading: false,
    msg: "",
    code: null,
    history: [],
  });
  const { loading, history, code, msg } = fetchState;

  const getHistory = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));
    const returnedData = await FetchService.getWithBearerToken({
      url: `/user/rider/me/ride/ride-history?status=${"scheduled"}`,
      token: (await getItemAsync("token")) as string,
    });

    const rideHistory = returnedData?.rideHistory;
    setFetchState((prev) => ({
      ...prev,
      loading: false,
      history: rideHistory,
    }));
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <PaddedScreen styles={{ marginTop: 12, height: "auto" }}>
      <View style={[flexCol, { gap: 32 }]}>
        <View style={[wFull, flex, itemsCenter, justifyBetween]}>
          <Text style={[colorBlack, neurialGrotesk, fw700, fs16]}>
            Trip History
          </Text>

          <TouchableOpacity
            onPress={() => {
              router.push("/(rideScreens)/tripHistory");
            }}
            style={[flex, itemsCenter, gap(4)]}
          >
            <Text
              style={[neurialGrotesk, c(Colors.light.textGrey), fw600, fs14]}
            >
              See all
            </Text>

            <Image
              source={images.expandImage}
              style={[image.w(20), image.h(20)]}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[flexCol, { gap: 32, height: (history?.length || 0) * 100 }]}
        >
          {history?.map((item, index) => (
            <View
              style={[
                flex,
                wFull,
                itemsStart,
                justifyBetween,
                {
                  paddingRight: 16,
                  paddingBottom: 16,
                  height: 59,
                  borderBottomWidth: 0.7,
                  borderBottomColor: Colors.light.border,
                },
              ]}
              key={index}
            >
              <View style={[flexCol, itemsStart, justifyBetween, hFull]}>
                <Text style={[fw700, fs14, colorBlack]}>
                  {item?.dropoffBusstop?.name}
                </Text>
                <Text style={[colorTextGrey, fs12, fw400]}>{`${Utils.formatTime(
                  item?.createdAt
                )} - ${Utils.formatDate(item?.updatedAt)}`}</Text>
              </View>

              <View style={[flexCol, itemsEnd,justifyBetween, hFull]}>
                <Text style={[fw400, fs14, { color: "#27AE65" }]}>{`₦ ${
                  Number((item?.ridePlan as any)?.serviceFee) +
                  Number(item?.riderCounterOffer)
                }`}</Text>
                <Text
                  style={[colorTextGrey, fw400, fs12]}
                >{`# ${item?._id}`}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </PaddedScreen>
  );
}
