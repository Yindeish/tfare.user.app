import Colors, { colors } from "@/constants/Colors";
import { colorBlack, fs14, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { bg, flex, h, itemsStart, justifyBetween, mb, pb, pt, wFull } from "@/utils/styles";
import { Switch, View } from "react-native";
import { Text } from "react-native-paper";


interface IInput {
    onChange: Function,
    value: boolean,
}

function CupertinoBtnListTile({ label, input }: { label: string, input: IInput }) {


    return (
        <View style={[wFull, h(40), pt(4), flex, itemsStart, justifyBetween, { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>
            <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>{label}</Text>

            <Switch
                trackColor={{ false: '#C3C3C3', true: '#27AE65' }}
                thumbColor={input.value ? colors.white : colors.white}
                ios_backgroundColor="#C3C3C3"
                onChange={() => input.onChange()}
                value={input.value}
                style={[h(25)]}
            />
        </View>
    )
}

export default CupertinoBtnListTile;