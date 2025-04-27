import { Animated } from "react-native";

export const getAddSpiderStyle = (animation: Animated.Value) => ({
  transform: [
    {
      translateY: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -120],
      }),
    },
  ],
  opacity: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  }),
});

export const getAddSpeciesStyle = (animation: Animated.Value) => ({
  transform: [
    {
      translateY: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -60],
      }),
    },
  ],
  opacity: animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  }),
});
