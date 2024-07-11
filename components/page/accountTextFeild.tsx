import Colors, { colors } from "@/constants/Colors";
import { c, colorBlack, fs12, fs14, fw400, fw500 } from "@/utils/fontStyles";
import { bg, flexCol, gap, h, px, py, rounded, wFull } from "@/utils/styles";
import { TextInput } from "react-native";
import { Text } from "react-native-paper";
import { View } from "react-native";

interface IInput {
    error?: boolean,
    value: string,
    palceHolder: string,
    hidden?: boolean,
    editing: boolean,
    fieldKey: string,
    onChangeText: (key: string, value: string) => void,
    onFocus?: Function,
    onBlur?: Function,
    autoFocus?: boolean,
    keyboardType?: 'numeric' | 'default' | 'email-address',
}

interface ILabel {
    text: string,
}

function AccountTextField({ label, input }: { label: ILabel, input: IInput }) {

    return (
        <View style={[wFull, flexCol, gap(8)]}>
            <Text style={[c(Colors.light.textGrey), fs12, fw400]}>{label.text}</Text>

            {input.editing ? (<TextInput
                onChangeText={(text) => input.onChangeText(input.fieldKey, text)}

                value={input.value} placeholder={input.palceHolder}
                secureTextEntry={input.hidden}

                style={[py(16), px(10), rounded(10), bg(colors.transparent), colorBlack, fs14, fw500, h(50), { borderWidth: 0.7, borderColor: Colors.light.border }]}

                onFocus={() => input.onFocus}
                onBlur={() => input.onBlur}
                // others
                autoFocus={input.autoFocus}
                cursorColor={Colors.light.background}
                selectionColor={colors.transparent}
                keyboardType={'' || input.keyboardType}
                underlineColorAndroid={colors.transparent}
                placeholderTextColor={Colors.light.textGrey}
            />) :
                (<Text style={[py(16), px(10), rounded(10), bg(colors.transparent), c(Colors.light.textGrey), fs14, fw500, { borderWidth: 0.7, borderColor: Colors.light.border }]}>{input.value}</Text>)
            }
        </View>
    )
}

export default AccountTextField;