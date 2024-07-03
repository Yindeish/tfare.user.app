import { colors } from "@/constants/Colors";
import { c, colorWhite, fs16, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { absolute, bg, flex, gap, h, itemsCenter, justifyStart, l, t, w, zIndex } from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

type TColor = { icon: string, text: string };

function PageFloatingTitle({ onPress, title, color }: { onPress: Function, title: string, color?: TColor }) {


    return (
        <View style={[w(132), h(20), bg(colors.transparent), flex, justifyStart, itemsCenter, gap(10), absolute, t(47), l(20), zIndex(10)]}>
            <TouchableOpacity onPress={() => {
                router.back();
                onPress();
            }}>
                <Ionicons name="chevron-back" size={20} color={color?.icon || colors.white} />
            </TouchableOpacity>

            <Text style={[c(color?.text || colors.white), fs16, fw700, neurialGrotesk,]}>{title}</Text>
        </View>
    )
}

export default PageFloatingTitle;