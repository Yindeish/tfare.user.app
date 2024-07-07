import Colors, { colors } from "@/constants/Colors";
import { indices } from "@/constants/zIndices";
import { c, colorBlack, colorWhite, fs16, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { absolute, bg, flex, gap, h, itemsCenter, justifyStart, l, ml, mt, t, w, zIndex } from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

export default function AccountPageTitle({ onPress, style, title }: { onPress?: Function, style?: ViewStyle | ViewStyle[], title: string }) {
    return (
        <View style={[w(132), h(20), bg(colors.transparent), flex, justifyStart, itemsCenter, gap(10), { ...style as ViewStyle[] }]}>
            <TouchableOpacity onPress={() => {
                router.back();
                onPress && onPress();
            }}>
                <Ionicons name="chevron-back" size={20} color={Colors.light.textGrey} />
            </TouchableOpacity>

            <Text style={[colorBlack, fs16, fw700, neurialGrotesk,]}>{title}</Text>
        </View>
    )
}