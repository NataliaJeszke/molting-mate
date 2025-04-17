import {
  StatusBar as RNStatusBar,
  StatusBarStyle,
  ColorSchemeName,
  AppState,
} from "react-native";
import { useEffect } from "react";

type Props = {
  currentTheme: "light" | "dark";
  systemTheme: ColorSchemeName;
};

function getStatusBarStyle(
  currentTheme: "light" | "dark",
  systemTheme: ColorSchemeName,
): StatusBarStyle {
  if (currentTheme === "light") {
    return "dark-content";
  }

  if (currentTheme === "dark" && systemTheme === "light") {
    return "light-content";
  }

  return "light-content";
}

export const StatusBar = ({ currentTheme, systemTheme }: Props) => {
  const barStyle = getStatusBarStyle(currentTheme, systemTheme);

  useEffect(() => {
    RNStatusBar.setBarStyle(barStyle, true);

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        RNStatusBar.setBarStyle(barStyle, true);
      }
    });

    return () => subscription.remove();
  }, [barStyle]);

  return <RNStatusBar barStyle={barStyle} animated />;
};
