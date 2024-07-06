import { colors } from "@/constants/Colors";
import { wHFull } from "@/utils/styles";
import { View, ViewStyle } from "react-native";

const PaddedScreen = ({ children, styles }: { children: React.ReactNode, styles?: ViewStyle[] | ViewStyle }) => (
    <View style={[{ paddingHorizontal: 20, backgroundColor: colors.transparent, ...styles }]}>
        {children}
    </View>
);

export default PaddedScreen;