import Colors from "../../constants/Colors";
import { c, colorBlack, fs12, fs14, fw400, fw700, neurialGrotesk } from "../../utils/fontStyles";
import { flex, flexCol, gap, h, itemsStart, justifyBetween, mr, pt, w, wFull } from "../../utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";



function AccountSecurityListTile({ label, onPress, desc }: { label: string, onPress: Function, desc?: string }) {


    return (
        <TouchableOpacity onPress={() => onPress()} style={[wFull, h(!desc ? 40 : 76), pt(4), flexCol, gap(12), { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>
            <View style={[flex, itemsStart, justifyBetween,]}>
                <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>{label}</Text>

                <Ionicons style={[mr(16)]} name="chevron-forward" size={20} color={Colors.light.textGrey} />
            </View>

            {desc && <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey), w('80%'),]}>{desc}</Text>}
        </TouchableOpacity>
    )
}

export default AccountSecurityListTile;