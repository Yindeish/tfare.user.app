import Colors, { colors } from "@/constants/Colors";
import { images } from "@/constants/images";
import { c, fs12, fs14, fw400, fw500, fw700 } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, border, borderL, borderR, borderT, borderX, flex, flexCol, gap, h, itemsCenter, justifyBetween, pb, pt, rounded, w } from "@/utils/styles";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";


function InTripDropoffTile() {

    return (
        <View style={[borderX(0, ''), borderT(0.7, Colors.light.border), pt(32), pb(0), flexCol, gap(16)]}>
            <View style={[flex, itemsCenter, justifyBetween]}>
                <View style={[flex, itemsCenter, gap(16)]}>
                    <Image style={[image.w(20), image.h(20)]} source={images.trip} />

                    <Text style={[fs12, fw400, c(Colors.light.textGrey)]}>1st Bus stop</Text>
                </View>

                <View style={[flex, itemsCenter, gap(16)]}>
                    <Image style={[image.w(20), image.h(20)]} source={images.clockImage} />

                    <Text style={[fs12, fw400, c(Colors.light.textGrey)]}>ETA</Text>
                </View>
            </View>

            <View style={[flex, itemsCenter, justifyBetween]}>
                <View style={[flex, itemsCenter, gap(10)]}>
                    <View style={[w(5), h(5), bg(colors.black), rounded(5)]} />
                    <Text style={[fs14, fw700, c(colors.black)]}>Orogun Bus Stop</Text>
                </View>

                <View style={[flex, itemsCenter, gap(10)]}>
                    <View style={[w(5), h(5), bg(colors.black), rounded(5)]} />
                    <Text style={[fs14, fw500, c(colors.black)]}>7:40 AM</Text>
                </View>
            </View>
        </View>
    )
}

export default InTripDropoffTile;