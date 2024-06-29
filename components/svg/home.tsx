// import Svg, { Path } from "react-native-svg";
import * as SVG from "react-native-svg";

const { Svg, Circle, Path } = SVG;

const HomeSVG = ({ color }: { color?: string }) => (
    <Svg width="20" height="22" viewBox="0 0 20 22" fill="none" >
        <Path d="M9.03 1.255L2.03 5.145C1.4 5.495 1 6.165 1 6.895V18.715C1 19.815 1.9 20.715 3 20.715H7V15.715C7 15.165 7.45 14.715 8 14.715H12C12.55 14.715 13 15.165 13 15.715V20.715H17C18.1 20.715 19 19.815 19 18.715V6.895C19 6.165 18.61 5.495 17.97 5.145L10.97 1.255C10.37 0.915 9.63 0.915 9.03 1.255Z" fill={color || '#5D5FEF'} stroke={color || '#5D5FEF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M11.7305 5.10498L15.4904 7.19498C15.8104 7.37498 16.0005 7.70498 16.0005 8.06498V12.715" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default HomeSVG;

