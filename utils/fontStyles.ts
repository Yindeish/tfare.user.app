import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import { TextStyle } from "react-native";

export const fontStyles: Record<string, TextStyle> = {
    neurialGrotesk: {
        // fontFamily: fonts.neurialGrotesk
    },
    fw400: {
        fontWeight: '400'
    },
    fw600: {
        fontWeight: '600'
    },
    fw500: {
        fontWeight: '500'
    },
    fw700: {
        fontWeight: '700'
    },
    fs10: {
        fontSize: 10
    },
    fs12: {
        fontSize: 12
    },
    fs14: {
        fontSize: 14
    },
    fs16: {
        fontSize: 16
    },
    fs18: {
        fontSize: 16
    },
    colorBlack: {
        color: colors.black,
    },
    colorWhite: {
        color: colors.white,
    },
    colorBorderGrey: {
        color: Colors.light.border,
    },
    colorTextGrey: {
        color: Colors.light.textGrey,
    },
    colorBlueBg: {
        color: Colors.light.background
    }
}

export const { neurialGrotesk, fw400, fw500, fw600, fw700, fs10, fs12, fs14, fs16, fs18, colorBlack, colorWhite, colorBorderGrey, colorTextGrey, colorBlueBg } = fontStyles;


type TFS = <T extends string>(val: T) => TextStyle;
type TFSProp = { c: TFS };

export const { c }: TFSProp = {
    c: (val) => {
        return {
            color: val
        }
    },

};
