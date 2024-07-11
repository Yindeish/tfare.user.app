import { View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, Pressable, Button, Dimensions } from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import { absolute, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsEnd, itemsStart, justifyBetween, justifyCenter, justifyStart, left0, mLAuto, mRAuto, mXAuto, mb, ml, mt, p, pLAuto, pXAuto, pb, pl, pt, px, py, relative, right0, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { Text, Portal, Dialog, Paragraph } from "react-native-paper";
import { c, colorBlack, colorBlueBg, colorBorderGrey, colorWhite, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { images } from "@/constants/images";
import { image } from "@/utils/imageStyles";
import Colors, { colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import CtaBtn from "../shared/ctaBtn";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import { setCancelRideReason, setDriverRatingCommentInput, setDriverRatingInput } from "@/state/slices/ride";
import RideSelectors from "@/state/selectors/ride";
import { cancelRideReasons } from "@/constants/cancelRideReasons";
import RadioBtnListTile from "./RadioBtnListTile";
import { closeModal } from "@/state/slices/layout";

function TripStartedSheet() {


    return (
        <PaddedScreen>
            <View style={[flexCol, gap(32), mt(20),]}>
                <PaddedScreen>
                    <View style={[flexCol, gap(20),]}>
                        <View style={[wFull, flex, gap(10), itemsCenter, justifyCenter]}>
                            <Image style={[image.w(30), image.h(27)]} source={images.tripChargeImage} />

                            <Text style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}>Trip Started</Text>
                        </View>

                        <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Driver has started the trip. You should arrive in 15 minutes</Text>
                    </View>
                </PaddedScreen>

                {/* Driver block */}

                <View style={[wFull, h(144), flex, itemsCenter, justifyCenter, bg(colors.white), rounded(10), gap(16), { borderWidth: 0.7, borderColor: Colors.light.border }]}>

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
                </View>

                {/* Driver block */}

                <CtaBtn
                    img={{
                        src: images.redBgCautionImage
                    }}
                    onPress={() => { }}
                    text={{ name: 'Safety Alert' }}
                    bg={{ color: Colors.light.error }}
                />

                <CtaBtn
                    img={{
                        src: images.cancelImage
                    }}
                    onPress={() => { }}
                    text={{ name: 'Cancel Order', color: Colors.light.textGrey }}
                    bg={{ color: '#F9F7F8', borderColor: Colors.light.border }}
                />
            </View>
        </PaddedScreen>
    )
}

function TripCompletedSheet() {
    const dispatch = useAppDispatch()
    const { driverRatingInput, driverRatingCommentInput } = RideSelectors()

    const rateDriver = (rating: number) => {
        dispatch(setDriverRatingInput(rating))
        // update in DB
    }

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(32), mt(20),]}>
                <PaddedScreen>
                    <View style={[flexCol, gap(20),]}>
                        <View style={[wFull, flex, gap(10), itemsCenter, justifyCenter]}>
                            <Image style={[image.w(30), image.h(30)]} source={images.greenBgCheckboxImage} />

                            <Text style={[fw700, colorBlack, { fontSize: 22 }]}>You have arrived Safely!</Text>
                        </View>

                        <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>You have arrived at your location. Rate your trip below</Text>
                    </View>
                </PaddedScreen>

                {/* Driver block */}

                <View style={[wFull, h(144), flex, itemsCenter, justifyCenter, bg(colors.white), rounded(10), gap(16), { borderWidth: 0.7, borderColor: Colors.light.border }]}>

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
                </View>

                {/* Driver block */}

                {/* Rating */}

                <PaddedScreen>
                    <View style={[flex, justifyBetween, wFull, h(50),]}>
                        {[1, 1.3, 1.5, 1.3, 1].map((starRate, index) => (
                            <TouchableOpacity onPress={() => rateDriver(index + 1)} style={[w(35), h(33)]} key={index}>
                                <Image
                                    source={driverRatingInput && index <= driverRatingInput - 1 ? images.startRatingImage : images.rateStarImage}
                                    style={[image.w(35), image.h(33), { transform: `scale(${starRate})` }, image.mt(index === 2 ? 'auto' : 0)]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </PaddedScreen>

                {/* Rating */}

                <TextInput
                    onChangeText={(text) => {
                        dispatch(setDriverRatingCommentInput(text))
                    }}

                    value={driverRatingCommentInput}
                    placeholder={'Input Comments'}
                    multiline
                    numberOfLines={4}

                    style={[py(16), px(24), rounded(10), bg(colors.transparent), colorBlack, fs14, fw500, wFull, { borderWidth: 0.7, borderColor: Colors.light.border }]}

                    selectionColor={colors.transparent}
                    underlineColorAndroid={colors.transparent}
                    placeholderTextColor={Colors.light.textGrey}
                />

                {/* Rating */}

                <CtaBtn
                    img={{
                        src: images.whiteBgStarRatingImage,
                        w: 18, h: 17
                    }}
                    onPress={() => { }}
                    text={{ name: 'Rate now' }}
                />
            </View>
        </PaddedScreen>
    )
}

function CancelRide() {
    const dispatch = useAppDispatch()
    const { driverRatingCommentInput, cancelRideReason } = RideSelectors();

    let [commentBoxShowable, setCommentBoxShowable] = useState(false)

    // Updating the bottom Modal
    useEffect(() => {
        if (cancelRideReason.toLowerCase() === cancelRideReasons[0].toLowerCase() ||
            cancelRideReason.toLowerCase() === cancelRideReasons[0].toLowerCase() ||
            cancelRideReason.toLowerCase() === cancelRideReasons[1].toLowerCase() ||
            cancelRideReason.toLowerCase() === cancelRideReasons[2].toLowerCase() ||
            cancelRideReason.toLowerCase() === cancelRideReasons[3].toLowerCase() ||
            cancelRideReason.toLowerCase() === cancelRideReasons[4].toLowerCase()) {
            setCommentBoxShowable(false);
        }
        else setCommentBoxShowable(true);
    }, [cancelRideReason])
    // Updating the bottom Modal

    return (
        <View style={[w('90%'), hFull, mXAuto, rounded(10), py(34), px(24), bg(colors.white), flexCol, gap(30),]} >

            <View style={[pb(16), flex, itemsStart, gap(16), mXAuto, { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>

                <Image style={[image.w(20), image.h(20)]} source={images.cancelImage} />

                <Text style={[neurialGrotesk, fw700, fs16, colorBlack,]}>Cancel Ride</Text>
            </View>

            <View style={[flexCol, gap(2), itemsCenter, mXAuto]}>
                <Text style={[neurialGrotesk, fw700, fs14]}>Why do you want to cancel your order?</Text>
            </View>

            <View style={[flexCol, gap(10)]}>

                {cancelRideReasons.map((reason, index) => (
                    <RadioBtnListTile
                        input={{
                            onChange: (value: string) => {

                                if (reason.toLowerCase() !== 'other') {
                                    dispatch(setCancelRideReason(value.toLowerCase() === cancelRideReason.toLowerCase() ? '' : value.toLowerCase()))
                                }

                                if (reason.toLowerCase() === 'other') {
                                    dispatch(setCancelRideReason(''))
                                }

                            },
                            value: cancelRideReason.toLowerCase()
                        }}
                        label={{ text: reason }}
                        key={index}
                    />
                ))}

            </View>

            {
                commentBoxShowable &&

                <TextInput
                    onChangeText={(text) => {
                        dispatch(setCancelRideReason(text))
                    }}

                    value={driverRatingCommentInput}
                    placeholder={'Input Comments'}
                    multiline
                    numberOfLines={4}

                    style={[py(16), px(24), rounded(10), bg(colors.transparent), colorBlack, fs14, fw500, wFull, { borderWidth: 0.7, borderColor: Colors.light.border }]}

                    selectionColor={colors.transparent}
                    underlineColorAndroid={colors.transparent}
                    placeholderTextColor={Colors.light.textGrey}
                />
            }

            <TouchableOpacity onPress={() => {
                dispatch(closeModal())

                // submit reason to the server
            }}>
                <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.error)]}>
                    <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Confirm</Text>

                    <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                </View>
            </TouchableOpacity>
        </View >
    )
}

export { TripStartedSheet, TripCompletedSheet, CancelRide };    