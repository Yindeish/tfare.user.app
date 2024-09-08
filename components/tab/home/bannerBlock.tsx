import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import { images } from "@/constants/images";
import { fs14, fw400, neurialGrotesk } from "@/utils/fontStyles";
import { flex, flexCol, itemsCenter, justifyCenter, wFull } from "@/utils/styles";
import { Image, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const { discountText, orderRideText } = StyleSheet.create({
    orderRideText: {
        fontWeight: '800',
        fontSize: 32,
        fontFamily: fonts.neurialGrotesk,
        color: colors.black
    },
    discountText: {
        color: '#2C333C',
        fontFamily: fonts.neurialGrotesk,
        fontWeight: '400',
        fontSize: 14,
    }
});

const BannerBlock = () => (
    <View style={[wFull, flex, itemsCenter, justifyCenter, { height: 155, backgroundColor: Colors.light.banner, gap: 19 }]}>
        <Image style={[{ width: 90.42, height: 78.1 }]} source={images.bannerImage} />

        <View style={[flexCol, justifyCenter, { gap: 12 }]}>
            <Text style={[orderRideText]}>Order a Ride</Text>
            <View style={[flexCol, justifyCenter, { gap: 3 }]}>
                <Text style={[fw400, fs14, {
                    color: '#2C333C'
                }]}>
                    Get 15% discount on all your
                </Text>
                <Text style={[fw400, fs14, {
                    color: '#2C333C'
                }]}>rides today!</Text>
            </View>
        </View>
    </View>
);

export default BannerBlock;