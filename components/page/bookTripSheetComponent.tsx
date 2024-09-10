import { image, mXAuto, wHFull } from "@/utils/imageStyles";
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, mt, pb, px, py, rounded, w, wFull } from "@/utils/styles";
import { FlatList, Image, TextInput, Touchable, View } from "react-native";
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
import TripBlock from "../shared/tripBlock";


function TripBookedSheet({ rideId }: { rideId: string }) {
    const { userRide } = RideSelectors()
    const { hideBottomSheet } = useBottomSheet()

    useEffect(() => {
        // if a signal is recieved from the driver to start the trip
        // for now dummy redirection
        setTimeout(() => {
            // router.push(`/${rideId}/${pages.tripStarted}` as Href)
        }, 3000)
    })

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(32), mt(20),]}>
                <PaddedScreen>
                    <View style={[flexCol, gap(20),]}>
                        <View style={[wFull, flex, gap(10), itemsCenter, justifyCenter]}>
                            <Image style={[image.w(30), image.h(27)]} source={images.greenBgCheckTripImage} />

                            <Text style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}>Trip Booked</Text>
                        </View>

                        <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey), mXAuto]}>Your Trip has been successfully booked</Text>
                    </View>
                </PaddedScreen>

                {/* Ride block */}
                <TripBlock
                />
                {/* Ride block */}

                {/* Driver block */}

                <TouchableOpacity onPress={() => router.push(`/(tripScreen)/driverProfile/1` as Href)} style={[wFull, h(144), flex, itemsCenter, justifyCenter, bg(colors.white), rounded(10), gap(16), { borderWidth: 0.7, borderColor: Colors.light.border }]}>

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

export { TripBookedSheet };