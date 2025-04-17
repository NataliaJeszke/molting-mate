import React from "react";
import { View, StyleSheet } from "react-native";

import { useUserStore } from "@/store/userStore";

import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";


const Filters = () => {
  const { currentTheme } = useUserStore();

  return (
    <View style={styles(currentTheme).filtersContainer}>
      <ThemedText style={styles(currentTheme).filtersTitle}>
        Wybierz filtry:
      </ThemedText>
      <ThemedText style={{ marginTop: 10 }}>
        (Tu będą komponenty filtrów)
      </ThemedText>
    </View>
  );
};
/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    filtersContainer: {
      padding: 10,
    },
    filtersTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors[theme].text,
    },
  });

export default Filters;
