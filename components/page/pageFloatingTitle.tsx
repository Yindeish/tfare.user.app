import { colors } from "@/constants/Colors";
import { indices } from "@/constants/zIndices";
import { c, colorWhite, fs16, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { absolute, bg, flex, gap, h, itemsCenter, justifyStart, l, ml, mt, t, w, zIndex } from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

type TColor = { icon: string, text: string };

function PageFloatingTitle({ onPress, title, color, view, floating = true, style }: { onPress: Function, title: string, color?: TColor, view?: boolean, floating?: boolean, style?: ViewStyle | ViewStyle[] }) {


    return (
        <View style={[w(132), h(20), bg(colors.transparent), flex, justifyStart, itemsCenter, gap(10), floating && absolute, floating && t(47), floating && l(20), floating && zIndex(indices.high), !floating && mt(47), !floating && ml(20), { ...style as ViewStyle[] }]}>
            <TouchableOpacity onPress={() => {
                !view && router.back();
                onPress();
            }}>
                <Ionicons name="chevron-back" size={20} color={color?.icon || colors.white} />
            </TouchableOpacity>

            <Text style={[c(color?.text || colors.white), fs16, fw700, neurialGrotesk,]}>{title}</Text>
        </View>
    )
}

export default PageFloatingTitle;