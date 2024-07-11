import Colors from "@/constants/Colors";
import { colorBlack, fs12, fw400, neurialGrotesk } from "@/utils/fontStyles";
import { flex, gap, itemsCenter, wFull } from "@/utils/styles";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RadioButton, Text } from "react-native-paper";


function RadioBtnListTile({ input, label }: { label: { text: string }, input: { onChange: Function, value: string } }) {


    return (
        <TouchableOpacity
            onPress={() => input.onChange(label.text)}
            style={[wFull, flex, gap(16), itemsCenter,]}>
            <RadioButton
                value={(input.value)}
                status={input.value.toLowerCase() === label.text.toLowerCase() ? 'checked' : 'unchecked'}
                onPress={() => input.onChange(label.text)}
                color={Colors.light.background}
            />

            <Text style={[neurialGrotesk, fw400, fs12, colorBlack]}>{label.text}</Text>
        </TouchableOpacity>
    )
}

export default RadioBtnListTile;