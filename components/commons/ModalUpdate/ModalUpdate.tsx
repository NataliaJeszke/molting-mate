import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";

import { useSpidersStore, useSpider } from "@/store/spidersStore";
import { useUserStore } from "@/store/userStore";

import { Colors, ThemeType } from "@/constants/Colors";

import { ThemedText } from "@/components/ui/ThemedText";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";
import { useTranslation } from "@/hooks/useTranslation";

type ModalUpdateProps = {
  isVisible: boolean;
  onClose: () => void;
};

const ModalUpdate = ({ isVisible, onClose }: ModalUpdateProps) => {
  const { id, type } = useLocalSearchParams();
  const { t } = useTranslation();
  const { currentTheme } = useUserStore();
  const updateSpider = useSpidersStore((state) => state.updateSpider);

  // Get spider ID as string
  const spiderId = Array.isArray(id) ? id[0] : id || "";
  // Use reactive hook for current spider
  const currentSpider = useSpider(spiderId);

  const [date, setDate] = useState("");
  const [age, setAge] = useState(0);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (id && type === "molting" && currentSpider?.age) {
      setAge(currentSpider.age);
    }
  }, [id, type, currentSpider]);

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    let finalDate = date.trim() || getTodayDate();

    if (finalDate && spiderId && type && currentSpider) {
      try {
        if (type === "feeding") {
          await updateSpider({
            id: spiderId,
            lastFed: finalDate,
          });
        } else if (type === "molting") {
          await updateSpider({
            id: spiderId,
            lastMolt: finalDate,
            age: age,
          });
        }
      } catch (error) {
        console.error("Error during saving to database:", error);
      }
      onClose();
    }
  };

  const handleOpenDatePicker = () => {
    setDatePickerVisible(true);
  };

  const handleDateConfirm = (formattedDate: string) => {
    setDate(formattedDate);
    setDatePickerVisible(false);
  };

  const handleDateCancel = () => {
    setDatePickerVisible(false);
  };

  const renderContent = () => {
    const displayDate = date || getTodayDate();

    switch (type) {
      case "feeding":
        return (
          <>
            <ThemedText type="title" style={styles(currentTheme).modal__title}>
              {t("components.commons.modal-update.feeding_title")}
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={styles(currentTheme).modal__subtitle}
            >
              {t("components.commons.modal-update.feeding_message")}
            </ThemedText>

            <View style={styles(currentTheme).dateContainer}>
              <ThemedText style={styles(currentTheme).dateContainer__label}>
                {t("components.commons.modal-update.feeding_date")}:
              </ThemedText>
              <TouchableOpacity
                style={styles(currentTheme).dateContainer__button}
                onPress={handleOpenDatePicker}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={styles(currentTheme).dateContainer__buttonText}
                >
                  {displayDate}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        );
      case "molting":
        return (
          <>
            <ThemedText type="title" style={styles(currentTheme).modal__title}>
              {t("components.commons.modal-update.molting_title")}
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={styles(currentTheme).modal__subtitle}
            >
              {t("components.commons.modal-update.molting_message")}
            </ThemedText>

            <View style={styles(currentTheme).dateContainer}>
              <ThemedText style={styles(currentTheme).dateContainer__label}>
                {t("components.commons.modal-update.molting_date")}:
              </ThemedText>
              <TouchableOpacity
                style={styles(currentTheme).dateContainer__button}
                onPress={handleOpenDatePicker}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={styles(currentTheme).dateContainer__buttonText}
                >
                  {displayDate}
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles(currentTheme).ageInput}>
              <ThemedText style={styles(currentTheme).ageInput__label}>
                {t("components.commons.modal-update.age")}:
              </ThemedText>
              <TextInput
                value={age?.toString()}
                onChangeText={(text) => setAge(+text)}
                keyboardType="numeric"
                style={styles(currentTheme).ageInput__field}
                placeholder={t(
                  "components.commons.modal-update.age_placeholder",
                )}
              />
            </View>
          </>
        );
      default:
        return (
          <ThemedText style={styles(currentTheme).modal__subtitle}>
            {t("components.commons.modal-update.unknown")}: {type}
          </ThemedText>
        );
    }
  };

  if (!isVisible) return null;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles(currentTheme).container}
      >
        <Animated.View
          style={styles(currentTheme).centeredView}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          <BlurView
            intensity={10}
            tint={currentTheme === "dark" ? "dark" : "light"}
            style={styles(currentTheme).backdrop}
          >
            <TouchableOpacity
              style={styles(currentTheme).backdrop}
              activeOpacity={1}
              onPress={onClose}
            />
          </BlurView>

          <Animated.View
            style={styles(currentTheme).modalView}
            entering={FadeIn.duration(300).delay(100)}
          >
            <View style={styles(currentTheme).modal__handle} />
            {renderContent()}
            <View style={styles(currentTheme).buttonContainer}>
              <TouchableOpacity
                onPress={onClose}
                style={styles(currentTheme).buttonContainer__cancelButton}
                activeOpacity={0.8}
              >
                <ThemedText
                  style={styles(currentTheme).buttonContainer__cancelButtonText}
                >
                  {t("components.commons.modal-update.button.cancel")}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles(currentTheme).buttonContainer__confirmButton}
                activeOpacity={0.8}
              >
                <ThemedText
                  style={
                    styles(currentTheme).buttonContainer__confirmButtonText
                  }
                >
                  {t("components.commons.modal-update.button.confirm")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>

      <ThemedDatePicker
        isVisible={isDatePickerVisible}
        initialDate={new Date()}
        maximumDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
      />
    </Modal>
  );
};

const { width } = Dimensions.get("window");
/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      position: "relative",
    },
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalView: {
      width: width,
      backgroundColor: Colors[theme].modal_update.backgroundColor,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      alignItems: "center",
      shadowColor: "gray",
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: theme === "dark" ? 0.15 : 0.1,
      shadowRadius: 12,
      elevation: 10,
      zIndex: 10,
    },
    modal__handle: {
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: Colors[theme].modal_update.backgroundColor,
      marginBottom: 24,
    },
    modal__title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 8,
      textAlign: "center",
      color: Colors[theme].text,
    },
    modal__subtitle: {
      fontSize: 16,
      marginBottom: 24,
      textAlign: "center",
      color: Colors[theme].text || Colors[theme].text + "99",
    },
    dateContainer: {
      width: "100%",
      marginBottom: 20,
    },
    dateContainer__label: {
      fontSize: 16,
      marginBottom: 8,
      color: Colors[theme].text,
    },
    dateContainer__button: {
      backgroundColor: Colors[theme].modal_update.backgroundColor,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors[theme].modal_update.borderColor,
      width: "100%",
      alignItems: "center",
    },
    dateContainer__buttonText: {
      fontSize: 16,
      color: Colors[theme].text,
      fontWeight: "500",
    },
    ageInput: {
      width: "100%",
      marginBottom: 24,
    },
    ageInput__label: {
      fontSize: 16,
      marginBottom: 8,
      color: Colors[theme].text,
    },
    ageInput__field: {
      backgroundColor: Colors[theme].input.backgroundColor,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors[theme].modal_update.borderColor,
      fontSize: 16,
      color: Colors[theme].text,
      width: "100%",
      textAlign: "center",
      fontWeight: "500",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 12,
    },
    buttonContainer__cancelButton: {
      padding: 16,
      borderRadius: 12,
      flex: 1,
      alignItems: "center",
      marginRight: 8,
      borderWidth: 1,
    },
    buttonContainer__confirmButton: {
      padding: 16,
      borderRadius: 12,
      flex: 1,
      alignItems: "center",
      marginLeft: 8,
      backgroundColor: Colors[theme].button.confirm.backgroundColor,
    },
    buttonContainer__cancelButtonText: {
      color: Colors[theme].button.cancel.color,
      fontWeight: "600",
      fontSize: 16,
    },
    buttonContainer__confirmButtonText: {
      color: Colors[theme].button.confirm.color,
      fontWeight: "600",
      fontSize: 16,
    },
  });

export default ModalUpdate;
