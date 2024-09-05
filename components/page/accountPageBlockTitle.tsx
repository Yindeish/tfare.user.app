import Colors from "../../constants/Colors";
import { colorBlack, fs16, fw700 } from "../../utils/fontStyles";
import { pb, wFull } from "../../utils/styles";
import { View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";


function AccountPageBlockTitle({ styles, title }: { title: string, styles?: ViewStyle | ViewStyle[] }) {


    return (
        <View style={[pb(16), colorBlack, wFull, { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border, ...styles }]}>
            <Text style={[colorBlack, fw700, wFull, fs16,]}>{title}</Text>
        </View>
    )
}

export default AccountPageBlockTitle;