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
import { IndividualType } from "@/models/Spider.model";

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
  const [individualTypes, setIndividualTypes] = useState<IndividualType[]>(
    // eslint-disable-next-line prettier/prettier
    current.individualType || []
  );

  const today = new Date();
  const individualTypeOptions: { label: string; value: IndividualType }[] = [
    { label: "Samiec", value: "Samiec" },
    { label: "Samica", value: "Samica" },
    { label: "Niezidentyfikowany", value: "Niezidentyfikowany" },
  ];

  const handleChange = (
    field: keyof typeof current,
    value: string | number,
  ) => {
    setFilters(viewType, {
      ...current,
      [field]: value,
    });
  };

  const handleReset = () => {
    resetFilters(viewType);
    setIndividualTypes([]);
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

  const toggleIndividualType = (value: IndividualType) => {
    const updated = individualTypes.includes(value)
      ? individualTypes.filter((item) => item !== value)
      : [...individualTypes, value];

    setIndividualTypes(updated);
    setFilters(viewType, {
      ...current,
      individualType: updated,
    });
  };

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
                placeholder="0"
                value={current.age?.toString()}
                onChangeText={(text) => handleChange("age", +text)}
                style={styles(currentTheme).input}
                placeholderTextColor={Colors[currentTheme].text + "80"}
                keyboardType="numeric"
              />
              <ThemedText>Płeć</ThemedText>
              <View style={styles(currentTheme).checkboxWrapper}>
                {individualTypeOptions.map((option) => {
                  const isSelected = individualTypes.includes(option.value);
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() =>
                        toggleIndividualType(option.value as IndividualType)
                      }
                      style={[
                        styles(currentTheme).checkboxItem,
                        isSelected
                          ? styles(currentTheme).checkboxSelected
                          : styles(currentTheme).checkboxUnselected,
                      ]}
                    >
                      <ThemedText
                        style={
                          isSelected
                            ? styles(currentTheme).checkboxTextSelected
                            : styles(currentTheme).checkboxTextUnselected
                        }
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TextInput
                placeholder="Gatunek"
                value={current.spiderSpecies || ""}
                onChangeText={(text) => handleChange("spiderSpecies", text)}
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
      maxHeight: "90%",
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
      marginTop: 5,
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
    checkboxWrapper: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 12,
      gap: 8,
    },

    checkboxItem: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 16,
      borderWidth: 1,
    },

    checkboxSelected: {
      borderColor: Colors[theme].card.borderColor,
      backgroundColor: "#4CAF50",
    },

    checkboxUnselected: {
      borderColor: Colors[theme].card.borderColor,
      backgroundColor: "transparent",
    },

    checkboxTextSelected: {
      color: "#fff",
    },

    checkboxTextUnselected: {
      color: Colors[theme].text,
    },
  });

export default Filters;
