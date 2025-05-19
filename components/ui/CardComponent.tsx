import React, { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

import { useUserStore } from "@/store/userStore";
import { Colors, ThemeType } from "@/constants/Colors";

type CardComponentProps = {
  children: ReactNode;
  customStyle?: StyleProp<ViewStyle>;
};

const CardComponent = ({ children, customStyle }: CardComponentProps) => {
  const { currentTheme } = useUserStore();
  const isDarkMode = currentTheme === "dark";
  const cardColors = isDarkMode ? Colors.dark.card : Colors.light.card;

  return (
    <View style={[styles(currentTheme).card, cardColors, customStyle]}>
      {children}
    </View>
  );
};
/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      padding: 20,
      marginVertical: 8,
      shadowColor: theme === "dark" ? "#000" : "#2e1a47",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "dark" ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      color: theme === "dark" ? "#c9a7f5" : "#2e1a47",
    },
  });

export default CardComponent;
