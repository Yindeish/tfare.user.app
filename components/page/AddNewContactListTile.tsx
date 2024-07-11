import Colors, { colors } from "@/constants/Colors";
import { colorBlack } from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
import { bg, flex, gap, h, px, py, rounded, wFull } from "@/utils/styles";
import { Image, ImageSourcePropType, ImageStyle, TextInput, View } from "react-native";


interface IInput {
    value: string,
    palceHolder: string,
    fieldKey: string,
    onChangeText: (key: string, value: string) => void,
    keyboardType?: 'numeric' | 'default' | 'email-address',
}

interface IIcon {
    present: boolean,
    src?: ImageSourcePropType,
    w?: number, h?: number
}

function AddNewContactListTile({ icon, input }: { icon: IIcon, input: IInput }) {

    return (
        <View style={[wFull, h(50), rounded(10), py(16), px(24), flex, gap(10), bg('#F9F7F8')]}>
            {icon.present && <Image style={[image.w(icon.w as number), image.h(icon.h as number)]} source={icon.src} />}

            <TextInput
                onChangeText={(text) => input.onChangeText(input.fieldKey, text)}

                value={input.value} placeholder={input.palceHolder}

                style={[!icon.present ? wHFull : { flex: 0.8 }, { borderWidth: 0 }]}

                // others
                cursorColor={Colors.light.background}
                selectionColor={colors.transparent}
                keyboardType={'' || input.keyboardType}
                underlineColorAndroid={colors.transparent}
                placeholderTextColor={Colors.light.textGrey}
            />
        </View>
    )
}

export default AddNewContactListTile;