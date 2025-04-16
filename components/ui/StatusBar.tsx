// components/CustomStatusBar.tsx
import { StatusBar as ExpoStatusBar, StatusBarStyle } from "expo-status-bar";
import { ColorSchemeName } from "react-native";

type Props = {
  currentTheme: "light" | "dark";
  systemTheme: ColorSchemeName;
};

function getStatusBarStyle(
  currentTheme: "light" | "dark",
  systemTheme: ColorSchemeName
): StatusBarStyle {
  if (currentTheme === "light") {
    return "dark";
  }

  if (currentTheme === "dark" && systemTheme === "light") {
    return "light";
  }

  return "light";
}

export const StatusBar = ({ currentTheme, systemTheme }: Props) => {
  return <ExpoStatusBar style={getStatusBarStyle(currentTheme, systemTheme)} />;
};