import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface ScaleUpDownProps {
  children: React.ReactNode; // This allows the component to accept any children (JSX).
  duration?: number; // Optional prop to control the duration of the animation (in milliseconds).
  scaleMin?: number; // Minimum scale for the animation (default is 0.9).
  scaleMax?: number; // Maximum scale for the animation (default is 1.2).
}

const ScaleUpDown: React.FC<ScaleUpDownProps> = ({
  children,
  duration = 1500,
  scaleMin = 0.9,
  scaleMax = 1.2,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Create an infinite loop for the scaling animation
    const animate = () => {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: scaleMax,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: scaleMin,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => animate()); // Restart the animation after it completes
    };

    animate(); // Start the animation loop

    return () => {
      scaleValue.stopAnimation(); // Clean up on unmount
    };
  }, [scaleValue, duration, scaleMin, scaleMax]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScaleUpDown;
