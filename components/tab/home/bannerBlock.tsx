import { flex, itemsCenter, justifyCenter, wFull } from "@/utils/styles";
import { View } from "react-native";
import { Text } from "react-native-paper";

const BannerBlock = () => (
    <View style={[wFull, flex, itemsCenter, justifyCenter, { height: 155, backgroundColor: '#FFAE02' }]}>
        <Text>TEx</Text>
    </View>
);

export default BannerBlock;