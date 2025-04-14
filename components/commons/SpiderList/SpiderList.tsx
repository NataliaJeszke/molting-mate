import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserStore } from "@/store/userStore";
import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";

type SpiderList = {
  id: string;
  name: string;
  date: string;
  imageUri?: string | null;
  status?: FeedingStatus | string | null;
};

type SpiderListProps = {
  title: string;
  data: SpiderList[];
  info?: string;
};

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 100;
const SCROLL_AMOUNT = ITEM_WIDTH * 2;

const SpiderList = ({ title, data, info }: SpiderListProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { currentTheme } = useUserStore();

  const maxScroll = Math.max(0, data.length * (ITEM_WIDTH + 10) - (width - 60));

  const scrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - SCROLL_AMOUNT);
    scrollViewRef.current?.scrollTo({ x: newPosition, animated: true });
    setScrollPosition(newPosition);
  };

  const scrollRight = () => {
    const newPosition = Math.min(maxScroll, scrollPosition + SCROLL_AMOUNT);
    scrollViewRef.current?.scrollTo({ x: newPosition, animated: true });
    setScrollPosition(newPosition);
  };

  const showLeftArrow = scrollPosition > 0;
  const showRightArrow = scrollPosition < maxScroll;

  return (
    <CardComponent>
      <View style={styles(currentTheme)["spider-list__wrapper"]}>
        <Text style={styles(currentTheme)["spider-list__title"]}>{title}</Text>
        <TouchableOpacity
          onPress={() => setTooltipVisible(true)}
          style={{ marginLeft: 6 }}
        >
          <MaterialIcons
            name="info-outline"
            size={20}
            color={Colors[currentTheme].tint}
          />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={tooltipVisible}
        animationType="fade"
        onRequestClose={() => setTooltipVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setTooltipVisible(false)}>
          <View style={styles(currentTheme)["spider-list__overlay"]}>
            <View style={styles(currentTheme)["spider-list__tooltip"]}>
              <Text style={styles(currentTheme)["spider-list__tooltip-text"]}>
                {info}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles(currentTheme)["spider-list__carousel"]}>
        {showLeftArrow && (
          <TouchableOpacity
            style={styles(currentTheme)["spider-list__arrow-button"]}
            onPress={scrollLeft}
          >
            <AntDesign
              name="left"
              size={20}
              color={Colors[currentTheme].tint}
            />
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles(currentTheme)["spider-list__scroll-content"]
          }
          onScroll={(event) => {
            setScrollPosition(event.nativeEvent.contentOffset.x);
          }}
          scrollEventThrottle={16}
        >
          {data.map((item) => (
            <View
              key={item.id}
              style={styles(currentTheme)["spider-list__item"]}
            >
              <Image
                source={
                  item.imageUri
                    ? { uri: item.imageUri }
                    : require("@/assets/images/spider.png")
                }
                style={styles(currentTheme)["spider-list__image"]}
              />
              <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                {item.name}
              </ThemedText>
              <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                {item.date}
              </ThemedText>
              
              <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                {item.status}
              </ThemedText>
            </View>
          ))}
        </ScrollView>

        {showRightArrow && (
          <TouchableOpacity
            style={styles(currentTheme)["spider-list__arrow-button"]}
            onPress={scrollRight}
          >
            <AntDesign
              name="right"
              size={20}
              color={Colors[currentTheme].tint}
            />
          </TouchableOpacity>
        )}
      </View>
    </CardComponent>
  );
};

const styles = (theme: ThemeType) =>
  StyleSheet.create({
    "spider-list__wrapper": {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    "spider-list__title": {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
      color: Colors[theme].tint,
    },
    "spider-list__carousel": {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },
    "spider-list__arrow-button": {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: Colors[theme].card.backgroundColor,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    "spider-list__scroll-content": {
      paddingHorizontal: 5,
    },
    "spider-list__item": {
      width: ITEM_WIDTH,
      marginRight: 10,
      marginBottom: 12,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    "spider-list__image": {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: Colors[theme].spiderImage.backgroundColor,
    },
    "spider-list__info": {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "500",
      textAlign: "center",
    },
    "spider-list__overlay": {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    "spider-list__tooltip": {
      backgroundColor: "#fff",
      padding: 12,
      borderRadius: 8,
      maxWidth: 300,
      elevation: 6,
    },
    "spider-list__tooltip-text": {
      fontSize: 14,
      color: "#333",
      textAlign: "center",
    },
  });

export default SpiderList;
