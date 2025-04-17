import { useState } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";
import { Spider } from "@/models/Spider.model";
import { Colors, ThemeType } from "@/constants/Colors";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { getNextFeedingDate, getFeedingStatus } from "@/utils/feedingUtils";

import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import HistoryInformation from "@/components/commons/HistoryInformation/HistoryInformation";
import SpiderDocument from "@/components/commons/SpiderDocument/SpiderDocument";

interface Props {
  spider: Spider;
  onUpdateSpider?: (updatedSpider: Spider) => void;
}

const SpiderDetails = ({ spider, onUpdateSpider }: Props) => {
    const { currentTheme } = useUserStore();
    const [showFeedingHistory, setShowFeedingHistory] = useState(false);
    const [showMoltingHistory, setShowMoltingHistory] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [documentUri, setDocumentUri] = useState<string>();
  
    const nextFeedingDate = getNextFeedingDate(spider.lastFed, spider.feedingFrequency);
    const feedingStatus = getFeedingStatus(spider.lastFed, spider.feedingFrequency);
  
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
      const lower = uri.toLowerCase();
      return (
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png") ||
        lower.endsWith(".heic") ||
        lower.includes("image")
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
              const uri = result.assets[0].uri;
              setDocumentUri(uri);
              useSpidersStore.getState().updateSpider(spider.id, { documentUri: uri });
            }
          },
        },
        {
          text: "Wybierz z galerii",
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
              const uri = result.assets[0].uri;
              setDocumentUri(uri);
              useSpidersStore.getState().updateSpider(spider.id, { documentUri: uri });
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
    <View style={styles(currentTheme).spiderDetails}>
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

      <SpiderDocument
        documentUri={spider.documentUri}
        isImageDocument={isImageDocument(spider.documentUri)}
        onChooseDocument={handleChooseDocument}
        currentTheme={currentTheme}
        styles={styles}
        showDocumentModal={showDocumentModal}
        setShowDocumentModal={setShowDocumentModal}
      />
    </View>
  );
}
/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    // Block: spiderDetails
    spiderDetails: {
      gap: 16,
    },

    // Block: spiderCard
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

    // Block: historyCard
    historyCard: {
      padding: 0,
      overflow: "hidden",
      borderRadius: 16,
    },
    historyCard__header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    historyCard__headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    historyCard__icon: {
      marginRight: 8,
    },
    historyCard__title: {
      fontSize: 18,
      fontWeight: "600",
    },
    historyCard__content: {
      backgroundColor: Colors[theme].card.backgroundColor,
      paddingHorizontal: 16,
    },
    historyCard__item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].card.borderColor,
    },
    "historyCard__item--last": {
      borderBottomWidth: 0,
    },
    historyCard__itemIcon: {
      marginRight: 12,
    },
    historyCard__itemText: {
      fontSize: 15,
    },
    historyCard__empty: {
      padding: 16,
      alignItems: "center",
    },
    historyCard__emptyText: {
      color: Colors[theme].text,
      fontStyle: "italic",
    },

    // Block: documentCard
    documentCard: {
      backgroundColor: Colors[theme].card.backgroundColor,
      borderRadius: 16,
      padding: 0,
      overflow: "hidden",
    },
    documentCard__header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].card.borderColor,
    },
    documentCard__headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    documentCard__icon: {
      marginRight: 8,
      color: Colors[theme].text,
    },
    documentCard__title: {
      fontSize: 18,
      fontWeight: "600",
    },
    documentCard__addButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    documentCard__content: {
      padding: 16,
      minHeight: 160,
      justifyContent: "center",
      alignItems: "center",
    },
    documentCard__previewContainer: {
      alignItems: "center",
      position: "relative",
    },
    documentCard__preview: {
      width: 200,
      height: 200,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[theme].card.borderColor,
      resizeMode: "cover",
    },
    documentCard__viewButton: {
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
      color: Colors[theme].text,
    },
    documentCard__noDocument: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    documentCard__noDocumentText: {
      marginTop: 12,
      textAlign: "center",
      color: Colors[theme].text,
    },

    // Block: modal
    modal: {
      flex: 1,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    modal__header: {
      width: "100%",
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: "flex-end",
      backgroundColor: Colors[theme].card.backgroundColor,
      zIndex: 1,
    },
    modal__icon: {
      marginRight: 8,
      color: Colors[theme].text,
    },
    "modal__fullscreen-image": {
      flex: 1,
      width: "100%",
      backgroundColor: "#000",
    },
  });


export default SpiderDetails;