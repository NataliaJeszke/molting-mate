import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CardComponent from "@/components/ui/CardComponent";
import { Colors } from "react-native/Libraries/NewAppScreen";
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
        <View style={styles(currentTheme).noDocumentContainer}>
          <Feather
            name="file-plus"
            size={48}
            color={Colors[currentTheme].text}
          />
          <ThemedText style={styles(currentTheme).noDocumentText}>
            Brak dokumentu. Kliknij plus, aby dodać.
          </ThemedText>
        </View>
      );
    }

    return isImageDocument ? (
      <TouchableOpacity
        onPress={() => setShowDocumentModal(true)}
        style={styles(currentTheme).documentPreviewContainer}
      >
        <Image
          source={{ uri: documentUri }}
          style={styles(currentTheme).documentPreview}
        />
        <View style={styles(currentTheme).viewDocumentButton}>
          <Feather name="eye" size={16} color="#fff" />
          <ThemedText style={styles(currentTheme).viewDocumentText}>
            Zobacz
          </ThemedText>
        </View>
      </TouchableOpacity>
    ) : (
      <View style={styles(currentTheme).noDocumentContainer}>
        <Feather name="file" size={48} color={Colors[currentTheme].text} />
        <ThemedText style={styles(currentTheme).noDocumentText}>
          Obsługiwane są tylko obrazy jako dokumenty.
        </ThemedText>
      </View>
    );
  };

  return (
    <>
      <CardComponent customStyle={styles(currentTheme).historyCard}>
        <View style={styles(currentTheme).documentCard}>
          <View style={styles(currentTheme).documentHeader}>
            <View style={styles(currentTheme).documentHeaderContent}>
              <Feather
                name="file"
                size={20}
                color={Colors[currentTheme].text}
                style={styles(currentTheme).documentIcon}
              />
              <ThemedText style={styles(currentTheme).documentTitle}>
                Dokumentacja
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={onChooseDocument}
              style={styles(currentTheme).addDocumentButton}
            >
              <Feather
                name="plus"
                size={20}
                color={Colors[currentTheme].text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles(currentTheme).documentContent}>
            {renderContent()}
          </View>
        </View>
      </CardComponent>

      <Modal
        visible={showDocumentModal}
        animationType="slide"
        onRequestClose={() => setShowDocumentModal(false)}
      >
        <SafeAreaView style={styles(currentTheme).modalContainer}>
          <View style={styles(currentTheme).modalHeader}>
            <TouchableOpacity onPress={() => setShowDocumentModal(false)}>
              <Feather name="x" size={28} color={Colors[currentTheme].text} />
            </TouchableOpacity>
          </View>

          {documentUri && isImageDocument && (
            <Image
              source={{ uri: documentUri }}
              style={styles(currentTheme).fullScreenImage}
              resizeMode="contain"
            />
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default SpiderDocument;
