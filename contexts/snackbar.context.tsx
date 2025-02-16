import React, { ReactNode, useState } from "react";
import { ISigninContextState } from "./signin.context.interface";
import { ISnackbarContext, ISnackbarContextState } from "./snackbar.interface";
import { View, Text, Dimensions, Platform, ToastAndroid } from "react-native";
import { Snackbar } from "react-native-paper";
import Colors, { colors } from "@/constants/Colors";
import tw from "@/constants/tw";

function SnackbarComponent({
  onDismiss,
  snackbarVisible,
  msg,
}: {
  snackbarVisible: boolean;
  onDismiss: () => void;
  msg: string;
}) {
  const { width } = Dimensions.get("window");

  return (
    <Snackbar
      visible={snackbarVisible}
      onDismiss={onDismiss}
      duration={4000}
      style={{ backgroundColor: Colors.light.border }}
      wrapperStyle={{ backgroundColor: colors.transparent, width }}

      //   action={{
      //     label: "OK",
      //     onPress: () => {
      //       closeSnackbar();
      //     },
      //   }}
    >
      <Text style={tw`text-[10px] font-medium text-red-500`}>{msg}</Text>
    </Snackbar>
  );
}

const SnackbarContext = React.createContext<ISnackbarContext>({
  openSnackbar: () => null,
  closeSnackbar: () => null,
  snackbarVisible: false,
  Snackbar: SnackbarComponent,
  notify: () => null,
});

export function useSnackbar() {
  const value = React.useContext(SnackbarContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSnackbar must be wrapped in a <SnackbarProvider />");
    }
  }

  return value;
}

export function SnackbarProvider(props: React.PropsWithChildren) {
  const [snackbarState, setSnackbarState] = useState<ISnackbarContextState>({
    snackbarVisible: false,
  });
  const { snackbarVisible } = snackbarState;

  const onChange = (key: keyof ISnackbarContextState, value: boolean) =>
    setSnackbarState((prev) => ({ ...prev, [key]: value }));

  const openSnackbar = () => {
    onChange("snackbarVisible", true);
  };

  const closeSnackbar = () => {
    onChange("snackbarVisible", false);
  };

  const notify = ({
    msg,
    timeout = 2000,
  }: {
    timeout?: number;
    msg: string;
  }) => {
    openSnackbar();

    setTimeout(() => {
      closeSnackbar();
    }, timeout);
    if (Platform.OS == "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  return (
    <SnackbarContext.Provider
      value={{
        openSnackbar,
        closeSnackbar,
        snackbarVisible,
        Snackbar: SnackbarComponent,
        notify
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
}
