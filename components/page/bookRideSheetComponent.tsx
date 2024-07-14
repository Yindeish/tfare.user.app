import { image, mXAuto, wHFull } from "@/utils/imageStyles";
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, mt, pb, px, py, rounded, w, wFull } from "@/utils/styles";
import { FlatList, Image, TextInput, View } from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { c, colorBlack, colorBlueBg, colorWhite, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { images } from "@/constants/images";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import Colors, { colors } from "@/constants/Colors";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import { editTicket, setStateInputField } from "@/state/slices/ride";
import RideSelectors from "@/state/selectors/ride";
import { closeBottomSheet } from "@/state/slices/layout";


function TicketDetailsSheet() {
    const dispatch = useAppDispatch()
    const { stateInput: { pickupBusstopInput, dropoffBusstopInput }, currentTicket } = RideSelectors()

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

                        <Image style={[image.w(30), image.h(20)]} source={images.ticketImage} />

                        <Text style={[neurialGrotesk, fw700, fs16, colorBlack,]}>Ticket Details</Text>
                    </View>

                    <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Input details to book  seat on the ride</Text>
                </View>

                {/* Pick up block */}

                <View style={[wFull, h(52), flex, gap(10), itemsCenter,]}>
                    <TouchableOpacity>
                        <Image style={[image.w(15), image.h(20)]} source={images.greenBgCoasterImage} />
                    </TouchableOpacity>

                    <TextInput
                        style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                        placeholderTextColor={Colors.light.textGrey}
                        cursorColor={Colors.light.textGrey}
                        placeholder="Pick up Bus Stop"
                        value={pickupBusstopInput}
                        onChangeText={(text) => {
                            dispatch(setStateInputField({ key: 'pickupBusstopInput', value: text }));
                        }}
                    />
                </View>

                <FlatList
                    style={[wFull, h(46), flex, gap(16),]}
                    horizontal
                    data={DATA}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={
                            () => dispatch(setStateInputField({ key: 'pickupBusstopInput', value: item.name }))
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
                        style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                        placeholderTextColor={Colors.light.textGrey}
                        cursorColor={Colors.light.textGrey}
                        placeholder="Drop off Bus Stop"
                        value={dropoffBusstopInput}
                        onChangeText={(text) => {
                            dispatch(setStateInputField({ key: 'dropoffBusstopInput', value: text }));
                        }}
                    />
                </View>

                <FlatList
                    style={[wFull, h(46), flex, gap(16),]}
                    horizontal
                    data={DATA}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={
                            () => dispatch(setStateInputField({ key: 'dropoffBusstopInput', value: item.name }))
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

            <TouchableOpacity onPress={() => {
                console.log({ currentTicket })
                dispatch(editTicket({ currentNumberOfTickets: Number(currentTicket?.number as number) }))
                dispatch(closeBottomSheet());
            }}>
                <View style={[wFull, h(50), mt(32), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.banner)]}>
                    <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Add Details</Text>

                    <Image style={[image.w(22), image.h(14)]} source={images.whiteBgTicketImage} />
                </View>
            </TouchableOpacity>

        </PaddedScreen>
    )
}

export default TicketDetailsSheet;