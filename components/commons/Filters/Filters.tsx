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

import { useFiltersStore } from "@/store/filtersStore";
import { useUserStore } from "@/store/userStore";

import { useTranslation } from "@/hooks/useTranslation";
import { useIndividualTypeOptions } from "@/hooks/useIndividualTypeOptions";

import { IndividualType } from "@/constants/IndividualType.enums";
import { Colors, ThemeType } from "@/constants/Colors";
import { FilterViewTypes } from "@/models/Filters.model";

import { ThemedText } from "@/components/ui/ThemedText";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";
import { ThemedRangeSlider } from "@/components/ui/ThemedRangeSlider";

type FiltersProps = {
  viewType: FilterViewTypes;
  isVisible: boolean;
  onClose: () => void;
};

const Filters = ({ viewType, isVisible, onClose }: FiltersProps) => {
  const { filters, setFilters, setRangeFilters, resetFilters } =
    useFiltersStore();
  const individualTypeOptions = useIndividualTypeOptions();
  const current = filters[viewType];
  const { currentTheme } = useUserStore();
  const [isDateFromPickerVisible, setDateFromPickerVisible] = useState(false);
  const [isDateToPickerVisible, setDateToPickerVisible] = useState(false);
  const [individualTypes, setIndividualTypes] = useState<IndividualType[]>(
    current.individualType || [],
  );
  const { t } = useTranslation();

  const today = new Date();

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

  const handleRangeChange = (from: number, to: number) => {
    console.log("Range slider changed to", from, to);
    setRangeFilters(viewType, from, to);
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
      animationType="fade"
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
        style={styles(currentTheme).filters}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={styles(currentTheme).filters__overlay}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          />
        </TouchableWithoutFeedback>

        <Animated.View style={styles(currentTheme).filters__modal}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles(currentTheme).filters__content}>
              <View style={styles(currentTheme).filters__handle} />

              <ThemedText style={styles(currentTheme).filters__title}>
                {t("components.commons.filters.title")}
              </ThemedText>

              <ThemedRangeSlider
                min={0}
                max={20}
                step={1}
                initialValues={[
                  typeof current.ageFrom === "number" ? current.ageFrom : 0,
                  typeof current.ageTo === "number" ? current.ageTo : 20,
                ]}
                label={t("components.commons.filters.age")}
                onChange={([from, to]) => {
                  handleRangeChange(from, to);
                }}
                allowSameValue={true}
              />

              <ThemedText style={styles(currentTheme).filters__label}>
                {t("components.commons.filters.individual_type")}
              </ThemedText>

              <View style={styles(currentTheme).filters__checkbox_group}>
                {individualTypeOptions.map((option) => {
                  const isSelected = individualTypes.includes(option.value);
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() =>
                        toggleIndividualType(option.value as IndividualType)
                      }
                      style={[
                        styles(currentTheme).filters__checkbox,
                        isSelected
                          ? styles(currentTheme)["filters__checkbox--selected"]
                          : styles(currentTheme)[
                              "filters__checkbox--unselected"
                            ],
                      ]}
                    >
                      <ThemedText
                        style={
                          isSelected
                            ? styles(currentTheme)[
                                "filters__checkbox-text--selected"
                              ]
                            : styles(currentTheme)[
                                "filters__checkbox-text--unselected"
                              ]
                        }
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View>
                <ThemedText style={styles(currentTheme).filters__label}>
                  {t("components.commons.filters.species")}
                </ThemedText>

                <TextInput
                  placeholder={t(
                    "components.commons.filters.species_placeholder",
                  )}
                  value={current.spiderSpecies || ""}
                  onChangeText={(text) => handleChange("spiderSpecies", text)}
                  style={styles(currentTheme).filters__input}
                  placeholderTextColor={Colors[currentTheme].text + "80"}
                />
              </View>

              {viewType !== "collection" && (
                <View>
                  <ThemedText style={styles(currentTheme).filters__label}>
                    {t("components.commons.filters.date.label")}
                  </ThemedText>

                  <View style={styles(currentTheme).filters__dates_container}>
                    <TouchableOpacity
                      style={styles(currentTheme).filters__date_input}
                      onPress={showDateFromPicker}
                      activeOpacity={0.7}
                    >
                      <ThemedText
                        style={
                          current.dateFrom
                            ? styles(currentTheme).filters__date_text
                            : styles(currentTheme).filters__date_placeholder
                        }
                      >
                        {current.dateFrom ||
                          t("components.commons.filters.date.from")}
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles(currentTheme).filters__date_input}
                      onPress={showDateToPicker}
                      activeOpacity={0.7}
                    >
                      <ThemedText
                        style={
                          current.dateTo
                            ? styles(currentTheme).filters__date_text
                            : styles(currentTheme).filters__date_placeholder
                        }
                      >
                        {current.dateTo ||
                          t("components.commons.filters.date.to")}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles(currentTheme).filters__buttons}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles(currentTheme)["filters__button--confirm"]}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={
                      styles(currentTheme)["filters__button-text--confirm"]
                    }
                  >
                    {t("components.commons.filters.button.apply")}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleReset}
                  style={styles(currentTheme)["filters__button--reset"]}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={styles(currentTheme)["filters__button-text--reset"]}
                  >
                    {t("components.commons.filters.button.reset")}
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
    filters: {
      flex: 1,
      justifyContent: "flex-end",
    },
    filters__overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    filters__modal: {
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      backgroundColor: Colors[theme].modal_update.backgroundColor,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 10,
      maxHeight: "90%",
    },
    filters__content: {
      padding: 24,
    },
    filters__handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors[theme].text + "30",
      alignSelf: "center",
      marginBottom: 20,
    },
    filters__title: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
      color: Colors[theme].text,
    },
    filters__label: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 12,
      color: Colors[theme].text,
    },
    filters__checkbox_group: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 20,
      gap: 10,
    },
    filters__checkbox: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 14,
      marginBottom: 4,
    },
    "filters__checkbox--selected": {
      backgroundColor: theme === "dark" ? "#2e1a47" : "#e9dff8",
      borderWidth: 0,
    },
    "filters__checkbox--unselected": {
      backgroundColor: Colors[theme].input.backgroundColor,
      borderWidth: 0,
    },
    "filters__checkbox-text--selected": {
      color: theme === "dark" ? "#c9a7f5" : "#2e1a47",
      fontSize: 13,
      fontWeight: "500",
    },
    "filters__checkbox-text--unselected": {
      color: Colors[theme].text,
      fontSize: 13,
    },
    filters__input: {
      padding: 16,
      borderRadius: 14,
      marginBottom: 20,
      fontSize: 16,
      color: Colors[theme].text,
      backgroundColor: Colors[theme].input.backgroundColor,
      borderColor: theme === "dark" ? "#3a3a3c" : "#e5e5e7",
      borderWidth: 1,
    },
    filters__dates_container: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      gap: 12,
    },
    filters__date_input: {
      flex: 1,
      padding: 16,
      borderRadius: 14,
      backgroundColor: Colors[theme].input.backgroundColor,
      borderWidth: 0,
    },
    filters__date_text: {
      color: Colors[theme].text,
      fontSize: 16,
    },
    filters__date_placeholder: {
      color: Colors[theme].text + "80",
      fontSize: 16,
    },
    filters__buttons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
      gap: 12,
    },
    "filters__button--reset": {
      flex: 1,
      padding: 16,
      borderRadius: 14,
      alignItems: "center",
      backgroundColor: Colors[theme].filter.button.reset.backgroundColor,
    },
    "filters__button-text--reset": {
      color: Colors[theme].filter.button.reset.color,
      fontWeight: "600",
      fontSize: 16,
    },
    "filters__button--confirm": {
      flex: 1,
      padding: 16,
      borderRadius: 14,
      alignItems: "center",
      backgroundColor: Colors[theme].filter.button.confirm.backgroundColor,
    },
    "filters__button-text--confirm": {
      color: Colors[theme].filter.button.confirm.color,
      fontWeight: "600",
      fontSize: 16,
    },
  });

export default Filters;
