import { colorBlack, fs16, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { flex, gap, itemsCenter, justifyBetween, justifyStart, wFull } from "@/utils/styles";
import { GestureResponderEvent, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";


function BottomSheetTitle({ title, onPressFn }: {
    title: string, onPressFn: (event: GestureResponderEvent) => void
}) {


    return (
        <View style={[wFull, flex, itemsCenter, justifyStart, gap(16)]}>
            <TouchableOpacity onPress={onPressFn}>
                <Ionicons name="chevron-back" size={20} color={Colors.light.textGrey} />
            </TouchableOpacity>

            <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>{title}</Text>
        </View>
    )
}

export default BottomSheetTitle;