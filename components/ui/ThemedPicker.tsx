import React from "react";
import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { ThemedText } from "./ThemedText";
import { Colors, ThemeType } from "../../constants/Colors";

type ThemedPickerProps = {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  theme: ThemeType;
};

const ThemedPicker = ({
  label,
  selectedValue,
  onValueChange,
  options,
  theme,
}: ThemedPickerProps) => (
  <View style={styles(theme)["themed-picker__container"]}>
    <ThemedText style={styles(theme)["themed-picker__label"]}>
      {label}
    </ThemedText>
    <View style={styles(theme)["themed-picker__picker-wrapper"]}>
      <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
            color={Colors[theme].picker.text}
          />
        ))}
      </Picker>
    </View>
  </View>
);

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    "themed-picker__container": {
      marginBottom: 24,
      padding: 10,
    },
    "themed-picker__label": {
      fontSize: 14,
      marginBottom: 8,
      color: Colors[theme].picker.label.color,
    },
    "themed-picker__picker-wrapper": {
      overflow: "hidden",
    },
  });

export default ThemedPicker;
