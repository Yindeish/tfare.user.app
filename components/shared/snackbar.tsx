import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface SnackbarProps {
  message: string;
}

const Snackbar: React.FC<SnackbarProps> = ({ message }) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(100); // Starts off-screen

  // Show the Snackbar
  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    // Hide the Snackbar after 3 seconds (you can adjust this duration)
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, 3000); // Duration should match your context timeout duration
  }, [message]);

  return (
    <Animated.View
      style={[
        styles.snackbar,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#323232',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default Snackbar;
