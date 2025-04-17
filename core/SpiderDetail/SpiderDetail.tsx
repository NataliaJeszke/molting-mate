import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useUserStore } from "@/store/userStore";
import { Spider } from "@/models/Spider.model";
import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import { getNextFeedingDate, getFeedingStatus } from "@/utils/feedingUtils";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import CardComponent from "@/components/ui/CardComponent";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import HistoryInformation from "@/components/commons/HistoryInformation/HistoryInformation";
import WebView from "react-native-webview";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useSpidersStore } from "@/store/spidersStore";

interface Props {
  spider: Spider;
  onUpdateSpider?: (updatedSpider: Spider) => void;
}

export default function SpiderDetails({ spider, onUpdateSpider }: Props) {
  const { currentTheme } = useUserStore();
  const [showFeedingHistory, setShowFeedingHistory] = useState(false);
  const [showMoltingHistory, setShowMoltingHistory] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [documentUri, setDocumentUri] = useState<string>();

  const nextFeedingDate = getNextFeedingDate(
    spider.lastFed,
    spider.feedingFrequency
  );

  const feedingStatus = getFeedingStatus(
    spider.lastFed,
    spider.feedingFrequency
  );

  const getFeedingStatusLabel = (status: FeedingStatus | null) => {
    switch (status) {
      case FeedingStatus.HUNGRY:
        return "Tak";
      case FeedingStatus.FEED_TODAY:
        return "Tak (karmienie dzisiaj)";
      case FeedingStatus.NOT_HUNGRY:
        return "Nie";
      default:
        return "Brak danych";
    }
  };

  const getFeedingStatusColor = (status: FeedingStatus | null) => {
    switch (status) {
      case FeedingStatus.HUNGRY:
        return Colors[currentTheme].feedingStatus.hungry;
      case FeedingStatus.FEED_TODAY:
        return Colors[currentTheme].feedingStatus.feedToday;
      case FeedingStatus.NOT_HUNGRY:
        return Colors[currentTheme].feedingStatus.notHungry;
      default:
        return Colors[currentTheme].text;
    }
  };

  const isImageDocument = (uri: string | undefined) => {
    if (!uri) return false;
    const lowerCaseUri = uri.toLowerCase();
    return (
      lowerCaseUri.endsWith(".jpg") ||
      lowerCaseUri.endsWith(".jpeg") ||
      lowerCaseUri.endsWith(".png") ||
      lowerCaseUri.endsWith(".heic") ||
      lowerCaseUri.includes("image")
    );
  };


  const handleChooseDocument = () => {
    Alert.alert("Wybierz źródło", "Dołącz dokument pochodzenia", [
      {
        text: "Zrób zdjęcie",
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (permission.status !== "granted") {
            Alert.alert("Brak uprawnień", "Nie masz dostępu do kamery.");
            return;
          }
  
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled) {
            setDocumentUri(result.assets[0].uri);
            useSpidersStore.getState().updateSpider(spider.id, { documentUri: result.assets[0].uri });
          }
        },
      },
      {
        text: "Wybierz z galerii",
        onPress: async () => {
          const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permission.status !== "granted") {
            Alert.alert("Brak uprawnień", "Nie masz dostępu do galerii.");
            return;
          }
  
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled) {
            setDocumentUri(result.assets[0].uri);
            useSpidersStore.getState().updateSpider(spider.id, { documentUri: result.assets[0].uri });
          }
        },
      },
      {
        text: "Wybierz dokument",
        onPress: async () => {
          try {
            const result = await DocumentPicker.getDocumentAsync({
              type: ["application/pdf", "image/*"],
              copyToCacheDirectory: true,
              multiple: false,
            });
  
            if (result.assets && result.assets.length > 0) {
              const picked = result.assets[0];
              setDocumentUri(picked.uri);
              useSpidersStore.getState().updateSpider(spider.id, { documentUri: picked.uri });
            }
          } catch (err) {
            Alert.alert("Błąd", "Nie udało się załadować dokumentu.");
          }
        },
      },
      {
        text: "Anuluj",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles(currentTheme).container}>
      <CardComponent customStyle={styles(currentTheme).spiderCard}>
        <View style={styles(currentTheme)["spiderCard__header"]}>
          <Image
            source={
              spider.imageUri
                ? { uri: spider.imageUri }
                : require("@/assets/images/spider.png")
            }
            style={styles(currentTheme)["spiderCard__image"]}
          />
          <ThemedText style={styles(currentTheme)["spiderCard__name"]}>
            {spider.name}
          </ThemedText>
        </View>

        <View style={styles(currentTheme)["spiderCard__infoContainer"]}>
          <View style={styles(currentTheme)["spiderCard__infoRow"]}>
            <View style={styles(currentTheme)["spiderCard__label"]}>
              <Feather
                name="calendar"
                size={18}
                color={Colors[currentTheme].text}
              />
              <ThemedText style={styles(currentTheme)["spiderCard__labelText"]}>
                Ostatnie karmienie:
              </ThemedText>
            </View>
            <ThemedText style={styles(currentTheme)["spiderCard__value"]}>
              {spider.lastFed}
            </ThemedText>
          </View>

          <View style={styles(currentTheme)["spiderCard__infoRow"]}>
            <View style={styles(currentTheme)["spiderCard__label"]}>
              <Feather
                name="clock"
                size={18}
                color={Colors[currentTheme].text}
              />
              <ThemedText style={styles(currentTheme)["spiderCard__labelText"]}>
                Następne karmienie:
              </ThemedText>
            </View>
            <ThemedText style={styles(currentTheme)["spiderCard__value"]}>
              {nextFeedingDate}
            </ThemedText>
          </View>

          <View style={styles(currentTheme)["spiderCard__infoRow"]}>
            <View style={styles(currentTheme)["spiderCard__label"]}>
              <Feather
                name="coffee"
                size={18}
                color={Colors[currentTheme].text}
              />
              <ThemedText style={styles(currentTheme)["spiderCard__labelText"]}>
                Głodny?
              </ThemedText>
            </View>
            <View
              style={[
                styles(currentTheme)["spiderCard__statusBadge"],
                { backgroundColor: getFeedingStatusColor(feedingStatus) },
              ]}
            >
              <ThemedText
                style={styles(currentTheme)["spiderCard__statusText"]}
              >
                {getFeedingStatusLabel(feedingStatus)}
              </ThemedText>
            </View>
          </View>

          <View style={styles(currentTheme)["spiderCard__infoRow--last"]}>
            <View style={styles(currentTheme)["spiderCard__label"]}>
              <Feather
                name="repeat"
                size={18}
                color={Colors[currentTheme].text}
              />
              <ThemedText style={styles(currentTheme)["spiderCard__labelText"]}>
                Ostatnie linienie:
              </ThemedText>
            </View>
            <ThemedText style={styles(currentTheme)["spiderCard__value"]}>
              {spider.lastMolt}
            </ThemedText>
          </View>
        </View>
      </CardComponent>

      <HistoryInformation
        title="Historia karmienia"
        iconName="list"
        data={spider.feedingHistoryData}
        isExpanded={showFeedingHistory}
        toggleExpanded={() => setShowFeedingHistory(!showFeedingHistory)}
        currentTheme={currentTheme}
        styles={styles}
        emptyText="Brak historii karmienia"
        typeKey="feeding"
      />

      <HistoryInformation
        title="Historia linienia"
        iconName="repeat"
        data={spider.moltingHistoryData}
        isExpanded={showMoltingHistory}
        toggleExpanded={() => setShowMoltingHistory(!showMoltingHistory)}
        currentTheme={currentTheme}
        styles={styles}
        emptyText="Brak historii linienia"
        typeKey="molting"
      />

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
              onPress={handleChooseDocument}
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
            {isLoading ? (
              <View style={styles(currentTheme).loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={Colors[currentTheme].text}
                />
                <ThemedText>Ładowanie dokumentu...</ThemedText>
              </View>
            ) : documentError ? (
              <View style={styles(currentTheme).errorContainer}>
                <Feather
                  name="alert-circle"
                  size={24}
                  color={Colors[currentTheme].warning.text}
                />
                <ThemedText
                  style={{ color: Colors[currentTheme].warning.text }}
                >
                  {documentError}
                </ThemedText>
              </View>
            ) : spider.documentUri ? (
              <TouchableOpacity
                onPress={() => setShowDocumentModal(true)}
                style={styles(currentTheme).documentPreviewContainer}
              >
                {isImageDocument(spider.documentUri) ? (
                  <Image
                    source={{ uri: spider.documentUri }}
                    style={styles(currentTheme).documentPreview}
                  />
                ) : (
                  <View style={styles(currentTheme).pdfPreviewContainer}>
                    <Image
                      source={require("@/assets/images/pdf.png")}
                      style={styles(currentTheme).pdfIcon}
                    />
                    <ThemedText style={styles(currentTheme).pdfText}>
                      Dokument PDF
                    </ThemedText>
                  </View>
                )}
                <View style={styles(currentTheme).viewDocumentButton}>
                  <Feather name="eye" size={16} color="#fff" />
                  <ThemedText style={styles(currentTheme).viewDocumentText}>
                    Zobacz
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles(currentTheme).noDocumentContainer}>
                <Feather
                  name="file-plus"
                  size={48}
                  color={Colors[currentTheme].text}
                />
                <ThemedText style={styles(currentTheme).noDocumentText}>
                  Brak dokumentacji. Kliknij plus, aby dodać dokument.
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </CardComponent>

      <Modal
        visible={showDocumentModal}
        animationType="slide"
        onRequestClose={() => setShowDocumentModal(false)}
      >
        <View style={styles(currentTheme).modalContainer}>
          <View style={styles(currentTheme).modalHeader}>
            <ThemedText style={styles(currentTheme).modalTitle}>
              {isImageDocument(spider.documentUri) ? "Zdjęcie" : "Dokument PDF"}
            </ThemedText>
            <TouchableOpacity onPress={() => setShowDocumentModal(false)}>
              <Feather name="x" size={24} color={Colors[currentTheme].text} />
            </TouchableOpacity>
          </View>

          {spider.documentUri &&
            (isImageDocument(spider.documentUri) ? (
              <Image
                source={{ uri: spider.documentUri }}
                style={styles(currentTheme).fullScreenImage}
                resizeMode="contain"
              />
            ) : (
              <WebView
                source={{ uri: spider.documentUri }}
                style={styles(currentTheme).webView}
                startInLoadingState
                renderLoading={() => (
                  <View style={styles(currentTheme).webViewLoader}>
                    <ActivityIndicator
                      size="large"
                      color={Colors[currentTheme].text}
                    />
                  </View>
                )}
                onError={() =>
                  setDocumentError("Nie udało się załadować dokumentu")
                }
              />
            ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    spiderCard: {
      padding: 0,
      overflow: "hidden",
      borderRadius: 16,
    },
    spiderCard__header: {
      alignItems: "center",
      padding: 20,
      backgroundColor: Colors[theme].card.backgroundColor,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    spiderCard__image: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: Colors[theme].spiderImage.backgroundColor,
      borderWidth: 4,
      borderColor: Colors[theme].card.borderColor,
      marginBottom: 12,
    },
    spiderCard__name: {
      fontSize: 24,
      fontWeight: "bold",
    },
    spiderCard__infoContainer: {
      padding: 16,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    spiderCard__infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].card.borderColor,
    },
    "spiderCard__infoRow--last": {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    spiderCard__label: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    spiderCard__labelText: {
      marginLeft: 8,
      fontSize: 15,
      color: Colors[theme].text,
    },
    spiderCard__value: {
      fontSize: 15,
      fontWeight: "500",
      flex: 1,
      textAlign: "right",
    },
    spiderCard__statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    spiderCard__statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors[theme].text,
    },

    // Nowe style dla dokumentów
    historyCard: {
      padding: 0,
      overflow: "hidden",
      borderRadius: 16,
    },
    historyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    historyHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    historyIcon: {
      marginRight: 8,
    },
    historyTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    historyContent: {
      backgroundColor: Colors[theme].card.backgroundColor,
      paddingHorizontal: 16,
    },
    historyItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].card.borderColor,
    },
    historyItemLast: {
      borderBottomWidth: 0,
    },
    historyItemIcon: {
      marginRight: 12,
    },
    historyItemText: {
      fontSize: 15,
    },
    emptyHistory: {
      padding: 16,
      alignItems: "center",
    },
    emptyHistoryText: {
      color: Colors[theme].text,
      fontStyle: "italic",
    },

    // Dokument Card
    documentCard: {
      backgroundColor: Colors[theme].card.backgroundColor,
      borderRadius: 16,
    },
    documentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].card.borderColor,
    },
    documentHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    documentIcon: {
      marginRight: 8,
    },
    documentTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    addDocumentButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    documentContent: {
      padding: 16,
      minHeight: 160,
      justifyContent: "center",
      alignItems: "center",
    },
    documentPreviewContainer: {
      alignItems: "center",
      position: "relative",
    },
    documentPreview: {
      width: 200,
      height: 200,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[theme].card.borderColor,
      resizeMode: "cover",
    },
    pdfPreviewContainer: {
      width: 200,
      height: 200,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[theme].card.borderColor,
      backgroundColor: "#f5f5f5",
      justifyContent: "center",
      alignItems: "center",
    },
    pdfIcon: {
      width: 80,
      height: 80,
      resizeMode: "contain",
    },
    pdfText: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: "500",
    },
    viewDocumentButton: {
      position: "absolute",
      bottom: 12,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors[theme].card.backgroundColor,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    viewDocumentText: {
      marginLeft: 6,
      color: "#fff",
      fontWeight: "600",
    },
    noDocumentContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    noDocumentText: {
      marginTop: 12,
      textAlign: "center",
      color: Colors[theme].text,
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    errorContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },

    // Modal Styles
    modalContainer: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].card.borderColor,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    fullScreenImage: {
      flex: 1,
      width: "100%",
      backgroundColor: "#000",
    },
    webView: {
      flex: 1,
    },
    webViewLoader: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
  });
