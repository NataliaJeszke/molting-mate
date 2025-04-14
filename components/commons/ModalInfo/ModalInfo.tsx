import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSpidersStore } from "@/store/spidersStore";

import { ThemedText } from "@/components/ui/ThemedText";

interface ModalInfoProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (date: string, type: string) => void;
}

const ModalInfo = ({ isVisible, onClose, onSubmit }: ModalInfoProps) => {
  const { id, type, status } = useLocalSearchParams();
  const updateSpider = useSpidersStore((state) => state.updateSpider);
  const [date, setDate] = useState("");

  useEffect(() => {
    console.log("ModalInfo opened");
    console.log("id:", id);
    console.log("type:", type);
  }, [id, type]);

  const handleSubmit = () => {
    if (date && id && type) {
      if (type === "feeding") {
        updateSpider(id as string, { lastFed: date });
      } else if (type === "molting") {
        updateSpider(id as string, { lastMolt: date });
      }
    }
    onSubmit(date, type as string);
    onClose();
  };

  const renderContent = () => {
    const showInput = status !== "FEED_TODAY";

    switch (type) {
      case "feeding":
        return (
          <>
            <ThemedText type="title" style={styles.modalTitle}>
              Karmienie
            </ThemedText>
            <ThemedText type="subtitle" style={styles.modalText}>
              Czy nakarmiłeś pająka?
            </ThemedText>
            <ThemedText style={styles.modalText}>
              {showInput
                ? "Jeśli nakarmiłeś w innym terminie, wpisz datę i kliknij 'Zatwierdź'"
                : "Kliknij 'Zatwierdź', aby potwierdzić karmienie dzisiaj"}
            </ThemedText>
            {showInput && (
              <TextInput
                style={styles.input}
                placeholder="Wpisz datę karmienia (dd-mm-rrrr)"
                value={date}
                onChangeText={setDate}
              />
            )}
          </>
        );
      case "molting":
        return (
          <>
            <ThemedText style={styles.modalTitle}>Linienie</ThemedText>
            <ThemedText style={styles.modalText}>
              Czy pająk przeszedł linienie?
            </ThemedText>
            <ThemedText style={styles.modalText}>
              {showInput
                ? "Jeśli w innym dniu, wprowadź datę i kliknij 'Zatwierdź'"
                : "Kliknij 'Zatwierdź', aby potwierdzić linienie dzisiaj"}
            </ThemedText>
            {showInput && (
              <TextInput
                style={styles.input}
                placeholder="Wpisz datę linienia (dd-mm-rrrr)"
                value={date}
                onChangeText={setDate}
              />
            )}
          </>
        );
      default:
        return <Text style={styles.modalText}>Nieznany typ: {type}</Text>;
    }
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.centeredView}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={styles.modalView}>
            {renderContent()}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.button, styles.cancelButton]}
              >
                <ThemedText style={styles.buttonText}>Anuluj</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.button, styles.confirmButton]}
              >
                <ThemedText style={styles.buttonText}>Zatwierdź</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
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
    backgroundColor: "white",
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
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
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ModalInfo;
