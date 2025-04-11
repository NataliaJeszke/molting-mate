import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  Pressable,
  Text,
  Switch,
} from "react-native";
import { useUserStore } from "@/store/userStore";
import { ThemedText } from "@/components/ThemedText";

export default function ProfileScreen() {
  const { currentTheme, toggleTheme } = useUserStore();
  const toggleHasOnboarded = useUserStore((store) => store.toggleHasOnboarded);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.switchContainer}>
        <ThemedText style={styles.switchLabel}>Przełącz motyw:</ThemedText>
        <Switch
          value={currentTheme === "dark"}
          onValueChange={toggleTheme}
        />
      </View>
      <View style={styles.container}>
        <Button title="Back to onboarding" onPress={toggleHasOnboarded} />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
});
