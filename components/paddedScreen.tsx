import { colors } from "@/constants/Colors";
import { wHFull } from "@/utils/styles";
import { View } from "react-native";

const PaddedScreen = ({ children }: { children: React.ReactNode }) => (
    <View style={[wHFull, { paddingHorizontal: 20, backgroundColor: colors.transparent }]}>
        {children}
    </View>
);

export default PaddedScreen;