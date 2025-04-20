import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Modal,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { isAfter, parseISO } from "date-fns";

import { FilterViewTypes, useFiltersStore } from "@/store/filtersStore";
import { useUserStore } from "@/store/userStore";

import { Colors, ThemeType } from "@/constants/Colors";

import { ThemedText } from "@/components/ui/ThemedText";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";

type FiltersProps = {
  viewType: FilterViewTypes;
  isVisible: boolean;
  onClose: () => void;
};

const Filters = ({ viewType, isVisible, onClose }: FiltersProps) => {
  const { filters, setFilters, resetFilters } = useFiltersStore();
  const { currentTheme } = useUserStore();
  const current = filters[viewType];
  const [isDateFromPickerVisible, setDateFromPickerVisible] = useState(false);
  const [isDateToPickerVisible, setDateToPickerVisible] = useState(false);

  const handleChange = (field: keyof typeof current, value: string) => {
    setFilters(viewType, {
      ...current,
      [field]: value,
    });
  };

  const handleReset = () => {
    resetFilters(viewType);
  };

  const showDateFromPicker = () => {
    setDateFromPickerVisible(true);
  };

  const hideDateFromPicker = () => {
    setDateFromPickerVisible(false);
  };

  const handleDateFromConfirm = (dateString: string) => {
    handleChange("dateFrom", dateString);
    hideDateFromPicker();
  };

  const showDateToPicker = () => {
    setDateToPickerVisible(true);
  };

  const hideDateToPicker = () => {
    setDateToPickerVisible(false);
  };

  const handleDateToConfirm = (dateString: string) => {
    handleChange("dateTo", dateString);
    hideDateToPicker();
  };

  const getInitialDateFrom = () => {
    if (current.dateFrom) {
      const parsedDate = parseISO(current.dateFrom);
      return isAfter(parsedDate, new Date()) ? new Date() : parsedDate;
    }
    return new Date();
  };

  const getInitialDateTo = () => {
    if (current.dateTo) {
      const parsedDate = parseISO(current.dateTo);
      return isAfter(parsedDate, new Date()) ? new Date() : parsedDate;
    }
    return new Date();
  };

  const today = new Date();

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios" &&
          !isDateFromPickerVisible &&
          !isDateToPickerVisible
            ? "padding"
            : undefined
        }
        style={styles(currentTheme).container}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={styles(currentTheme).overlay}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          />
        </TouchableWithoutFeedback>

        <Animated.View style={styles(currentTheme).filtersContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles(currentTheme).contentContainer}>
              <View style={styles(currentTheme).handleBar} />

              <ThemedText style={styles(currentTheme).filtersTitle}>
                Wybierz filtry:
              </ThemedText>

              <TextInput
                placeholder="Wiek (liczba)"
                value={current.age?.replace("L", "") || ""}
                onChangeText={(text) => {
                  const numeric = text.replace(/\D/g, "");
                  const withL = numeric ? `L${numeric}` : "";
                  handleChange("age", withL);
                }}
                style={styles(currentTheme).input}
                placeholderTextColor={Colors[currentTheme].text + "80"}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Płeć (np. samica)"
                value={current.gender || ""}
                onChangeText={(text) => handleChange("gender", text)}
                style={styles(currentTheme).input}
                placeholderTextColor={Colors[currentTheme].text + "80"}
              />
              <TextInput
                placeholder="Gatunek"
                value={current.species || ""}
                onChangeText={(text) => handleChange("species", text)}
                style={styles(currentTheme).input}
                placeholderTextColor={Colors[currentTheme].text + "80"}
              />

              {viewType !== "collection" && (
                <>
                  <TouchableOpacity
                    style={styles(currentTheme).dateInput}
                    onPress={showDateFromPicker}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      style={
                        current.dateFrom
                          ? styles(currentTheme).dateText
                          : styles(currentTheme).datePlaceholder
                      }
                    >
                      {current.dateFrom || "Data od (yyyy-MM-dd)"}
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles(currentTheme).dateInput}
                    onPress={showDateToPicker}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      style={
                        current.dateTo
                          ? styles(currentTheme).dateText
                          : styles(currentTheme).datePlaceholder
                      }
                    >
                      {current.dateTo || "Data do (yyyy-MM-dd)"}
                    </ThemedText>
                  </TouchableOpacity>
                </>
              )}

              <View style={styles(currentTheme).buttonsContainer}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles(currentTheme).closeButton}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles(currentTheme).closeButtonText}>
                    Zamknij
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleReset}
                  style={styles(currentTheme).resetButton}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles(currentTheme).resetButtonText}>
                    Wyczyść
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>

        {viewType !== "collection" && (
          <>
            <ThemedDatePicker
              isVisible={isDateFromPickerVisible}
              initialDate={getInitialDateFrom()}
              maximumDate={today}
              onConfirm={handleDateFromConfirm}
              onCancel={hideDateFromPicker}
            />
            <ThemedDatePicker
              isVisible={isDateToPickerVisible}
              initialDate={getInitialDateTo()}
              maximumDate={today}
              onConfirm={handleDateToConfirm}
              onCancel={hideDateToPicker}
            />
          </>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};
/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-end",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    filtersContainer: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: Colors[theme].modal_update.backgroundColor,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 10,
      maxHeight: "85%",
    },
    contentContainer: {
      padding: 20,
    },
    handleBar: {
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: Colors[theme].text + "40",
      alignSelf: "center",
      marginBottom: 15,
    },
    filtersTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      color: Colors[theme].text,
    },
    input: {
      padding: 16,
      borderWidth: 1,
      borderRadius: 12,
      marginBottom: 12,
      borderColor: Colors[theme].modal_update
        ? Colors[theme].modal_update.borderColor
        : theme === "dark"
          ? "#3a3a3c"
          : "#d1d1d6",
      fontSize: 16,
      color: Colors[theme].text,
      backgroundColor: Colors[theme].input
        ? Colors[theme].input.backgroundColor
        : theme === "dark"
          ? "#2c2c2e"
          : "#ffffff",
    },
    dateInput: {
      padding: 16,
      borderWidth: 1,
      borderRadius: 12,
      marginBottom: 12,
      borderColor: Colors[theme].modal_update
        ? Colors[theme].modal_update.borderColor
        : theme === "dark"
          ? "#3a3a3c"
          : "#d1d1d6",
      backgroundColor: Colors[theme].input
        ? Colors[theme].input.backgroundColor
        : theme === "dark"
          ? "#2c2c2e"
          : "#ffffff",
    },
    dateText: {
      color: Colors[theme].text,
      fontSize: 16,
    },
    datePlaceholder: {
      color: Colors[theme].text + "80",
      fontSize: 16,
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    resetButton: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: "#ff4747",
      marginLeft: 8,
    },
    resetButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    closeButton: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#3a3a3c" : "#e5e5ea",
      marginRight: 8,
    },
    closeButtonText: {
      color: Colors[theme].text,
      fontWeight: "600",
      fontSize: 16,
    },
  });

export default Filters;
