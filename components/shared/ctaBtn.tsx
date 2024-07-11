import Colors, { colors } from "@/constants/Colors";
import { images } from "@/constants/images";
import { c, colorWhite, fs18, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, flex, gap, h, itemsCenter, justifyCenter, rounded, wFull } from "@/utils/styles";
import { Image, ImageSourcePropType, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";


function CtaBtn({ onPress, img, text, bg: background }: { onPress: Function, img: { src: ImageSourcePropType, w?: number, h?: number, }, text: { name: string, color?: string }, bg?: { color: string, borderColor?: string } }) {

    return (
        <TouchableOpacity onPress={() => onPress()}>
            <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(background?.color || Colors.light.background), background?.borderColor ? { borderWidth: 0.7, borderColor: background?.borderColor } : {}]}>
                <Text style={[neurialGrotesk, fw700, fs18, c(text?.color || colors.white)]}>{text.name}</Text>

                <Image style={[image.w(img?.w || 20), image.h(img?.h || 20)]} source={img.src} />
            </View>
        </TouchableOpacity>
    )
}

export default CtaBtn;