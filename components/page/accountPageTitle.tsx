import Colors, { colors } from "@/constants/Colors";
import { indices } from "@/constants/zIndices";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import AccountSelectors from "@/state/selectors/account";
import { c, colorBlack, colorWhite, fs16, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { absolute, bg, flex, gap, h, itemsCenter, justifyBetween, justifyStart, l, mb, ml, mt, t, w, wFull, zIndex } from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

export default function AccountPageTitle({ onPress, style, title, children }: { onPress?: Function, style?: ViewStyle | ViewStyle[], title: string, children?: React.ReactNode }) {
    const dispatch = useAppDispatch()
    const { profileCta, stateInput } = AccountSelectors();

    const { emailInput, nameInput, phoneNoInput, userNameInput } = stateInput.profile;

    return (

        <View style={[wFull, flex, itemsCenter, justifyBetween, mt(47), mb(28)]}>
            <View style={[h(20), bg(colors.transparent), flex, justifyStart, itemsCenter, gap(10), { ...style as ViewStyle[] }]}>
                <TouchableOpacity onPress={() => {
                    router.back();
                    onPress && onPress();
                }}>
                    <Ionicons name="chevron-back" size={20} color={Colors.light.textGrey} />
                </TouchableOpacity>

                <Text style={[colorBlack, fs16, fw700, neurialGrotesk,]}>{title}</Text>
            </View>

            {children}

        </View>
    )
}