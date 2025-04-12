import React, { useRef, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import { useUserStore } from "@/store/userStore";
import { Colors, ThemeType } from "@/constants/Colors";

type Spider = {
  id: string;
  name: string;
  date: string;
  status: string;
};

type SpiderListProps = {
  title: string;
  data: Spider[];
};

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 100;
const SCROLL_AMOUNT = ITEM_WIDTH * 2;

const SpiderList = ({ title, data }: SpiderListProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
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
      <Text style={styles(currentTheme).sectionTitle}>{title}</Text>
      <View style={styles(currentTheme).carouselContainer}>
        {showLeftArrow && (
          <TouchableOpacity style={styles(currentTheme).arrowButton} onPress={scrollLeft}>
            <AntDesign name="left" size={20} color={Colors[currentTheme].tint} />
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles(currentTheme).scrollContent}
          onScroll={(event) => {
            setScrollPosition(event.nativeEvent.contentOffset.x);
          }}
          scrollEventThrottle={16}
        >
          {data.map((item) => (
            <View key={item.id} style={styles(currentTheme).spiderContainer}>
              <Image
                source={require("@/assets/images/spider.png")}
                style={styles(currentTheme).spiderImage}
              />
              <ThemedText style={styles(currentTheme).spiderInfo}>{item.name}</ThemedText>
              <ThemedText style={styles(currentTheme).spiderInfo}>{item.date}</ThemedText>
              <ThemedText style={styles(currentTheme).spiderInfo}>{item.status}</ThemedText>
            </View>
          ))}
        </ScrollView>

        {showRightArrow && (
          <TouchableOpacity style={styles(currentTheme).arrowButton} onPress={scrollRight}>
            <AntDesign name="right" size={20} color={Colors[currentTheme].tint} />
          </TouchableOpacity>
        )}
      </View>
    </CardComponent>
  );
};

const styles = (theme: ThemeType) => StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors[theme].tint 
  },
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  arrowButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors[theme].card.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
  spiderContainer: {
    width: ITEM_WIDTH,
    marginRight: 10,
    marginBottom: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  spiderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors[theme].spiderImage.backgroundColor,
  },
  spiderInfo: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default SpiderList;