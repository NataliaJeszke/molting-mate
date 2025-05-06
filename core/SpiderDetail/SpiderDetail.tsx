import { useEffect, useState } from "react";
import { View, Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";
import { Colors, ThemeType } from "@/constants/Colors";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { getNextFeedingDate, getFeedingStatus } from "@/utils/feedingUtils";

import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import HistoryInformation from "@/components/commons/HistoryInformation/HistoryInformation";
import SpiderDocument from "@/components/commons/SpiderDocument/SpiderDocument";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import { router } from "expo-router";

interface Props {
  spiderId: string | string[] | undefined;
}

const SpiderDetails = ({ spiderId }: Props) => {
  console.log("spiderId", spiderId);
  const { currentTheme } = useUserStore();
  const getSpiderById = useSpidersStore((state: any) => state.getSpiderById);
  const addDocumentToSpider = useSpidersStore(
    (state: any) => state.addDocumentToSpider,
  );
  const deleteDocument = useSpidersStore(
    (state: any) => state.deleteSpiderDocument,
  );
  const [showFeedingHistory, setShowFeedingHistory] = useState(false);
  const [showMoltingHistory, setShowMoltingHistory] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [feedingHistoryData, setFeedingHistoryData] = useState<any[] | null>(
    null,
  );
  const [moltingHistoryData, setMoltingHistoryData] = useState<any[] | null>(
    null,
  );
  const [documentsData, setDocumentsData] = useState<any[] | null>(null);
  const [spiderData, setSpiderData] = useState<any | null>(null);

  useEffect(() => {
    const fetchSpider = async () => {
      const data = await getSpiderById(spiderId);

      if (!data) return;

      const { feedingHistory, moltingHistory, documents, ...spider } = data;

      setSpiderData(spider);
      setFeedingHistoryData(feedingHistory);
      setMoltingHistoryData(moltingHistory);
      setDocumentsData(documents);
    };

    fetchSpider();
  }, [spiderId, getSpiderById]);

  const nextFeedingDate = spiderData
    ? getNextFeedingDate(spiderData.lastFed, spiderData.feedingFrequency)
    : null;

  const feedingStatus = spiderData
    ? getFeedingStatus(spiderData.lastFed, spiderData.feedingFrequency)
    : null;

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
        return Colors[currentTheme].feedingStatus.default;
    }
  };

  const getIndividualTypeIcon = (type: string | undefined) => {
    switch (type) {
      case "Samiec":
        return (
          <FontAwesome
            name="mars"
            size={18}
            color={Colors[currentTheme].text}
          />
        );
      case "Samica":
        return (
          <FontAwesome
            name="venus"
            size={18}
            color={Colors[currentTheme].text}
          />
        );
      default:
        return (
          <FontAwesome
            name="question"
            size={18}
            color={Colors[currentTheme].text}
          />
        );
    }
  };

  const getIndividualTypeLabel = (type: string | undefined) => {
    return type || "Niezidentyfikowany";
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
    const handleAddDocument = async (spiderId: string, uri: string) => {
      const success = await addDocumentToSpider(spiderId, uri);
      if (!success) return;

      const data = await getSpiderById(spiderId);
      if (!data) return;

      const { documents } = data;
      setDocumentsData(documents);
    };

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
            await handleAddDocument(spiderData.id, uri);
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
            const uri = result.assets[0].uri;
            await handleAddDocument(spiderData.id, uri);
          }
        },
      },
      {
        text: "Anuluj",
        style: "cancel",
      },
    ]);
  };

  const handleRemoveDocument = (docId: string) => {
    Alert.alert(
      "Usuń dokument",
      "Czy na pewno chcesz usunąć dokument pochodzenia?",
      [
        {
          text: "Anuluj",
          style: "cancel",
        },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            const { success } = await deleteDocument(docId);
            console.log("success", success);

            if (success) {
              const data = await getSpiderById(spiderData.id);
              if (!data) return;

              const { documents } = data;
              setDocumentsData(documents);
            } else {
              Alert.alert("Błąd", "Nie udało się usunąć dokumentu.");
            }
          },
        },
      ],
    );
  };
  return (
    <View style={styles(currentTheme).spiderDetails}>
      <CardComponent customStyle={styles(currentTheme).imageCard}>
        <View style={styles(currentTheme).imageCard__header}>
          <ThemedText style={styles(currentTheme).imageCard__title}>
            {spiderData?.spiderSpecies}
          </ThemedText>
        </View>
        <View style={styles(currentTheme).imageCard__content}>
          <Image
            source={
              spiderData?.imageUri
                ? { uri: spiderData?.imageUri }
                : require("@/assets/images/spider.png")
            }
            style={styles(currentTheme).imageCard__image}
          />
          <ThemedText style={styles(currentTheme).imageCard__name}>
            {spiderData?.name}
          </ThemedText>
        </View>
      </CardComponent>

      <CardComponent customStyle={styles(currentTheme).basicInfoCard}>
        <View style={styles(currentTheme).basicInfoCard__header}>
          <View style={styles(currentTheme).basicInfoCard__headerContent}>
            <Feather
              name="info"
              size={20}
              color={Colors[currentTheme].text}
              style={styles(currentTheme).basicInfoCard__icon}
            />
            <ThemedText style={styles(currentTheme).basicInfoCard__title}>
              Podstawowe informacje
            </ThemedText>
          </View>
        </View>

        <View style={styles(currentTheme).basicInfoCard__content}>
          <View style={styles(currentTheme).basicInfoCard__infoRow}>
            <View style={styles(currentTheme).basicInfoCard__label}>
              {getIndividualTypeIcon(spiderData?.individualType)}
              <ThemedText style={styles(currentTheme).basicInfoCard__labelText}>
                Płeć:
              </ThemedText>
            </View>
            <ThemedText style={styles(currentTheme).basicInfoCard__value}>
              {getIndividualTypeLabel(spiderData?.individualType)}
            </ThemedText>
          </View>
          <View style={styles(currentTheme).basicInfoCard__infoRow}>
            <View style={styles(currentTheme).basicInfoCard__label}>
              <FontAwesome
                name="lightbulb-o"
                size={20}
                color={Colors[currentTheme].text}
                style={styles(currentTheme).basicInfoCard__icon}
              />
              <ThemedText style={styles(currentTheme).basicInfoCard__labelText}>
                Wiek:
              </ThemedText>
            </View>
            <ThemedText style={styles(currentTheme).basicInfoCard__value}>
              L{spiderData?.age}
            </ThemedText>
          </View>
        </View>
      </CardComponent>

      {/* Feeding Information Card */}
      <CardComponent customStyle={styles(currentTheme).feedingCard}>
        <View style={styles(currentTheme).feedingCard__header}>
          <View style={styles(currentTheme).feedingCard__headerContent}>
            <Feather
              name="coffee"
              size={20}
              color={Colors[currentTheme].text}
              style={styles(currentTheme).feedingCard__icon}
            />
            <ThemedText style={styles(currentTheme).feedingCard__title}>
              Informacje o karmieniu
            </ThemedText>
          </View>
        </View>

        <View style={styles(currentTheme).feedingCard__content}>
          <View style={styles(currentTheme).feedingCard__infoRow}>
            <View style={styles(currentTheme).feedingCard__label}>
              <Feather
                name="calendar"
                size={18}
                color={Colors[currentTheme].text}
              />
              <ThemedText style={styles(currentTheme).feedingCard__labelText}>
                Ostatnie karmienie:
              </ThemedText>
            </View>
            <ThemedText style={styles(currentTheme).feedingCard__value}>
              {spiderData?.lastFed}
            </ThemedText>
          </View>

          <View style={styles(currentTheme).feedingCard__infoRow}>
            <View style={styles(currentTheme).feedingCard__label}>
              <Feather
                name="clock"
                size={18}
                color={Colors[currentTheme].text}
              />
              <ThemedText style={styles(currentTheme).feedingCard__labelText}>
                Następne karmienie:
              </ThemedText>
            </View>
            <ThemedText style={styles(currentTheme).feedingCard__value}>
              {nextFeedingDate}
            </ThemedText>
          </View>

          <View style={styles(currentTheme)["feedingCard__infoRow--last"]}>
            <View style={styles(currentTheme).feedingCard__label}>
              <Feather
                name="coffee"
                size={18}
                color={Colors[currentTheme].text}
              />
              <ThemedText style={styles(currentTheme).feedingCard__labelText}>
                Głodny?
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/manageModal",
                  params: {
                    id: spiderData?.id,
                    type: ViewTypes.VIEW_FEEDING,
                    action: "edit",
                  },
                });
              }}
            >
              <View
                style={[
                  styles(currentTheme).feedingCard__statusBadge,
                  { backgroundColor: getFeedingStatusColor(feedingStatus) },
                ]}
              >
                <ThemedText
                  style={styles(currentTheme).feedingCard__statusText}
                >
                  {getFeedingStatusLabel(feedingStatus)}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </CardComponent>

      {/* Molting Information Card */}
      <CardComponent customStyle={styles(currentTheme).moltingCard}>
        <View style={styles(currentTheme).moltingCard__header}>
          <View style={styles(currentTheme).moltingCard__headerContent}>
            <Feather
              name="repeat"
              size={20}
              color={Colors[currentTheme].text}
              style={styles(currentTheme).moltingCard__icon}
            />
            <ThemedText style={styles(currentTheme).moltingCard__title}>
              Informacje o linieniu
            </ThemedText>
          </View>
        </View>

        <View style={styles(currentTheme).moltingCard__content}>
          <View style={styles(currentTheme).moltingCard__infoRow}>
            <View style={styles(currentTheme).moltingCard__label}>
              <Feather
                name="repeat"
                size={18}
                color={Colors[currentTheme].text}
              />
              <ThemedText style={styles(currentTheme).moltingCard__labelText}>
                Ostatnie linienie:
              </ThemedText>
            </View>
            <ThemedText style={styles(currentTheme).moltingCard__value}>
              {spiderData?.lastMolt}
            </ThemedText>
          </View>
          <View style={styles(currentTheme).moltingCard__addButtonRow}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/manageModal",
                  params: {
                    id: spiderData?.id,
                    type: ViewTypes.VIEW_MOLTING,
                    action: "edit",
                  },
                });
              }}
            >
              <View style={styles(currentTheme).moltingCard__addBadge}>
                <ThemedText
                  style={styles(currentTheme).moltingCard__addBadgeText}
                >
                  Dodaj linienie
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </CardComponent>

      {/* Feeding History Card */}
      <HistoryInformation
        title="Historia karmienia"
        iconName="list"
        data={feedingHistoryData ? feedingHistoryData : []}
        isExpanded={showFeedingHistory}
        toggleExpanded={() => setShowFeedingHistory(!showFeedingHistory)}
        currentTheme={currentTheme}
        styles={styles}
        emptyText="Brak historii karmienia"
        typeKey="feeding"
      />

      {/* Molting History Card */}
      <HistoryInformation
        title="Historia linienia"
        iconName="repeat"
        data={moltingHistoryData ? moltingHistoryData : []}
        isExpanded={showMoltingHistory}
        toggleExpanded={() => setShowMoltingHistory(!showMoltingHistory)}
        currentTheme={currentTheme}
        styles={styles}
        emptyText="Brak historii linienia"
        typeKey="molting"
      />

      {/* Document Card */}
      <SpiderDocument
        documentUris={documentsData ? documentsData : []}
        isImageDocument={(uri) => isImageDocument(uri)}
        onChooseDocument={handleChooseDocument}
        onRemoveDocument={handleRemoveDocument}
        currentTheme={currentTheme}
        styles={styles}
        showDocumentModal={showDocumentModal}
        setShowDocumentModal={setShowDocumentModal}
      />
    </View>
  );
};

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    spiderDetails: {
      gap: 16,
    },

    imageCard: {
      padding: 0,
      overflow: "hidden",
      borderRadius: 16,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    imageCard__header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].spider_detail.borderColor,
    },
    imageCard__title: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
    },
    imageCard__content: {
      alignItems: "center",
      padding: 20,
    },
    imageCard__image: {
      width: 300,
      height: 220,
      backgroundColor: Colors[theme].spiderImage.backgroundColor,
      marginBottom: 12,
      borderRadius: 8,
    },
    imageCard__name: {
      fontSize: 24,
      fontWeight: "bold",
    },

    // Block: basicInfoCard - nowa karta z informacjami o płci
    basicInfoCard: {
      padding: 0,
      overflow: "hidden",
      borderRadius: 16,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    basicInfoCard__header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].spider_detail.borderColor,
    },
    basicInfoCard__headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    basicInfoCard__icon: {
      marginRight: 8,
    },
    basicInfoCard__title: {
      fontSize: 18,
      fontWeight: "600",
    },
    basicInfoCard__content: {
      padding: 16,
    },
    basicInfoCard__infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    basicInfoCard__label: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    basicInfoCard__labelText: {
      marginLeft: 8,
      fontSize: 15,
      color: Colors[theme].text,
    },
    basicInfoCard__value: {
      fontSize: 15,
      fontWeight: "500",
      flex: 1,
      textAlign: "right",
    },

    // Block: feedingCard - dedicated card for feeding info
    feedingCard: {
      padding: 0,
      overflow: "hidden",
      borderRadius: 16,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    feedingCard__header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].spider_detail.borderColor,
    },
    feedingCard__headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    feedingCard__icon: {
      marginRight: 8,
    },
    feedingCard__title: {
      fontSize: 18,
      fontWeight: "600",
    },
    feedingCard__content: {
      padding: 16,
    },
    feedingCard__infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].spider_detail.borderColor,
    },
    "feedingCard__infoRow--last": {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    feedingCard__label: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    feedingCard__labelText: {
      marginLeft: 8,
      fontSize: 15,
      color: Colors[theme].text,
    },
    feedingCard__value: {
      fontSize: 15,
      fontWeight: "500",
      flex: 1,
      textAlign: "right",
    },
    feedingCard__statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    feedingCard__statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors[theme].text,
    },

    // Block: moltingCard - dedicated card for molting info
    moltingCard: {
      padding: 0,
      overflow: "hidden",
      borderRadius: 16,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    moltingCard__header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].spider_detail.borderColor,
    },
    moltingCard__headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    moltingCard__icon: {
      marginRight: 8,
    },
    moltingCard__title: {
      fontSize: 18,
      fontWeight: "600",
    },
    moltingCard__content: {
      padding: 16,
    },
    moltingCard__infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    moltingCard__label: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    moltingCard__labelText: {
      marginLeft: 8,
      fontSize: 15,
      color: Colors[theme].text,
    },
    moltingCard__value: {
      fontSize: 15,
      fontWeight: "500",
      textAlign: "right",
    },
    moltingCard__addButtonRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 8,
    },
    moltingCard__addBadge: {
      backgroundColor: Colors[theme].spider_detail.borderColor,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    moltingCard__addBadgeText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "600",
    },

    // Block: historyCard - existing styles kept
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
      borderBottomColor: Colors[theme].spider_detail.borderColor,
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

    // Block: documentCard - existing styles kept
    documentCard: {
      backgroundColor: Colors[theme].card.backgroundColor,
      borderRadius: 16,
      padding: 0,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginVertical: 8,
    },
    documentCard__header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].spider_detail.borderColor,
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
      padding: 6,
      borderRadius: 8,
      backgroundColor: Colors[theme].background || "#007AFF",
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    documentCard__content: {
      padding: 16,
      minHeight: 160,
      justifyContent: "center",
      alignItems: "center",
    },
    documentCard__previewContainer: {
      alignItems: "center",
      width: "100%",
    },
    documentCard__preview: {
      width: "100%",
      height: 240,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors[theme].spider_detail.borderColor,
      resizeMode: "cover",
    },
    documentCard__buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 16,
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    // Enhanced view button styling
    documentCard__viewButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors[theme].card.backgroundColor || "#007AFF",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 24,
      flex: 1,
      marginRight: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
      borderWidth: 1,
      borderColor: Colors[theme].card.borderColor,
    },
    documentCard__buttonText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: "600",
      color: Colors[theme].text,
    },
    documentCard__removeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors[theme].card.backgroundColor,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: Colors[theme].warning.text || "#FF3B30",
      flex: 1,
      marginLeft: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    documentCard__removeButtonText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: "600",
      color: Colors[theme].text || "#FF3B30",
    },
    documentCard__noDocument: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: Colors[theme].spider_detail.backgroundColor || "#F2F2F7",
      borderRadius: 12,
      width: "100%",
      height: 200,
    },
    documentCard__noDocumentText: {
      marginTop: 12,
      textAlign: "center",
      color: Colors[theme].text || "#8E8E93",
      fontSize: 14,
    },

    // Block: modal - existing styles kept
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
