import TripHistoryTabBtn from "@/components/page/tripHistoryTabBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors from "@/constants/Colors";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import RideSelectors from "@/state/selectors/ride";
import { setActiveTab } from "@/state/slices/ride";
import { colorBlack, colorTextGrey, fs12, fs14, fw400, fw700 } from "@/utils/fontStyles";
import { wHFull } from "@/utils/imageStyles";
import { bg, flex, flexCol, gap, h, hFull, itemsStart, justifyBetween, mt, wFull } from "@/utils/styles";
import { ScrollView, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native-paper";


function TripHistory() {
    const dispatch = useAppDispatch()
    const { activeTab } = RideSelectors()

    const DATA = [
        {
            id: 0,
            name: 'Home',
        },
        {
            id: 1,
            name: 'Apartment',
        },
        {
            id: 2,
            name: 'Workplace',
        },
        {
            id: 3,
            name: 'Workplace',
        },
        {
            id: 4,
            name: 'Workplace',
        },
        {
            id: 5,
            name: 'Workplace',
        },
        {
            id: 6,
            name: 'Workplace',
        },
    ]

    return (
        <SafeScreen>
            <PaddedScreen>
                <ScrollView>
                    <View style={[wHFull]}>

                        {/* Page Header */}
                        <PageTitle
                            title="Ride History"
                            onPress={() => { }}
                        />
                        {/* Page Header */}

                        {/* Tab Header */}

                        <View style={[wFull, h(45), flex,]}>
                            <TripHistoryTabBtn
                                active={activeTab === 'pending'}
                                onPress={() => {
                                    dispatch(setActiveTab('pending'))
                                }}
                                text="Pending"
                            />
                            <TripHistoryTabBtn
                                active={activeTab === 'completed'}
                                onPress={() => dispatch(setActiveTab('completed'))}
                                text="Completed"
                            />
                            <TripHistoryTabBtn
                                active={activeTab === 'cancelled'}
                                onPress={() => dispatch(setActiveTab('cancelled'))}
                                text="Cancelled"
                            />
                        </View>

                        {/* Tab Header */}

                        {/* Tab Body */}

                        <View style={[flexCol, h(DATA.length * 100), gap(32), mt(32)]}>
                            {DATA.map((item, index) => (
                                <View style={[flex, wFull, itemsStart, justifyBetween, { paddingRight: 16, paddingBottom: 16, height: 59, borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]} key={index}>
                                    <View style={[flexCol, itemsStart, justifyBetween, hFull]}>
                                        <Text style={[fw700, fs14, colorBlack]}>{item.name}</Text>
                                        <Text style={[colorTextGrey, fs12, fw400]}>{'Apr 14, 2024 - 8:41 AM'}</Text>
                                    </View>

                                    <View style={[flexCol, itemsStart, justifyBetween, hFull]}>
                                        <Text style={[fw400, fs14, { color: '#27AE65' }]}>{`₦${'0000.00'}`}</Text>
                                        <Text style={[colorTextGrey, fw400, fs12]}>{'#1234567ABC'}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Tab Body */}
                    </View>
                </ScrollView>
            </PaddedScreen>
        </SafeScreen>
    )
}

export default TripHistory;