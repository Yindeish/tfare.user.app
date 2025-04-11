import { colors } from "@/constants/Colors";
import { useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import { c, fs12, fw500, neurialGrotesk } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, borderGrey, flex, gap, h, itemsCenter, mt, px, py, rounded, w } from "@/utils/styles";
import { Href, router } from "expo-router";
import { Image, Text, TouchableOpacity } from "react-native";


const DriverCTATile = () => {
    const { driverDetails } = useAppSelector((state: RootState) => state.trip);

    return (
        <TouchableOpacity
        onPress={() => router.push(`/(tripScreen)/driverProfile` as Href)}
        style={[
          bg("#F9F7F8"),
          borderGrey(0.7),
          rounded(10),
          py(0),
          px(10),
          flex,
          gap(10),
          itemsCenter,
          w("auto"),
          h(45),
          mt(20),
        ]}
      >
        <Image
          style={[image.w(30), image.h(30), image.rounded(30)]}
          source={{
            uri: driverDetails?.picture || driverDetails?.avatar,
          }}
        />

        <Text style={[neurialGrotesk, fs12, fw500, c(colors.black)]}>
          View Driver
        </Text>
      </TouchableOpacity>
    );
}
 
export default DriverCTATile;