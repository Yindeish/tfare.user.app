import { absolute, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsEnd, itemsStart, justifyBetween, justifyCenter, justifyStart, left0, mLAuto, mRAuto, mXAuto, mb, ml, mt, p, pLAuto, pXAuto, pb, pl, px, py, relative, right0, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { Text, Portal, Dialog, Paragraph } from "react-native-paper";
import { c, colorBlack, colorBlueBg, colorBorderGrey, colorWhite, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { TouchableOpacity, View } from "react-native";
import { IBusStop } from "@/state/types/ride";
import Colors from "@/constants/Colors";

interface IItem {
    _id: string,
    busstopTitle: string,
    busStop?: IBusStop,
}

const SavedBusstopListTile = ({ onPress, item }: { onPress: Function, item: IItem }) => {

    return (
        <TouchableOpacity onPress={() => onPress()}>
            <View style={[w('auto'), hFull, rounded(100), px(32), gap(10), flex, itemsCenter, justifyCenter, { borderWidth: 1, borderColor: Colors.light.border }]}>
                <Text style={[fw500, fs12, colorBlack]}>{item.busstopTitle}</Text>
            </View>
        </TouchableOpacity>
    )
};

export default SavedBusstopListTile;