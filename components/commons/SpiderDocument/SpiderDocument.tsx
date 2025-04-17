import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Feather } from "@expo/vector-icons";

import CardComponent from "@/components/ui/CardComponent";
import { ThemedText } from "@/components/ui/ThemedText";

interface SpiderDocumentProps {
  documentUri: string | undefined;
  isImageDocument: boolean;
  onChooseDocument: () => void;
  currentTheme: "light" | "dark";
  styles: any;
  showDocumentModal: boolean;
  setShowDocumentModal: (value: boolean) => void;
}

const SpiderDocument = ({
  documentUri,
  isImageDocument,
  onChooseDocument,
  currentTheme,
  styles,
  showDocumentModal,
  setShowDocumentModal,
}: SpiderDocumentProps) => {
  const renderContent = () => {
    if (!documentUri) {
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

    return isImageDocument ? (
      <TouchableOpacity
        onPress={() => setShowDocumentModal(true)}
        style={styles(currentTheme).documentCard__previewContainer}
      >
        <Image
          source={{ uri: documentUri }}
          style={styles(currentTheme).documentCard__preview}
        />

        <Feather
          name="eye"
          size={16}
          style={styles(currentTheme).documentCard__viewButton}
        />
      </TouchableOpacity>
    ) : (
      <View style={styles(currentTheme).documentCard__noDocument}>
        <Feather name="file" size={48} color={Colors[currentTheme].text} />
        <ThemedText style={styles(currentTheme).documentCard__noDocumentText}>
          Obsługiwane są tylko obrazy jako dokumenty.
        </ThemedText>
      </View>
    );
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
              <ThemedText style={styles(currentTheme).documentTitle}>
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

          {documentUri && isImageDocument && (
            <Image
              source={{ uri: documentUri }}
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
