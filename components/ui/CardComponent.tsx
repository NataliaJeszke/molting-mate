import React, { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

import { useUserStore } from "@/store/userStore";
import { Colors } from "@/constants/Colors";

type CardComponentProps = {
  children: ReactNode;
  customStyle?: StyleProp<ViewStyle>;
};

const CardComponent = ({ children, customStyle }: CardComponentProps) => {
  const { currentTheme } = useUserStore();
  const isDarkMode = currentTheme === "dark";
  const cardColors = isDarkMode ? Colors.dark.card : Colors.light.card;

  return <View style={[styles.card, cardColors, customStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
});

export default CardComponent;
