import { image, mXAuto, wHFull } from "@/utils/imageStyles";
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, mt, pb, px, py, rounded, w, wFull } from "@/utils/styles";
import { FlatList, Image, ScrollView, StyleSheet, TextInput, TextStyle, View } from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { c, colorBlack, colorBlueBg, colorWhite, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { images } from "@/constants/images";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import Colors, { colors } from "@/constants/Colors";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import { editTicketBusstops, setStateInputField } from "@/state/slices/ride";
import RideSelectors from "@/state/selectors/ride";
import { closeBottomSheet } from "@/state/slices/layout";
import CtaBtn from "../shared/ctaBtn";
import RideBlock from "./rideBlock";
import { IRide } from "@/state/types/ride";
import BuyTicketListTile from "./buyTicketListTile";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useEffect } from "react";
import { Href, router } from "expo-router";
import { pages } from "@/constants/pages";


const { sharedStyle, availableSeatStyle, selectedSeatStyle, unavailableSeatStyle } = StyleSheet.create({
    sharedStyle: {
        ...w(45), ...h(45), ...rounded(100), ...flex, ...itemsCenter, ...justifyCenter,
        borderWidth: 0.7, borderColor: Colors.light.border
    },
    availableSeatStyle: {
        ...bg('#F9F7F8'),
    },
    unavailableSeatStyle: {
        ...bg(Colors.light.border)
    },
    selectedSeatStyle: {
        ...bg(Colors.light.background)
    }
});

function BookSeatSheet() {
    const dispatch = useAppDispatch();
    const { userRide, allTicketsFilled, stateInput: { pickupBusstopInput, dropoffBusstopInput }, currentNumberOfTickets } = RideSelectors()
    const { hideBottomSheet } = useBottomSheet()


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
    ]

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(16), mt(20),]}>
                <View style={[flexCol, gap(16), itemsCenter]}>
                    <View style={[pb(16), flex, itemsStart, gap(16), mXAuto,]}>

                        <Image style={[image.w(30), image.h(30)]} source={images.trip} />

                        <Text style={[neurialGrotesk, fw700, fs16, colorBlack,]}>Book Seat</Text>
                    </View>

                    <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Input details to book  seat on the ride</Text>
                </View>

                {/* Pick up block */}

                <View style={[wFull, h(52), flex, gap(10), itemsCenter,]}>
                    <TouchableOpacity>
                        <Image style={[image.w(15), image.h(20)]} source={images.greenBgCoasterImage} />
                    </TouchableOpacity>

                    <TextInput
                        style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }] as TextStyle[]}
                        placeholderTextColor={Colors.light.textGrey}
                        cursorColor={Colors.light.textGrey}
                        placeholder="Your Pick up Bus Stop"
                        value={''}
                        autoCorrect={false}
                        onChangeText={(text) => {
                            // dispatch(setStateInputField({ key: 'pickupBusstopInput', value: text }));
                        }}
                    />
                </View>

                <FlatList
                    style={[wFull, h(46), flex, gap(16),]}
                    horizontal
                    data={DATA}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={
                            () => { }
                            // dispatch(setStateInputField({ key: 'pickupBusstopInput', value: item.name }))
                        }>
                            <View style={[w(98), hFull, rounded(100), py(16), px(32), gap(10), flex, itemsCenter, justifyCenter, { borderWidth: 1, borderColor: Colors.light.border }]}>
                                <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={[w(16), hFull, bg(colors.transparent)]} />
                    )}
                    keyExtractor={(({ id }) => id.toString())}
                />

                {/* Pick up block */}

                {/* Drop off block */}

                <View style={[wFull, h(52), flex, gap(10), itemsCenter,]}>
                    <TouchableOpacity>
                        <Image style={[image.w(15), image.h(20)]} source={images.redBgCoasterImage} />
                    </TouchableOpacity>

                    <TextInput
                        style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }] as TextStyle[]}
                        placeholderTextColor={Colors.light.textGrey}
                        cursorColor={Colors.light.textGrey}
                        placeholder="Your Drop off Bus Stop"
                        value={''}
                        autoCorrect={false}
                        onChangeText={(text) => {
                            // dispatch(setStateInputField({ key: 'dropoffBusstopInput', value: text }));
                        }}
                    />
                </View>

                <FlatList
                    style={[wFull, h(46), flex, gap(16),]}
                    horizontal
                    data={DATA}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={
                            () => { }
                            // dispatch(setStateInputField({ key: 'dropoffBusstopInput', value: item.name }))
                        }>
                            <View style={[w(98), hFull, rounded(100), py(16), px(32), gap(10), flex, itemsCenter, justifyCenter, { borderWidth: 1, borderColor: Colors.light.border }]}>
                                <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={[w(16), hFull, bg(colors.transparent)]} />
                    )}
                    keyExtractor={(({ id }) => id.toString())}
                />

                {/* Drop off block */}
            </View>

            <View style={[wFull, h(99), flexCol, gap(16), mt(30), { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>
                <View style={[wFull, flex, itemsCenter, gap(12)]}>
                    <Image style={[image.w(20), image.h(13)]} source={images.ticketImage} />

                    <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Tickets</Text>
                </View>

                <ScrollView>
                    <View style={[wFull, flex, gap(16)]}>
                        {/* 5 is the seats (total) and 3 is the available seats */}
                        {Array.from({ length: 5 }).map((_, index) => (
                            <View key={index}>
                                {index + 1 <= 3 ? (<TouchableOpacity
                                    // onPress={() => selectNumberOfTickets(index + 1)}
                                    style={[sharedStyle, currentNumberOfTickets === index + 1 ? selectedSeatStyle : availableSeatStyle]}>
                                    <Text style={[fw400, fs14, c(`${currentNumberOfTickets === index + 1 ? colors.white : colors.black}`)]}>{index + 1}</Text>
                                </TouchableOpacity>)
                                    :
                                    <View style={[sharedStyle, unavailableSeatStyle]}>
                                        <Text style={[fw400, fs14, c(`${currentNumberOfTickets === index + 1 ? colors.white : colors.black}`),]}>{index + 1}</Text>
                                    </View>}
                            </View>
                        ))}
                    </View>
                </ScrollView>

            </View>

            <TouchableOpacity onPress={() => {
                hideBottomSheet();
                router.push('bookTrip/1' as Href);
            }}>
                <View style={[wFull, h(50), mt(32), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.banner)]}>
                    <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Book Ticket</Text>

                    <Image style={[image.w(22), image.h(14)]} source={images.whiteBgTicketImage} />
                </View>
            </TouchableOpacity>

        </PaddedScreen>
    )
}

export default BookSeatSheet;