import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { BackHandler, Alert } from "react-native";

const usePreventGoBack = (shouldPrevent: boolean) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (!shouldPrevent) return;

    // Disable gestures and back button
    navigation.setOptions({ gestureEnabled: false });

    const onBackPress = () => {
      Alert.alert("Hold on!", "You can't go back from here.", [{ text: "OK" }]);
      return true; // Block back action
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [shouldPrevent, navigation]);
};

export default usePreventGoBack;
