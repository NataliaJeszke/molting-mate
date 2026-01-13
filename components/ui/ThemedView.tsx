import { View, type ViewProps } from "react-native";

import { useUserStore } from "@/store/userStore";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedViewProps) {
  const { currentTheme } = useUserStore();

  const backgroundColor =
    currentTheme === "light"
      ? lightColor || "transparent"
      : darkColor || "transparent";

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
