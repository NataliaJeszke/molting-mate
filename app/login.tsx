import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
// import { ThemedText } from "@/components/ui/ThemedText";
import { useRouter } from "expo-router";
import { saveLoginSession, useUserStore } from "@/store/userStore";
import { useState } from "react";
import { loginUser } from "@/lib/authService";
import { Ionicons } from "@expo/vector-icons";
import { Colors, ThemeType } from "@/constants/Colors";

export default function LoginScreen() {
  const logIn = useUserStore((state) => state.logIn);
  const { currentTheme } = useUserStore();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola");
      return;
    }

    setIsLoading(true);
    try {
      const success = await loginUser(username, password);
      if (success) {
        await saveLoginSession({
          username,
          loginTime: new Date().toISOString(),
        });
        logIn();
        console.log("✅ User logged in successfully");
        router.replace("/");
      } else {
        Alert.alert("Błąd", "Nieprawidłowe dane logowania");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      Alert.alert("Błąd", "Wystąpił problem podczas logowania");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles(currentTheme)["container"]]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle={currentTheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={Colors[currentTheme].background}
      />

      <ScrollView
        contentContainerStyle={[styles(currentTheme)["scroll-container"]]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles(currentTheme)["header"]]}>
          <View style={[styles(currentTheme)["logo"]]}>
            <Ionicons
              name="lock-closed"
              size={36}
              color={
                currentTheme === "dark"
                  ? Colors[currentTheme].background
                  : "#ffffff"
              }
            />
          </View>

          <Text style={[styles(currentTheme)["title"]]}>Witaj ponownie!</Text>
          <Text style={[styles(currentTheme)["subtitle"]]}>
            Zaloguj się do swojego konta
          </Text>
        </View>

        <View style={[styles(currentTheme)["form"]]}>
          <View style={[styles(currentTheme)["input-container"]]}>
            <Text style={[styles(currentTheme)["input-label"]]}>
              Nazwa użytkownika
            </Text>
            <View style={[styles(currentTheme)["input-wrapper"]]}>
              <TextInput
                placeholder="Wprowadź nazwę użytkownika"
                placeholderTextColor={Colors[currentTheme].icon}
                style={[
                  styles(currentTheme)["input"],
                  focusedInput === "username" &&
                    styles(currentTheme)["input-focused"],
                ]}
                value={username}
                onChangeText={setUsername}
                onFocus={() => setFocusedInput("username")}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                autoComplete="off"
              />
              <View style={[styles(currentTheme)["input-icon"]]}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={
                    focusedInput === "username"
                      ? Colors[currentTheme].tint
                      : Colors[currentTheme].icon
                  }
                />
              </View>
            </View>
          </View>

          <View style={[styles(currentTheme)["input-container"]]}>
            <Text style={[styles(currentTheme)["input-label"]]}>Hasło</Text>
            <View style={[styles(currentTheme)["input-wrapper"]]}>
              <TextInput
                style={[
                  styles(currentTheme)["input"],
                  focusedInput === "password" &&
                    styles(currentTheme)["input-focused"],
                ]}
                placeholder="Wprowadź hasło"
                placeholderTextColor={Colors[currentTheme].icon}
                secureTextEntry={!showPassword}
                textContentType="oneTimeCode"
                autoComplete="off"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                returnKeyType="done"
              />
              <Pressable
                style={[
                  styles(currentTheme)["input-icon"],
                  styles(currentTheme)["password-toggle"],
                ]}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={
                    focusedInput === "password"
                      ? Colors[currentTheme].tint
                      : Colors[currentTheme].icon
                  }
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            style={[
              styles(currentTheme)["button"],
              isLoading && styles(currentTheme)["button-disabled"],
            ]}
            disabled={isLoading}
          >
            <Text style={[styles(currentTheme)["button-text"]]}>
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles(currentTheme)["forgot-password"]]}
            onPress={() => {
              setPassword("");
              router.push("/register?mode=reset");
            }}
          >
            <Text style={[styles(currentTheme)["forgot-password-text"]]}>
              Zapomniałeś hasła?
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles(currentTheme)["footer"]]}
          onPress={() => {
            setPassword("");
            router.push("/register?mode=register");
          }}
        >
          <Text style={[styles(currentTheme)["footer-text"]]}>
            Nie masz konta?{" "}
            <Text style={[styles(currentTheme)["signup-text"]]}>
              Zarejestruj się
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    "scroll-container": {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
    },
    header: {
      alignItems: "center",
      marginBottom: 48,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: Colors[theme].tint,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
      shadowColor: Colors[theme].shadow,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: Colors[theme].text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].icon,
      textAlign: "center",
    },
    form: {
      width: "100%",
      maxWidth: 400,
      alignSelf: "center",
    },
    "input-container": {
      marginBottom: 20,
    },
    "input-label": {
      fontSize: 14,
      fontWeight: "600",
      color: Colors[theme].text,
      marginBottom: 8,
    },
    "input-wrapper": {
      position: "relative",
    },
    input: {
      backgroundColor: Colors[theme].input.backgroundColor,
      borderWidth: 2,
      borderColor: Colors[theme].inputBorder,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: Colors[theme].text,
      paddingRight: 50,
    },
    "input-focused": {
      borderColor: Colors[theme].input.inputFocused,
      shadowColor: Colors[theme].shadow,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    "input-icon": {
      position: "absolute",
      right: 16,
      top: 16,
    },
    "password-toggle": {
      padding: 4,
    },
    button: {
      backgroundColor: Colors[theme].tint,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8,
      shadowColor: Colors[theme].shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    "button-disabled": {
      opacity: 0.6,
    },
    "button-text": {
      color: theme === "dark" ? Colors[theme].background : "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },
    "forgot-password": {
      alignItems: "center",
      marginTop: 24,
    },
    "forgot-password-text": {
      color: Colors[theme].tint,
      fontSize: 14,
      fontWeight: "600",
    },
    footer: {
      alignItems: "center",
      marginTop: 32,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: Colors[theme].inputBorder,
    },
    "footer-text": {
      color: Colors[theme].icon,
      fontSize: 14,
    },
    "signup-text": {
      color: Colors[theme].tint,
      fontWeight: "600",
    },
  });
