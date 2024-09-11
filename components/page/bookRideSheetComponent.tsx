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


function TicketDetailsSheet() {
    const dispatch = useAppDispatch()
    const { showBottomSheet, hideBottomSheet } = useBottomSheet()
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
                dispatch(editTicketBusstops({ currentNumberOfTickets: Number(currentTicket?.number as number) }))
                hideBottomSheet();
            }}>
                <View style={[wFull, h(50), mt(32), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.banner)]}>
                    <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Add Details</Text>

                    <Image style={[image.w(22), image.h(14)]} source={images.whiteBgTicketImage} />
                </View>
            </TouchableOpacity>

        </PaddedScreen>
    )
}

function RideBookedSheet({ rideId }: { rideId: string }) {
    const { userRide } = RideSelectors()
    const { hideBottomSheet } = useBottomSheet()

    useEffect(() => {
        // if a signal is recieved from the driver to start the trip
        // for now dummy redirection
        setTimeout(() => {
            // router.push(`/${rideId}/${pages.tripStarted}` as Href)
            router.push(`/(rideScreens)/rideStarted/1` as Href)
        }, 3000)
    })

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(32), mt(20),]}>
                <PaddedScreen>
                    <View style={[flexCol, gap(20),]}>
                        <View style={[wFull, flex, gap(10), itemsCenter, justifyCenter]}>
                            <Image style={[image.w(30), image.h(27)]} source={images.greenBgCheckTripImage} />

                            <Text style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}>Ride Booked</Text>
                        </View>

                        <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey), mXAuto]}>Your Trip has been successfully booked</Text>
                    </View>
                </PaddedScreen>

                {/* Ride block */}
                <RideBlock
                    ride={userRide as IRide}
                    bgColor='#FFF7E6'
                    ctaType='trackRide'
                    touchable
                    roundedCorners={false}
                    onPress={() => { }}
                />
                {/* Ride block */}

                {/* Driver block */}

                <TouchableOpacity onPress={() => router.push(`/(sharedScreen)/driverProfile/1` as Href)} style={[wFull, h(144), flex, itemsCenter, justifyCenter, bg(colors.white), rounded(10), gap(16), { borderWidth: 0.7, borderColor: Colors.light.border }]}>

                    <Image
                        source={images.userProfileImage}
                        style={[image.w(70), image.h(70), image.rounded(70)]}
                    />

                    <View style={[flexCol, itemsStart, gap(20)]}>
                        <Text style={[fw700, fs16, colorBlack]}>Tom Hawkins</Text>

                        <View style={[flex, gap(32), itemsCenter, mXAuto]}>
                            <View style={[flex, itemsCenter, gap(12)]}>
                                <Image
                                    source={images.startRatingImage}
                                    style={[image.w(18), image.h(18),]}
                                />

                                <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>5.0</Text>
                            </View>

                            <View style={[flex, itemsCenter, gap(12)]}>
                                <Image
                                    source={images.checkTripImage}
                                    style={[image.w(18), image.h(17),]}
                                />

                                <Text style={[fw400, fs14, c(Colors.light.textGrey)]}>ABJ-123-XY</Text>
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>

                {/* Driver block */}

                {/* Trip Details (tickets) */}

                <View style={[wFull, flexCol, gap(16), pb(16), { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>
                    <BuyTicketListTile
                        leadingText='Trip ID'
                        trailing={{
                            text: '#7654321XYZ',
                            icon: true
                        }}
                    />

                    <BuyTicketListTile
                        leadingText='Ticket 1 code'
                        trailing={{
                            text: '#765XYZ',
                            icon: true
                        }}
                    />

                    <BuyTicketListTile
                        leadingText='Ticket 2 code'
                        trailing={{
                            text: '#765F21',
                            icon: true
                        }}
                    />
                </View>

                {/* Trip Details (tickets) */}

                {/* CTAs */}

                <CtaBtn
                    img={{
                        src: images.redBgCautionImage
                    }}
                    onPress={() => { }}
                    text={{ name: 'View Trip Details' }}
                    bg={{ color: Colors.light.background }}
                />

                <CtaBtn
                    img={{
                        src: images.cancelImage
                    }}
                    onPress={() => { }}
                    text={{ name: 'Cancel Order', color: Colors.light.textGrey }}
                    bg={{ color: '#F9F7F8', borderColor: Colors.light.border }}
                />

                {/* CTAs */}
            </View>
        </PaddedScreen >
    )
}

export { TicketDetailsSheet, RideBookedSheet };