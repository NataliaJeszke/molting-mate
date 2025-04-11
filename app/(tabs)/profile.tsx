import { View, StyleSheet, Button, SafeAreaView } from "react-native";
import { useUserStore } from "@/store/userStore";

export default function ProfileScreen() {
  const toggleHasOnboarded = useUserStore((store) => store.toggleHasOnboarded);
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
});
