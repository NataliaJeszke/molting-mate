import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";

import { useRouter } from "expo-router";

import Feather from "@expo/vector-icons/build/Feather";
import { AntDesign } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";

import SearchComponent from "@/core/SearchComponent/SearchComponent";
import PostFeedingListComponent from "@/core/PostFeedingComponent/PostFeedingComponent";
import PostMoltingListComponent from "@/core/PostMoltingComponent/PostMoltingComponent";

import { Colors, ThemeType } from "@/constants/Colors";

import WrapperComponent from "@/components/ui/WrapperComponent";
import CardComponent from "@/components/ui/CardComponent";
import SpiderGallery from "@/components/ui/SpiderGallery";
import UpcomingFeedingListComponent from "@/core/UpcomingFeedingListComponent/UpcomingFeedingListComponent";

export default function HomeScreen() {
  const router = useRouter();
  const { currentTheme } = useUserStore();

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
        <SpiderGallery />
        <PostFeedingListComponent />
        <UpcomingFeedingListComponent />
        <PostMoltingListComponent />
      </ScrollView>

      <TouchableOpacity
        style={styles(currentTheme)["dashboard__fab"]}
        onPress={() => router.push("/spiderForm")}
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
  });
