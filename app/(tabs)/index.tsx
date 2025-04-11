import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import Feather from "@expo/vector-icons/build/Feather";
import { AntDesign } from "@expo/vector-icons";

import SpiderList from "@/components/commons/SpiderList/SpiderList";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => {
              console.log("Ulubione pająki");
              router.push("/favourites");
            }}
          >
            <AntDesign name="heart" size={24} color="#e63946" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Szukaj pająka..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => router.push("/newSpider")}>
            <Feather name="plus-circle" size={28} color="#1a759f" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <SpiderList title="Przed linieniem" />
          <SpiderList title="Głodne" />
          <SpiderList title="Po linieniu" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    marginHorizontal: 8,
  },
});
