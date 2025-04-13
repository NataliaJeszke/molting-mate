import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";

import { useRouter } from "expo-router";

import Feather from "@expo/vector-icons/build/Feather";
import { AntDesign } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";

import SearchComponent from "@/core/SearchComponent/SearchComponent";
import MissedFeedingListComponent from "@/core/MissedFeedingListComponent/MissedFeedingListComponent";
import PostMoltingListComponent from "@/core/PostMoltingComponent/PostMoltingComponent";

import { Colors, ThemeType } from "@/constants/Colors";

import WrapperComponent from "@/components/ui/WrapperComponent";
import CardComponent from "@/components/ui/CardComponent";
import SpiderGallery from "@/components/ui/SpiderGallery";

export default function HomeScreen() {
  const router = useRouter();
  const { currentTheme } = useUserStore();

  return (
    <WrapperComponent>
      <CardComponent customStyle={styles(currentTheme).topBar}>
        <TouchableOpacity
          onPress={() => {
            console.log("Ulubione pająki");
            router.push("/favourites");
          }}
        >
          <AntDesign name="heart" size={24} color={Colors[currentTheme].tint} />
        </TouchableOpacity>

        <View style={styles(currentTheme).searchWrapper}>
          <SearchComponent />
        </View>

        <TouchableOpacity onPress={() => router.push("/newSpider")}>
          <Feather
            name="plus-circle"
            size={28}
            color={Colors[currentTheme].tint}
          />
        </TouchableOpacity>
      </CardComponent>
      <ScrollView>
        <SpiderGallery />
        <MissedFeedingListComponent />
        <PostMoltingListComponent />
      </ScrollView>
    </WrapperComponent>
  );
}

const styles = (theme: ThemeType) =>
  StyleSheet.create({
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: "absolute",
    },
    container: {
      flex: 1,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 2,
      backgroundColor: Colors[theme].background,
      borderRadius: 8,
      borderWidth: 0,
    },
    searchWrapper: {
      flex: 1,
    },
  });
