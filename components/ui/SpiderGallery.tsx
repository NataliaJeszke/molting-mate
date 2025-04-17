import React, { useRef, useState, useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";

import { getRandomUserImages } from "@/utils/getRandomUserImages";
import { Colors, ThemeType } from "@/constants/Colors";

import CardComponent from "@/components/ui/CardComponent";

const defaultSpiderImages = [
  require("@/assets/images/spider-gallery-1.jpg"),
  require("@/assets/images/spider-gallery-2.jpg"),
  require("@/assets/images/spider-gallery-3.jpg"),
];

const { width } = Dimensions.get("window");

const SpiderGallery = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentTheme } = useUserStore();
  const { spiders } = useSpidersStore();
  const [imagesToShow, setImagesToShow] = useState(() => {
    const spidersWithImages = spiders.filter((spider) => spider.imageUri);
    return spidersWithImages.length > 0
      ? getRandomUserImages(spidersWithImages)
      : defaultSpiderImages;
  });
  useEffect(() => {
    const spidersWithImages = spiders.filter((spider) => spider.imageUri);
    if (spidersWithImages.length > 0) {
      setImagesToShow(getRandomUserImages(spidersWithImages));
    } else {
      setImagesToShow(defaultSpiderImages);
    }
  }, [spiders]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % imagesToShow.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, imagesToShow]);

  return (
    <CardComponent>
      <View style={styles(currentTheme)["gallery"]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          scrollEnabled={false}
        >
          {imagesToShow.map((image, index) => (
            <View
              key={index}
              style={styles(currentTheme)["gallery__image-container"]}
            >
              <Image
                source={image}
                style={styles(currentTheme)["gallery__image"]}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles(currentTheme)["gallery__dots"]}>
          {imagesToShow.map((_, index) => (
            <View
              key={index}
              style={[
                styles(currentTheme)["gallery__dot"],
                currentIndex === index &&
                  styles(currentTheme)["gallery__dot--active"],
              ]}
            />
          ))}
        </View>
      </View>
    </CardComponent>
  );
};

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    gallery: {
      height: 200,
      marginBottom: 16,
    },
    "gallery__image-container": {
      width: width,
      height: 200,
      overflow: "hidden",
    },
    gallery__image: {
      width: "100%",
      height: "100%",
    },
    gallery__dots: {
      position: "absolute",
      bottom: -20,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    gallery__dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors[theme].dot.inactive,
    },
    "gallery__dot--active": {
      backgroundColor: Colors[theme].dot.active,
    },
  });

export default SpiderGallery;
