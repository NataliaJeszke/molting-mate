import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useUserStore } from "@/store/userStore";
import { Spider } from "@/models/Spider.model";
import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import { getNextFeedingDate, getFeedingStatus } from "@/utils/feedingUtils";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import CardComponent from "@/components/ui/CardComponent";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import HistoryInformation from "@/components/commons/HistoryInformation/HistoryInformation";

interface Props {
  spider: Spider;
}

export default function SpiderDetails({ spider }: Props) {
  const { currentTheme } = useUserStore();
  const [showFeedingHistory, setShowFeedingHistory] = useState(false);
  const [showMoltingHistory, setShowMoltingHistory] = useState(false);

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
  });
