import TripHistoryTabBtn from "@/components/page/tripHistoryTabBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors from "@/constants/Colors";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import FetchService from "@/services/api/fetch.service";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import RideSelectors from "@/state/selectors/ride";
import { setActiveTab } from "@/state/slices/ride";
import { IRiderRideDetails } from "@/state/types/ride";
import { Utils } from "@/utils";
import {
  colorBlack,
  colorTextGrey,
  fs12,
  fs14,
  fw400,
  fw700,
} from "@/utils/fontStyles";
import { wHFull } from "@/utils/imageStyles";
import {
  bg,
  flex,
  flexCol,
  gap,
  h,
  hFull,
  itemsEnd,
  itemsStart,
  justifyBetween,
  mt,
  wFull,
} from "@/utils/styles";
import { getItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View, ViewStyle } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native-paper";

function TripHistory() {
  const dispatch = useAppDispatch();
  const { activeTab } = RideSelectors();

  const [fetchState, setFetchState] = useState<{
    loading: boolean;
    msg: string;
    code: number | null;
    history: IRiderRideDetails[];
    status: 'completed' | 'pending' | 'cancelled';
  }>({
    loading: false,
    msg: "",
    code: null,
    history: [],
    status: 'completed',
  });
  const { loading, history, code, msg, status } = fetchState;

  const getHistory = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));
    const returnedData = await FetchService.getWithBearerToken({
      url: `/user/rider/me/ride/ride-history?status=${activeTab == 'pending'?'scheduled':activeTab}`,
      token: (await getItemAsync("token")) as string,
    });

    const rideHistory = returnedData?.rideHistory;
    setFetchState((prev) => ({ ...prev, loading: false, history: rideHistory }));
  };

  useEffect(() => {
    getHistory();
  }, [activeTab]);

  return (
    <SafeScreen>
      <PaddedScreen>
        <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={getHistory} />}
        >
          <View style={[wHFull] as ViewStyle[]}>
            {/* Page Header */}
            <PageTitle title="Ride History" onPress={() => {}} />
            {/* Page Header */}

            {/* Tab Header */}

            <View style={[wFull, h(45), flex]}>
              <TripHistoryTabBtn
                active={activeTab === "pending"}
                onPress={() => {
                  dispatch(setActiveTab("pending"));
                }}
                text="Pending"
              />
              <TripHistoryTabBtn
                active={activeTab === "completed"}
                onPress={() => dispatch(setActiveTab("completed"))}
                text="Completed"
              />
              <TripHistoryTabBtn
                active={activeTab === "cancelled"}
                onPress={() => dispatch(setActiveTab("cancelled"))}
                text="Cancelled"
              />
            </View>

            {/* Tab Header */}

            {/* Tab Body */}

            {!loading ? (<View style={[flexCol, h((history?.length  || 0) * 100), gap(32), mt(32)]}>
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
                    <Text
                      style={[colorTextGrey, fs12, fw400]}
                    >{`${Utils.formatTime(
                      item?.createdAt
                    )} - ${Utils.formatDate(item?.updatedAt)}`}</Text>
                  </View>

                  <View style={[flexCol, itemsEnd, justifyBetween, hFull]}>
                    <Text
                      style={[fw400, fs14, { color: "#27AE65" }]}
                    >{`₦ ${Number((item?.ridePlan as any)?.serviceFee) + Number(item?.riderCounterOffer)}`}</Text>
                    <Text
                      style={[colorTextGrey, fw400, fs12]}
                    >{`# ${item?._id}`}</Text>
                  </View>
                </View>
              ))}
            </View>): (<ActivityIndicator size="small" />)}

            {/* Tab Body */}
          </View>
        </ScrollView>
      </PaddedScreen>
    </SafeScreen>
  );
}

export default TripHistory;
