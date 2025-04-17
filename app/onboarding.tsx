import { View, StyleSheet, Text, Pressable } from "react-native";
import LottieView from "lottie-react-native";

import { useRouter } from "expo-router";

import { useUserStore } from "@/store/userStore";

export default function OnboardingScreen() {
  const router = useRouter();
  const toggleHasOnboarded = useUserStore((state) => state.toggleHasOnboarded);

  const handlePress = () => {
    toggleHasOnboarded();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/images/animations/spider-animation2.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Let me in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#2e1a47",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
