import Colors, { colors } from "@/constants/Colors";
import { c, fs12, fw500, neurialGrotesk } from "@/utils/fontStyles";
import { bg, hFull, px, py, rounded, w } from "@/utils/styles";
import { TextStyle, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";


const TripHistoryTabBtn = ({ text, active, onPress }: { text: string, active: boolean, onPress: Function }) => (
    <TouchableOpacity onPress={() => onPress()} style={[hFull, rounded(active ? 100 : 0), py(15), px(30), bg(active ? Colors.light.background : colors.white), { flex: 0.333 }]}>

        <Text style={[neurialGrotesk, fw500, fs12, c(active ? colors.white : Colors.light.textGrey)]}>{text}</Text>

    </TouchableOpacity>
);

export default TripHistoryTabBtn;