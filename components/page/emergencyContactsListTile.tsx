import Colors from "@/constants/Colors";
import { images } from "@/constants/images";
import { c, colorBlack, fs12, fs16, fw400, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, flex, flexCol, gap, itemsCenter, justifyBetween, p, rounded, wFull } from "@/utils/styles";
import { Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";


function EmergencyContactListTile({ email, name, phoneNumber }: { email: string, phoneNumber: string, name: string, }) {


    return (
        <View style={[bg('#F9F7F8'), wFull, rounded(10), p(16), flex, justifyBetween, itemsCenter]}>

            <View style={[flexCol, gap(12)]}>
                <View style={[flex, itemsCenter, gap(16)]}>
                    <Image style={[image.w(16), image.h(20)]} source={images.profileImage} />

                    <Text style={[colorBlack, fw700, fs16]}>{name}</Text>
                </View>

                <Text style={[c(Colors.light.textGrey), fw400, fs12]}>{`${email},${phoneNumber}`}</Text>
            </View>

            <TouchableOpacity>
                <Image style={[image.w(20), image.h(20)]} source={images.cancelImage} />
            </TouchableOpacity>

        </View>
    )
}

export default EmergencyContactListTile;