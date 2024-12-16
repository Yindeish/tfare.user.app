import { colors } from "@/constants/Colors";
import { ReactNode } from "react";
import { Text } from "react-native";



function ErrorMsg({ msg }: { msg: ReactNode }) {


    return (
        <Text style={[{ color: colors.red50, fontSize: 10 }]}>{msg}</Text>
    )
}

export default ErrorMsg;