import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useSpidersStore } from "@/store/spidersStore";
import { useUserStore } from "@/store/userStore";

import { Colors, ThemeType } from "@/constants/Colors";

import { ThemedText } from "@/components/ui/ThemedText";

type ModalAlertProps = {
  isVisible: boolean;
  onClose: () => void;
};

const ModalAlert = ({ isVisible, onClose }: ModalAlertProps) => {
  const { id } = useLocalSearchParams();
  const spiders = useSpidersStore((state) => state.spiders);
  const deleteSpider = useSpidersStore((state) => state.removeSpider);
  const { currentTheme } = useUserStore();

  const handleConfirm = () => {
    if (id) {
      deleteSpider(id as string);
      onClose();
    } else {
      onClose();
    }
  };

  const spiderName = id ? spiders.find((spider) => spider.id === id)?.name : "";

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles(currentTheme).container}>
        <View style={styles(currentTheme).centeredView}>
          <TouchableOpacity
            style={styles(currentTheme).backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={styles(currentTheme).modalView}>
            <ThemedText type="title" style={styles(currentTheme).modalTitle}>
              Usuwanie pająka
            </ThemedText>
            <ThemedText type="subtitle" style={styles(currentTheme).modalText}>
              Czy na pewno chcesz usunąć {spiderName} z bazy danych?
            </ThemedText>
            <ThemedText style={styles(currentTheme).modalText}>
              Ta operacja jest nieodwracalna. Wszystkie dane dotyczące tego
              pająka zostaną trwale usunięte.
            </ThemedText>
            <View style={styles(currentTheme).buttonContainer}>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles(currentTheme).button,
                  styles(currentTheme).cancelButton,
                ]}
              >
                <ThemedText style={styles(currentTheme).buttonText}>
                  Anuluj
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={[
                  styles(currentTheme).button,
                  styles(currentTheme).confirmButton,
                ]}
              >
                <ThemedText style={styles(currentTheme).buttonText}>
                  OK
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const windowWidth = Dimensions.get("window").width;
/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      width: windowWidth * 0.8,
      backgroundColor: Colors[theme].modal_alert.backgroundColor,
      borderRadius: 12,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    modalText: {
      fontSize: 14,
      marginBottom: 20,
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    button: {
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: "center",
      marginHorizontal: 5,
    },
    confirmButton: {
      backgroundColor: "#f44336",
    },
    cancelButton: {
      backgroundColor: "#9e9e9e",
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
  });

export default ModalAlert;
