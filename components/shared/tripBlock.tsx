import Colors, { colors } from "@/constants/Colors";
import { images } from "@/constants/images";
import { c, colorBlack, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, borderGrey, borderL, borderR, borderT, flex, flexCol, gap, h, itemsCenter, justifyBetween, p, px, py, rounded, w, wFull } from "@/utils/styles";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";


function TripBlock() {


    return (
        <View style={[wFull, h('auto'), bg('#FFF7E6'), borderGrey(0.7), borderL(0, ''), borderR(0, ''), py(16), px(20), flexCol, gap(32)]}>

            <View style={[flex, itemsCenter, justifyBetween]}>
                <View style={[flexCol, gap(8)]}>
                    <View style={[flex, gap(8)]}>
                        <Image style={[image.w(14), image.h(20)]} source={images.yellowLocationImage} />
                        <Text style={[neurialGrotesk, fw400, fs12]}>Take off</Text>
                    </View>
                    <Text style={[fw700, fs14, c(colors.black)]}>Ojoo Bus Stop</Text>
                </View>

                <Image style={[image.w(90), image.h(5), { objectFit: 'contain' }]} source={images.tripDirection} />

                <View style={[flexCol, gap(8)]}>
                    <View style={[flex, gap(8)]}>
                        <Image style={[image.w(14), image.h(20)]} source={images.blueLocationImage} />
                        <Text style={[neurialGrotesk, fw400, fs12]}>Drop off</Text>
                    </View>
                    <Text style={[fw700, fs14, c(colors.black)]}>Ojoo Bus Stop</Text>
                </View>
            </View>

            <View style={[flex, itemsCenter, justifyBetween]}>
                <View style={[flexCol, gap(8)]}>
                    <View style={[flex, gap(8)]}>
                        <Image style={[image.w(18), image.h(18)]} source={images.clockImage} />
                        <Text style={[fw400, fs12]}>Departure Date &Time</Text>
                    </View>
                    <Text style={[fw500, fs14, c(colors.black)]}>Apri 14 - 7:30 AM</Text>
                </View>

                <View style={[w('auto'), h(45), rounded(100), flex, itemsCenter, gap(16), bg(colors.white), p(16), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                    <Image style={[image.w(18), image.h(14.73)]} source={images.passengersImage} />
                    <Text style={[fs12, fw500, colorBlack]}>{3} seats Available</Text>
                </View>
            </View>

        </View>
    )
}

export default TripBlock;