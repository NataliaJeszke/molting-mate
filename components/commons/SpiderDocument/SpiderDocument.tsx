import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";

interface SpiderDocumentProps {
  documentUris: { document_uri: string }[];
  isImageDocument: (uri: string) => boolean;
  onChooseDocument: () => void;
  onRemoveDocument: (index: number) => void;
  currentTheme: ThemeType;
  styles: any;
  showDocumentModal: boolean;
  setShowDocumentModal: (value: boolean) => void;
}

const SpiderDocument = ({
  documentUris,
  isImageDocument,
  onChooseDocument,
  onRemoveDocument,
  currentTheme,
  styles,
  showDocumentModal,
  setShowDocumentModal,
}: SpiderDocumentProps) => {
  const [selectedDocumentUri, setSelectedDocumentUri] = useState<string | null>(
    null,
  );

  const openPreview = (uri: string) => {
    setSelectedDocumentUri(uri);
    setShowDocumentModal(true);
  };

  const renderContent = () => {
    if (documentUris.length === 0) {
      return (
        <View style={styles(currentTheme).documentCard__noDocument}>
          <Feather
            name="file-plus"
            size={48}
            color={Colors[currentTheme].text}
          />
          <ThemedText style={styles(currentTheme).documentCard__noDocumentText}>
            Brak dokumentu. Kliknij plus, aby dodać.
          </ThemedText>
        </View>
      );
    }

    return documentUris.map((doc, index) => {
      const uri = doc.document_uri;

      return (
        <View
          key={index}
          style={styles(currentTheme).documentCard__previewContainer}
        >
          {isImageDocument(uri) ? (
            <Image
              source={{ uri }}
              style={styles(currentTheme).documentCard__preview}
            />
          ) : (
            <View style={styles(currentTheme).documentCard__noDocument}>
              <Feather
                name="file"
                size={48}
                color={Colors[currentTheme].text}
              />
              <ThemedText
                style={styles(currentTheme).documentCard__noDocumentText}
              >
                Obsługiwane są tylko obrazy jako dokumenty.
              </ThemedText>
            </View>
          )}

          <View style={styles(currentTheme).documentCard__buttonContainer}>
            <TouchableOpacity
              onPress={() => openPreview(uri)}
              style={styles(currentTheme).documentCard__viewButton}
            >
              <Feather name="eye" size={16} color={Colors[currentTheme].text} />
              <ThemedText style={styles(currentTheme).documentCard__buttonText}>
                Podgląd
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onRemoveDocument(index)}
              style={styles(currentTheme).documentCard__removeButton}
            >
              <Feather
                name="trash-2"
                size={16}
                color={Colors[currentTheme].info.text}
              />
              <ThemedText
                style={styles(currentTheme).documentCard__removeButtonText}
              >
                Usuń
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  return (
    <>
      <CardComponent customStyle={styles(currentTheme).documentCard}>
        <View style={styles(currentTheme).documentCard}>
          <View style={styles(currentTheme).documentCard__header}>
            <View style={styles(currentTheme).documentCard__headerContent}>
              <Feather
                name="file"
                size={20}
                style={styles(currentTheme).documentCard__icon}
              />
              <ThemedText style={styles(currentTheme).documentCard__title}>
                Dokumentacja
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={onChooseDocument}
              style={styles(currentTheme).documentCard__addButton}
            >
              <Feather
                name="plus"
                size={20}
                style={styles(currentTheme).documentCard__icon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles(currentTheme).documentCard__content}>
            {renderContent()}
          </View>
        </View>
      </CardComponent>

      <Modal
        visible={showDocumentModal}
        animationType="slide"
        onRequestClose={() => setShowDocumentModal(false)}
      >
        <SafeAreaView style={styles(currentTheme).modal}>
          <View style={styles(currentTheme).modal__header}>
            <TouchableOpacity onPress={() => setShowDocumentModal(false)}>
              <Feather
                name="x"
                size={28}
                style={styles(currentTheme).modal__icon}
              />
            </TouchableOpacity>
          </View>

          {selectedDocumentUri && isImageDocument(selectedDocumentUri) && (
            <Image
              source={{ uri: selectedDocumentUri }}
              style={styles(currentTheme)["modal__fullscreen-image"]}
              resizeMode="contain"
            />
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default SpiderDocument;
