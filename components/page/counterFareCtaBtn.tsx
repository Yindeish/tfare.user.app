import Colors, { colors } from "@/constants/Colors";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import RideSelectors from "@/state/selectors/ride";
import { setCounterFareStatus } from "@/state/slices/ride";
import { c, colorWhite, fs16, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { bg, flex, gap, h, itemsCenter, justifyCenter, justifyStart, pl, rounded, w } from "@/utils/styles";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";


function CounterFareCtaBtn() {
    const dispatch = useAppDispatch()
    const { counterFareStatus } = RideSelectors()

    const requestCounterFare = () => {
        // dispatch(setCounterFareStatus('pending'));
        dispatch(setCounterFareStatus('accepted'));
    }

    if (counterFareStatus === 'idle') return (
        <TouchableOpacity onPress={() => requestCounterFare()} style={[flex, gap(16), itemsCenter, justifyCenter, w('40%'), h(50), pl(16), rounded(10), bg(Colors.light.banner), { borderWidth: 0.7, borderColor: Colors.light.banner }]}>
            <Text style={[neurialGrotesk, fw700, fs16, colorWhite,]}>Request</Text>
        </TouchableOpacity>
    )
    if (counterFareStatus === 'pending') return (
        <View style={[flex, gap(16), itemsCenter, justifyCenter, w('40%'), h(50), pl(16), rounded(10), bg(colors.white), { borderWidth: 0.7, borderColor: Colors.light.banner }]}>
            <Text style={[neurialGrotesk, fw700, fs16, c(Colors.light.banner)]}>Pending</Text>
        </View>
    )
    if (counterFareStatus === 'accepted') return (
        <View style={[flex, gap(16), itemsCenter, justifyCenter, w('40%'), h(50), pl(16), rounded(10), bg(colors.white), { borderWidth: 0.7, borderColor: '#27AE65' }]}>
            <Text style={[neurialGrotesk, fw700, fs16, c('#27AE65')]}>Accepted</Text>
        </View>
    )
}

export default CounterFareCtaBtn;