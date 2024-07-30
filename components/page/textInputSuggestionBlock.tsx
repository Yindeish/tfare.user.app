import { ScrollView, View } from "react-native"
import { absolute, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsEnd, itemsStart, justifyBetween, justifyCenter, justifyStart, left0, mLAuto, mRAuto, mXAuto, mb, ml, mt, p, pLAuto, pXAuto, pb, pl, px, py, relative, right0, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { colors } from "@/constants/Colors";
import { Text } from "react-native-paper";
import { ReactNode } from "react";


const TextInputSuggestionBlock = ({ visibilityCondtion, fnToRn, children, list }: { visibilityCondtion: boolean, fnToRn?: Function, children?: ReactNode, list: { array: any[] } }) => {

    return (
        <>
            {visibilityCondtion && <View style={[wFull, h('auto'), mt(-32), mb('auto'),]}>
                <ScrollView style={[wFull, bg(colors.white), h(176), flexCol, gap(30), py(16), px(16), bg('#F9F7F8'), { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }]}>
                    {['', '', '', '', '', '', '', ''].map((_, index) => (
                        <Text onPress={() => fnToRn && fnToRn()} style={[h(30), bg('#F9F7F8'),]} key={index}>{'meeee'}</Text>
                    ))}
                </ScrollView>
            </View>}
        </>
    )
}

export default TextInputSuggestionBlock