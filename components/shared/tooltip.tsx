import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface TooltipProps {
  message: string;
  visible: boolean;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ message, visible, children }) => {
  return (
    <View style={styles.container}>
      {children}
      {visible && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.tooltip}
        >
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "relative", alignItems: "center" },
  tooltip: {
    position: "absolute",
    top: -40,
    backgroundColor: "black",
    padding: 8,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: { color: "white", fontSize: 14 },
});

export default Tooltip;
