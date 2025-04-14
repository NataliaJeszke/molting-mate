import React, { useState, useEffect } from "react";
import { Modal, View, TouchableOpacity, Text, TextInput, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

interface ModalInfoProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (date: string, type: string) => void;
}

const ModalInfo: React.FC<ModalInfoProps> = ({ isVisible, onClose, onSubmit }) => {
  const { id, type } = useLocalSearchParams();
  const [date, setDate] = useState("");

  useEffect(() => {
    console.log("ModalInfo opened");
    console.log("id:", id);
    console.log("type:", type);
  }, [id, type]);

  const handleOkClick = () => {
    if (date) {
      onSubmit(date, type as string);
    }
    onClose();
  };

  const renderContent = () => {
    switch (type) {
      case "feeding":
        return (
          <>
            <Text style={styles.modalTitle}>Karmienie</Text>
            <Text style={styles.modalText}>Czy nakarmiłeś pająka dzisiaj?</Text>
            <TextInput
              style={styles.input}
              placeholder="Wpisz datę karmienia (dd-mm-rrrr)"
              value={date}
              onChangeText={setDate}
            />
          </>
        );
      case "molting":
        return (
          <>
            <Text style={styles.modalTitle}>Linienie</Text>
            <Text style={styles.modalText}>Czy pająk przepoczwarzył się?</Text>
            <TextInput
              style={styles.input}
              placeholder="Wpisz datę linienia (dd-mm-rrrr)"
              value={date}
              onChangeText={setDate}
            />
          </>
        );
      default:
        return (
          <Text style={styles.modalText}>Nieznany typ: {type}</Text>
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
              <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOkClick} style={[styles.button, styles.confirmButton]}>
                <Text style={styles.buttonText}>Zatwierdź</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: windowWidth * 0.8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ModalInfo;