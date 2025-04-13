import React, { useState } from "react";
import { Modal, TextInput, View, TouchableOpacity, Text } from "react-native";

interface FeedingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (date: string) => void;
}

const ModalInfo: React.FC<FeedingModalProps> = ({ isVisible, onClose, onSubmit }) => {
  const [newFeedingDate, setNewFeedingDate] = useState("");

  const handleOkClick = () => {
    if (newFeedingDate) {
      onSubmit(newFeedingDate);
    }
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View>
        <View>
          <Text style={modalStyles.modalText}>Czy nakarmiłeś pająka dzisiaj?</Text>

          <TextInput
            style={modalStyles.input}
            placeholder="Wpisz datę (dd-mm-rrrr)"
            value={newFeedingDate}
            onChangeText={setNewFeedingDate}
          />

          <TouchableOpacity onPress={handleOkClick} style={modalStyles.button}>
            <Text>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = {
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    width: undefined,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
};

export default ModalInfo;
