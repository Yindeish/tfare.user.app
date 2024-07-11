import Colors from "@/constants/Colors";
import { c, colorBlack, fs14, fw400, neurialGrotesk } from "@/utils/fontStyles";
import { flex, itemsCenter, justifyBetween, wFull } from "@/utils/styles";
import { View } from "react-native";
import { Text } from "react-native-paper";

const DriverProfileListTile = ({ text }: { text: { leading: string, trailing: string } }) => (
    <View style={[wFull, flex, justifyBetween, itemsCenter]}>

        <Text style={[c(Colors.light.textGrey), neurialGrotesk, fs14, fw400]}>{text.leading}</Text>

        <Text style={[colorBlack, fs14, fw400]}>{text.trailing}</Text>

    </View>
);

export default DriverProfileListTile;