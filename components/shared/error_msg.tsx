import { colors } from "@/constants/Colors";
import { ReactNode } from "react";
import { Text } from "react-native";



function ErrorMsg({ msg, code }: { msg: ReactNode, code?: number | null }) {


    return (
        <Text style={[{ color: (code == 201 || code == 200) ? colors.green500 : colors.red500, fontSize: 10 }]}>{msg}</Text>
    )
}

export default ErrorMsg;