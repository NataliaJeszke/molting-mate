import { useUserStore } from "@/store/userStore";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function BlurTabBarBackground() {
  const { currentTheme } = useUserStore();
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: Colors[currentTheme].background },
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
