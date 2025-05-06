import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Animated,
} from "react-native";

import { useRouter } from "expo-router";

import Feather from "@expo/vector-icons/build/Feather";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";

import SearchComponent from "@/core/SearchComponent/SearchComponent";
import PostFeedingListComponent from "@/core/PostFeedingComponent/PostFeedingComponent";
import PostMoltingListComponent from "@/core/PostMoltingComponent/PostMoltingComponent";

import { Colors, ThemeType } from "@/constants/Colors";

import WrapperComponent from "@/components/ui/WrapperComponent";
import CardComponent from "@/components/ui/CardComponent";
import SpiderGallery from "@/components/ui/SpiderGallery";
import UpcomingFeedingListComponent from "@/core/UpcomingFeedingListComponent/UpcomingFeedingListComponent";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import {
  getAddSpeciesStyle,
  getAddSpiderStyle,
} from "@/utils/animations.constants";

import { Spider } from "@/db/database";
import { useSpidersStore } from "@/store/spidersStore";

export default function HomeScreen() {
  const router = useRouter();
  const { currentTheme } = useUserStore();
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const spiders = useSpidersStore((state: any) => state.spiders) as Spider[];
  const fetchSpiders = useSpidersStore((state: any) => state.fetchSpiders);

  useEffect(() => {
    fetchSpiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFab = () => {
    const toValue = isFabOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();

    setIsFabOpen(!isFabOpen);
  };

  return (
    <WrapperComponent>
      <CardComponent customStyle={styles(currentTheme)["dashboard__top-bar"]}>
        <TouchableOpacity
          onPress={() => {
            console.log("Ulubione pająki");
            router.push("/favourites");
          }}
        >
          <AntDesign name="heart" size={28} color={Colors[currentTheme].tint} />
        </TouchableOpacity>

        <View style={styles(currentTheme)["dashboard__search-wrapper"]}>
          <SearchComponent />
        </View>
      </CardComponent>

      <ScrollView>
        <SpiderGallery spiders={spiders} />
        <PostFeedingListComponent spiders={spiders} />
        <UpcomingFeedingListComponent spiders={spiders} />
        <PostMoltingListComponent spiders={spiders} />
      </ScrollView>

      <View style={styles(currentTheme).fabContainer}>
        <Animated.View
          style={[styles(currentTheme).fabItem, getAddSpeciesStyle(animation)]}
        >
          <TouchableOpacity
            style={[
              styles(currentTheme).fabItemButton,
              {
                backgroundColor: Colors[currentTheme].tint || "#4CAF50",
              },
            ]}
            onPress={() => {
              toggleFab();
              router.push("/addNewSPPtoList");
            }}
          >
            <Feather name="book" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles(currentTheme).fabItemLabel}>
            <ThemedText style={styles(currentTheme).fabItemText}>
              Dodaj gatunek
            </ThemedText>
          </View>
        </Animated.View>

        <Animated.View
          style={[styles(currentTheme).fabItem, getAddSpiderStyle(animation)]}
        >
          <TouchableOpacity
            style={styles(currentTheme).fabItemButton}
            onPress={() => {
              toggleFab();
              router.push("/spiderForm");
            }}
          >
            <MaterialCommunityIcons name="spider" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles(currentTheme).fabItemLabel}>
            <ThemedText style={styles(currentTheme).fabItemText}>
              Dodaj pająka
            </ThemedText>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={[
            styles(currentTheme).dashboardFab,
            isFabOpen && {
              backgroundColor: Colors[currentTheme].button_menu.open,
            },
          ]}
          onPress={toggleFab}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "45deg"],
                  }),
                },
              ],
            }}
          >
            <Feather name="plus" size={28} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </WrapperComponent>
  );
}

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    "dashboard__top-bar": {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 2,
      backgroundColor: Colors[theme].background,
      borderRadius: 8,
      borderWidth: 0,
    },
    "dashboard__search-wrapper": {
      flex: 1,
    },
    "dashboard__title-container": {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    "dashboard__step-container": {
      gap: 8,
      marginBottom: 8,
    },
    "dashboard__react-logo": {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: "absolute",
    },
    dashboard__container: {
      flex: 1,
    },
    dashboard__fab: {
      position: "absolute",
      right: 20,
      bottom: 60,
      width: 50,
      height: 50,
      borderRadius: 30,
      backgroundColor: Colors[theme].tint,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },

    "dashboard__add-new-species-button": {
      position: "absolute",
      bottom: 10,
      left: 20,
      right: 20,
      backgroundColor: Colors[theme].tint,
      paddingVertical: 12,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },

    fabContainer: {
      position: "absolute",
      right: 20,
      bottom: 60,
      alignItems: "center",
      zIndex: 10,
    },
    fabItem: {
      position: "absolute",
      right: 4,
      bottom: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      zIndex: 12,
    },
    fabItemButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: Colors[theme].tint,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    fabItemLabel: {
      position: "absolute",
      right: 50,
      backgroundColor: "rgba(0,0,0,0.7)",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginRight: 5,
    },
    fabItemText: {
      color: "#FFF",
      fontSize: 12,
    },
    dashboardFab: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: 50,
      height: 50,
      borderRadius: 30,
      backgroundColor: Colors[theme].tint,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 11,
    },
  });
