import React, { useEffect } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";
import { Colors, ThemeType } from "@/constants/Colors";
import { FilterViewTypes } from "@/models/Filters.model";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTranslation } from "@/hooks/useTranslation";

type SortModalProps = {
  visible: boolean;
  onClose: () => void;
  sortType: string;
  setSortType: (type: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  viewType: FilterViewTypes;
  currentTheme: ThemeType;
};

export const SortModal = ({
  visible,
  onClose,
  sortType,
  setSortType,
  sortOrder,
  setSortOrder,
  viewType,
  currentTheme,
}: SortModalProps) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (viewType === "molting" && !sortType) {
      setSortType("lastMolt");
    } else if (viewType === "feeding" && !sortType) {
      setSortType("lastFed");
    } else if (viewType === "collection" && !sortType) {
      setSortType("lastMolt");
    }
  }, [viewType, sortType, setSortType]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles(currentTheme).sortModal}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={styles(currentTheme).sortModal__overlay} />
        </TouchableWithoutFeedback>

        <Animated.View style={styles(currentTheme).sortModal__modal}>
          <View style={styles(currentTheme).sortModal__content}>
            <View style={styles(currentTheme).sortModal__handle} />

            <ThemedText style={styles(currentTheme).sortModal__title}>
              {t("components.commons.sort-modal.title")}
            </ThemedText>

            {viewType === "molting" && (
              <TouchableOpacity
                style={[
                  styles(currentTheme).sortModal__option,
                  sortType === "lastMolt"
                    ? styles(currentTheme)["sortModal__option--selected"]
                    : styles(currentTheme)["sortModal__option--unselected"],
                ]}
                onPress={() => {
                  setSortType("lastMolt");
                }}
              >
                <ThemedText
                  style={
                    sortType === "lastMolt"
                      ? styles(currentTheme)["sortModal__option-text--selected"]
                      : styles(currentTheme)[
                          "sortModal__option-text--unselected"
                        ]
                  }
                >
                  {t("components.commons.sort-modal.last_molting")}
                </ThemedText>
                {sortType === "lastMolt" && (
                  <View style={styles(currentTheme).sortModal__checkmark}>
                    <ThemedText
                      style={styles(currentTheme).sortModal__checkmarkText}
                    >
                      ✓
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            )}

            {viewType === "feeding" && (
              <>
                <TouchableOpacity
                  style={[
                    styles(currentTheme).sortModal__option,
                    sortType === "lastFed"
                      ? styles(currentTheme)["sortModal__option--selected"]
                      : styles(currentTheme)["sortModal__option--unselected"],
                  ]}
                  onPress={() => {
                    setSortType("lastFed");
                  }}
                >
                  <ThemedText
                    style={
                      sortType === "lastFed"
                        ? styles(currentTheme)[
                            "sortModal__option-text--selected"
                          ]
                        : styles(currentTheme)[
                            "sortModal__option-text--unselected"
                          ]
                    }
                  >
                    {t("components.commons.sort-modal.last_feeding")}
                  </ThemedText>
                  {sortType === "lastFed" && (
                    <View style={styles(currentTheme).sortModal__checkmark}>
                      <ThemedText
                        style={styles(currentTheme).sortModal__checkmarkText}
                      >
                        ✓
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles(currentTheme).sortModal__option,
                    sortType === "nextFeedingDate"
                      ? styles(currentTheme)["sortModal__option--selected"]
                      : styles(currentTheme)["sortModal__option--unselected"],
                  ]}
                  onPress={() => {
                    setSortType("nextFeedingDate");
                  }}
                >
                  <ThemedText
                    style={
                      sortType === "nextFeedingDate"
                        ? styles(currentTheme)[
                            "sortModal__option-text--selected"
                          ]
                        : styles(currentTheme)[
                            "sortModal__option-text--unselected"
                          ]
                    }
                  >
                    {t("components.commons.sort-modal.next_feeding")}
                  </ThemedText>
                  {sortType === "nextFeedingDate" && (
                    <View style={styles(currentTheme).sortModal__checkmark}>
                      <ThemedText
                        style={styles(currentTheme).sortModal__checkmarkText}
                      >
                        ✓
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              </>
            )}

            {viewType === "collection" && (
              <>
                <TouchableOpacity
                  style={[
                    styles(currentTheme).sortModal__option,
                    sortType === "lastMolt"
                      ? styles(currentTheme)["sortModal__option--selected"]
                      : styles(currentTheme)["sortModal__option--unselected"],
                  ]}
                  onPress={() => {
                    setSortType("lastMolt");
                  }}
                >
                  <ThemedText
                    style={
                      sortType === "lastMolt"
                        ? styles(currentTheme)[
                            "sortModal__option-text--selected"
                          ]
                        : styles(currentTheme)[
                            "sortModal__option-text--unselected"
                          ]
                    }
                  >
                    {t("components.commons.sort-modal.last_molting")}
                  </ThemedText>
                  {sortType === "lastMolt" && (
                    <View style={styles(currentTheme).sortModal__checkmark}>
                      <ThemedText
                        style={styles(currentTheme).sortModal__checkmarkText}
                      >
                        ✓
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles(currentTheme).sortModal__option,
                    sortType === "lastFed"
                      ? styles(currentTheme)["sortModal__option--selected"]
                      : styles(currentTheme)["sortModal__option--unselected"],
                  ]}
                  onPress={() => {
                    setSortType("lastFed");
                  }}
                >
                  <ThemedText
                    style={
                      sortType === "lastFed"
                        ? styles(currentTheme)[
                            "sortModal__option-text--selected"
                          ]
                        : styles(currentTheme)[
                            "sortModal__option-text--unselected"
                          ]
                    }
                  >
                    {t("components.commons.sort-modal.last_feeding")}
                  </ThemedText>
                  {sortType === "lastFed" && (
                    <View style={styles(currentTheme).sortModal__checkmark}>
                      <ThemedText
                        style={styles(currentTheme).sortModal__checkmarkText}
                      >
                        ✓
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              </>
            )}

            <View style={styles(currentTheme).sortModal__divider} />

            <View style={styles(currentTheme).sortModal__directionContainer}>
              <ThemedText
                style={styles(currentTheme).sortModal__directionLabel}
              >
                {t("components.commons.sort-modal.direction.title")}
              </ThemedText>

              <TouchableOpacity
                style={[
                  styles(currentTheme).sortModal__directionButton,
                  sortOrder === "asc"
                    ? styles(currentTheme)["sortModal__direction--selected"]
                    : styles(currentTheme)["sortModal__direction--unselected"],
                ]}
                onPress={() => setSortOrder("asc")}
              >
                <ThemedText
                  style={
                    sortOrder === "asc"
                      ? styles(currentTheme)[
                          "sortModal__direction-text--selected"
                        ]
                      : styles(currentTheme)[
                          "sortModal__direction-text--unselected"
                        ]
                  }
                >
                  ↑ {t("components.commons.sort-modal.direction.asc")}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles(currentTheme).sortModal__directionButton,
                  sortOrder === "desc"
                    ? styles(currentTheme)["sortModal__direction--selected"]
                    : styles(currentTheme)["sortModal__direction--unselected"],
                ]}
                onPress={() => setSortOrder("desc")}
              >
                <ThemedText
                  style={
                    sortOrder === "desc"
                      ? styles(currentTheme)[
                          "sortModal__direction-text--selected"
                        ]
                      : styles(currentTheme)[
                          "sortModal__direction-text--unselected"
                        ]
                  }
                >
                  ↓ {t("components.commons.sort-modal.direction.desc")}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles(currentTheme)["sortModal__button--confirm"]}
              activeOpacity={0.7}
            >
              <ThemedText
                style={styles(currentTheme)["sortModal__button-text--confirm"]}
              >
                {t("components.commons.sort-modal.buttons.apply")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    sortModal: {
      flex: 1,
      justifyContent: "flex-end",
    },
    sortModal__overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    sortModal__modal: {
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
    sortModal__content: {
      padding: 24,
    },
    sortModal__handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors[theme].text + "30",
      alignSelf: "center",
      marginBottom: 20,
    },
    sortModal__title: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
      color: Colors[theme].text,
    },
    sortModal__option: {
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 14,
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    "sortModal__option--selected": {
      backgroundColor: theme === "dark" ? "#2e1a47" : "#e9dff8",
      borderWidth: 0,
    },
    "sortModal__option--unselected": {
      backgroundColor: Colors[theme].input.backgroundColor,
      borderWidth: 0,
    },
    "sortModal__option-text--selected": {
      color: theme === "dark" ? "#c9a7f5" : "#2e1a47",
      fontSize: 16,
      fontWeight: "500",
    },
    "sortModal__option-text--unselected": {
      color: Colors[theme].text,
      fontSize: 16,
    },
    sortModal__checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme === "dark" ? "#c9a7f5" : "#2e1a47",
      justifyContent: "center",
      alignItems: "center",
    },
    sortModal__checkmarkText: {
      color: theme === "dark" ? "#1f1f1f" : "#ffffff",
      fontWeight: "bold",
    },
    sortModal__divider: {
      height: 1,
      backgroundColor: Colors[theme].text + "15",
      marginVertical: 16,
    },
    sortModal__directionContainer: {
      marginBottom: 20,
    },
    sortModal__directionLabel: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 12,
      color: Colors[theme].text,
    },
    sortModal__directionButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 14,
      marginBottom: 10,
    },
    "sortModal__direction--selected": {
      backgroundColor: theme === "dark" ? "#2e1a47" : "#e9dff8",
    },
    "sortModal__direction--unselected": {
      backgroundColor: Colors[theme].input.backgroundColor,
    },
    "sortModal__direction-text--selected": {
      color: theme === "dark" ? "#c9a7f5" : "#2e1a47",
      fontSize: 16,
      fontWeight: "500",
    },
    "sortModal__direction-text--unselected": {
      color: Colors[theme].text,
      fontSize: 16,
    },
    "sortModal__button--confirm": {
      padding: 16,
      borderRadius: 14,
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#c9a7f5" : "#2e1a47",
      marginTop: 8,
    },
    "sortModal__button-text--confirm": {
      color: theme === "dark" ? "#1f1f1f" : "#ffffff",
      fontWeight: "600",
      fontSize: 16,
    },
  });
