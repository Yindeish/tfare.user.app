import { colors } from '@/constants/Colors';
import Constants from 'expo-constants';
import { View, Dimensions } from 'react-native';


const SafeScreen = ({ children }: { children: React.ReactNode }) => {
    const { statusBarHeight } = Constants;
    const { width, height } = Dimensions.get('window');

    return (
        <View style={{ width, height, paddingTop: statusBarHeight, backgroundColor: colors.white }}>
            {children}
        </View>
    )
}

export default SafeScreen;