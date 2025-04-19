import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSpidersStore } from "@/store/spidersStore";
import { ensureLatestDate, sortDateStrings } from "@/utils/dateUtils";
import { ThemedText } from "@/components/ui/ThemedText";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";

type ModalUpdateProps = {
  isVisible: boolean;
  onClose: () => void;
};

const ModalUpdate = ({ isVisible, onClose }: ModalUpdateProps) => {
  const { id, type } = useLocalSearchParams();
  const updateSpider = useSpidersStore((state) => state.updateSpider);
  const spiders = useSpidersStore((state) => state.spiders);
  const [date, setDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    console.log("ModalInfo opened");
    console.log("id:", id);
    console.log("type:", type);
  }, [id, type]);

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = () => {
    let finalDate = date.trim() || getTodayDate();

    if (finalDate && id && type) {
      const currentSpider = spiders.find((spider) => spider.id === id);

      if (currentSpider) {
        if (type === "feeding") {
          const currentFeedingHistory = currentSpider.feedingHistoryData || [];

          let newFeedingHistory = [...currentFeedingHistory];
          if (!currentFeedingHistory.includes(finalDate)) {
            newFeedingHistory = [...currentFeedingHistory, finalDate];
          }

          const sortedFeedingHistory = sortDateStrings(newFeedingHistory);

          const latestFeedingDate = ensureLatestDate(
            finalDate,
            sortedFeedingHistory,
          );

          updateSpider(id as string, {
            lastFed: latestFeedingDate,
            feedingHistoryData: sortedFeedingHistory,
          });
        } else if (type === "molting") {
          const currentMoltingHistory = currentSpider.moltingHistoryData || [];

          let newMoltingHistory = [...currentMoltingHistory];
          if (!currentMoltingHistory.includes(finalDate)) {
            newMoltingHistory = [...currentMoltingHistory, finalDate];
          }

          const sortedMoltingHistory = sortDateStrings(newMoltingHistory);

          const latestMoltingDate = ensureLatestDate(
            finalDate,
            sortedMoltingHistory,
          );

          updateSpider(id as string, {
            lastMolt: latestMoltingDate,
            moltingHistoryData: sortedMoltingHistory,
          });
        }
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
            <ThemedText type="title" style={styles.modalTitle}>
              Karmienie
            </ThemedText>
            <ThemedText type="subtitle" style={styles.modalText}>
              Czy nakarmiłeś pająka?
            </ThemedText>

            <View style={styles.dateContainer}>
              <ThemedText style={styles.dateLabel}>
                Wybierz datę karmienia:
              </ThemedText>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={handleOpenDatePicker}
              >
                <ThemedText style={styles.dateText}>{displayDate}</ThemedText>
              </TouchableOpacity>
            </View>
          </>
        );
      case "molting":
        return (
          <>
            <ThemedText style={styles.modalTitle}>Linienie</ThemedText>
            <ThemedText style={styles.modalText}>
              Czy pająk przeszedł linienie?
            </ThemedText>

            <View style={styles.dateContainer}>
              <ThemedText style={styles.dateLabel}>
                Wybierz datę linienia:
              </ThemedText>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={handleOpenDatePicker}
              >
                <ThemedText style={styles.dateText}>{displayDate}</ThemedText>
              </TouchableOpacity>
            </View>
          </>
        );
      default:
        return (
          <ThemedText style={styles.modalText}>Nieznany typ: {type}</ThemedText>
        );
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
  dateContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateLabel: {
    fontSize: 14,
  },
  dateButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateText: {
    fontSize: 14,
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

export default ModalUpdate;
