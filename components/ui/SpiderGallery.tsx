import React, { useRef, useState, useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import CardComponent from "@/components/ui/CardComponent";
import { Colors, ThemeType } from "@/constants/Colors";
import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";
import { getRandomUserImages } from "@/utils/getRandomUserImages";

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
  const [imagesToShow, setImagesToShow] = useState(() =>
    spiders.length > 0 ? getRandomUserImages(spiders) : defaultSpiderImages
  );

  useEffect(() => {
    if (spiders.length > 0) {
      setImagesToShow(getRandomUserImages(spiders));
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
      <View style={styles(currentTheme).container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          scrollEnabled={false}
        >
          {imagesToShow.map((image, index) => (
            <View key={index} style={styles(currentTheme).imageContainer}>
              <Image source={image} style={styles(currentTheme).image} resizeMode="cover" />
            </View>
          ))}
        </ScrollView>
        <View style={styles(currentTheme).dotsContainer}>
          {imagesToShow.map((_, index) => (
            <View
              key={index}
              style={[
                styles(currentTheme).dot,
                currentIndex === index && styles(currentTheme).activeDot,
              ]}
            />
          ))}
        </View>
      </View>
    </CardComponent>
  );
};

const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 16,
  },
  imageContainer: {
    width: width,
    height: 200,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dotsContainer: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors[theme].dot.inactive,
  },
  activeDot: {
    backgroundColor: Colors[theme].dot.active,
  },
});

export default SpiderGallery;