import React, { useRef, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";
import { SpiderListItem } from "@/models/SpiderList.model";
import { Colors, ThemeType } from "@/constants/Colors";

import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import { router } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";

const defaultSpiderImage = require("@/assets/images/spider.png");

type SpiderListProps = {
  title: string;
  data: SpiderListItem[];
  info?: string;
};

const CarouselSpiderImage = ({
  imageUri,
  style,
}: {
  imageUri?: string | null;
  style: object;
}) => {
  const [hasError, setHasError] = useState(false);
  const shouldUseDefault = !imageUri || imageUri.trim() === "" || hasError;

  return (
    <Image
      source={shouldUseDefault ? defaultSpiderImage : { uri: imageUri }}
      style={style}
      resizeMode="cover"
      onError={() => setHasError(true)}
    />
  );
};

const ITEM_WIDTH = 100;
const SCROLL_AMOUNT = ITEM_WIDTH * 2;

const SpiderList = ({ title, data, info }: SpiderListProps) => {
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { currentTheme } = useUserStore();
  const { t } = useTranslation();

  const maxScroll = useMemo(
    () => Math.max(0, data.length * (ITEM_WIDTH + 10) - (width - 60)),
    [data.length, width],
  );

  const scrollLeft = useCallback(() => {
    const newPosition = Math.max(0, scrollPosition - SCROLL_AMOUNT);
    scrollViewRef.current?.scrollTo({ x: newPosition, animated: true });
    setScrollPosition(newPosition);
  }, [scrollPosition]);

  const scrollRight = useCallback(() => {
    const newPosition = Math.min(maxScroll, scrollPosition + SCROLL_AMOUNT);
    scrollViewRef.current?.scrollTo({ x: newPosition, animated: true });
    setScrollPosition(newPosition);
  }, [scrollPosition, maxScroll]);

  const showLeftArrow = scrollPosition > 0;
  const showRightArrow = scrollPosition < maxScroll;

  const truncateText = useCallback((text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }, []);

  const componentStyles = useMemo(() => styles(currentTheme), [currentTheme]);

  return (
    <CardComponent>
      <View style={componentStyles["spider-list__wrapper"]}>
        <Text style={componentStyles["spider-list__title"]}>{title}</Text>
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
          <View style={componentStyles["spider-list__overlay"]}>
            <View style={componentStyles["spider-list__tooltip"]}>
              <Text style={componentStyles["spider-list__tooltip-text"]}>
                {info}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {data.length === 0 ? (
        <View style={componentStyles["spider-list__empty-state"]}>
          <ThemedText style={componentStyles["spider-list__empty-text"]}>
            {t("components.commons.spider-list.empty")}
          </ThemedText>
        </View>
      ) : (
        <View style={componentStyles["spider-list__carousel"]}>
          {showLeftArrow && (
            <TouchableOpacity
              style={componentStyles["spider-list__arrow-button"]}
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
              componentStyles["spider-list__scroll-content"]
            }
            onScroll={(event) => {
              setScrollPosition(event.nativeEvent.contentOffset.x);
            }}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            decelerationRate="fast"
          >
            {data.map((spider) => (
              <View
                key={spider.id}
                style={componentStyles["spider-list__item"]}
              >
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/spider/${spider.id}`);
                  }}
                >
                  <CarouselSpiderImage
                    imageUri={spider.imageUri}
                    style={componentStyles["spider-list__image"]}
                  />
                </TouchableOpacity>
                <ThemedText style={componentStyles["spider-list__info"]}>
                  {truncateText(spider.name, 8)}
                </ThemedText>
                <ThemedText style={componentStyles["spider-list__info"]}>
                  {spider.date}
                </ThemedText>

                <ThemedText style={componentStyles["spider-list__info"]}>
                  {spider.status}
                </ThemedText>
              </View>
            ))}
          </ScrollView>

          {showRightArrow && (
            <TouchableOpacity
              style={componentStyles["spider-list__arrow-button"]}
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
      )}
    </CardComponent>
  );
};

/* eslint-disable react-native/no-unused-styles */
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
      fontSize: 16,
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
    "spider-list__empty-state": {
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 80,
    },
    "spider-list__empty-text": {
      fontSize: 14,
      color: Colors[theme].text,
      opacity: 0.6,
      textAlign: "center",
    },
  });

export default SpiderList;
