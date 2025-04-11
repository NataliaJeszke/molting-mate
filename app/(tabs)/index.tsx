import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Szukaj pająka..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/newSpider")}
        >
          <ThemedText style={styles.buttonText}>Dodaj pająka</ThemedText>
        </TouchableOpacity>
        <ScrollView>
          <SpiderList title="🕷️ Pająki przed linieniem" />
          <SpiderList title="🍽️ Pająki przed karmieniem" />
          <SpiderList title="❤️ Pająki ulubione" />
          <SpiderList title="🕸️ Pająki po linieniu" />
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
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#1a759f",
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },

  searchInput: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    margin: 16,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});
