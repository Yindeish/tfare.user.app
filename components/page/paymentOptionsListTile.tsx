import Colors from "@/constants/Colors";
import { c, colorBlack, fs12, fs14, fw400, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyStart, pb, wFull } from "@/utils/styles";
import { TouchableOpacity, View } from "react-native";
import { RadioButton, Text } from "react-native-paper";


function PaymentOptionsListTile({ subTitle, title, input }: { title: string, subTitle: string, input: { onChange: Function, value: string, condition?: boolean } }) {


    return (
        <TouchableOpacity
            onPress={() => input.onChange(title.toLowerCase())}
            style={[wFull, flex, itemsCenter, justifyBetween, pb(16), { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>

            <View style={[flexCol, gap(12)]}>
                <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}>{title}</Text>
                <Text style={[c(Colors.light.textGrey), fw400, fs12, neurialGrotesk]}>{subTitle}</Text>
            </View>

            <RadioButton
                value={(input.value)}
                // status={input?.condition ? input.condition : input.value.toLowerCase() === title.toLowerCase() ? 'checked' : 'unchecked'}
                status={input?.condition ? 'checked' : 'unchecked'}
                onPress={() => input.onChange(title.toLowerCase())}
                color={Colors.light.background}
            />
        </TouchableOpacity>
    )
}

export default PaymentOptionsListTile;