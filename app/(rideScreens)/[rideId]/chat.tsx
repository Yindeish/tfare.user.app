import PaddedScreen from "@/components/shared/paddedScreen";
import SafeScreen from "@/components/shared/safeScreen";
import { wHFull } from "@/utils/imageStyles";
import { View } from "react-native";



function Chat() {


    return (
        <SafeScreen>
            <PaddedScreen>
                <View style={[wHFull]}>

                </View>
            </PaddedScreen>
        </SafeScreen>
    )
}

export default Chat;