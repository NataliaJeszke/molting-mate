import React, { useState } from 'react';
import { View, Image, Modal, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';

interface Document {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
}

interface Props {
  document: Document;
}

const DocumentViewer: React.FC<Props> = ({ document }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpen = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      {document.type === 'image' ? (
        <TouchableOpacity onPress={handleOpen}>
          <Image source={{ uri: document.url }} style={styles.thumbnail} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleOpen} style={styles.iconBox}>
          <Feather name="file-text" size={48} color="#444" />
          <Text style={styles.iconLabel}>PDF</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Zamknij ✕</Text>
          </TouchableOpacity>

          {document.type === 'image' ? (
            <Image source={{ uri: document.url }} style={styles.fullImage} resizeMode="contain" />
          ) : (
            <Pdf
              source={{ uri: document.url, cache: true }}
              style={styles.pdf}
              onError={(error) => console.log('PDF error:', error)}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 16,
  },
  closeText: {
    fontSize: 16,
    color: '#007AFF',
  },
  fullImage: {
    width: '100%',
    height: '90%',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

export default DocumentViewer;