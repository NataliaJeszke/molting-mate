import { ThemedText } from "@/components/ui/ThemedText";
import { Colors, ThemeType } from "@/constants/Colors";
import { registerUser, resetPassword } from "@/lib/authService";
import { useUserStore } from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  Text,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const { currentTheme } = useUserStore();
  const { mode: modeParam } = useLocalSearchParams();
  const [mode, setMode] = useState(modeParam || "register");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    console.log("🚀 RegisterScreen mounted with mode:", modeParam);
    setMode(modeParam || "register");
  }, [modeParam]);

  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: any) => {
    return password.length >= 6;
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Błąd", "Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Błąd", "Hasła nie są identyczne");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(username, password);
      Alert.alert(
        "Sukces",
        "Konto zostało utworzone! Możesz się teraz zalogować.",
        [{ text: "OK", onPress: () => router.replace("/login") }],
      );
    } catch (error) {
      console.error("❌ Registration error:", error);
      Alert.alert("Błąd", "Wystąpił problem podczas rejestracji");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Błąd", "Wprowadź adres email");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Błąd", "Wprowadź prawidłowy adres email");
      return;
    }

    setIsLoading(true);
    try {
      const success = await resetPassword(email);
      if (success) {
        Alert.alert("Sukces", "OK", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Błąd", "Nie udało się wysłać linku resetującego");
      }
    } catch (error) {
      console.error("❌ Reset password error:", error);
      Alert.alert("Błąd", "Wystąpił problem podczas resetowania hasła");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "register") {
      handleRegister();
    } else {
      handleResetPassword();
    }
  };

  const getHeaderData = () => {
    if (mode === "register") {
      return {
        icon: "person-add",
        title: "Utwórz konto",
        subtitle: "Zarejestruj się, aby rozpocząć",
      };
    } else {
      return {
        icon: "key",
        title: "Resetuj hasło",
        subtitle: "Otrzymasz link na swoim emailu",
      };
    }
  };

  const headerData = getHeaderData();

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
        {/* Back Button */}
        <Pressable
          style={[styles(currentTheme)["back-button"]]}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors[currentTheme].text}
          />
        </Pressable>

        <View style={[styles(currentTheme)["header"]]}>
          <View style={[styles(currentTheme)["logo"]]}>
            <Ionicons
              name={headerData.icon as "person-add" | "key"}
              size={30}
              color={
                currentTheme === "dark"
                  ? Colors[currentTheme].background
                  : "#ffffff"
              }
            />
          </View>

          <ThemedText style={[styles(currentTheme)["title"]]}>
            {headerData.title}
          </ThemedText>
          <ThemedText style={[styles(currentTheme)["subtitle"]]}>
            {headerData.subtitle}
          </ThemedText>
        </View>

        {/* Mode Toggle */}
        <View style={[styles(currentTheme)["mode-toggle"]]}>
          <Pressable
            style={[
              styles(currentTheme)["toggle-button"],
              mode === "register" &&
                styles(currentTheme)["toggle-button-active"],
            ]}
            onPress={() => setMode("register")}
          >
            <ThemedText
              style={[
                styles(currentTheme)["toggle-text"],
                mode === "register" &&
                  styles(currentTheme)["toggle-text-active"],
              ]}
            >
              Rejestracja
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles(currentTheme)["toggle-button"],
              mode === "reset" && styles(currentTheme)["toggle-button-active"],
            ]}
            onPress={() => setMode("reset")}
          >
            <ThemedText
              style={[
                styles(currentTheme)["toggle-text"],
                mode === "reset" && styles(currentTheme)["toggle-text-active"],
              ]}
            >
              Reset hasła
            </ThemedText>
          </Pressable>
        </View>

        <View style={[styles(currentTheme)["form"]]}>
          {/* Username - tylko przy rejestracji */}
          {mode === "register" && (
            <View style={[styles(currentTheme)["input-container"]]}>
              <ThemedText style={[styles(currentTheme)["input-label"]]}>
                Nazwa użytkownika
              </ThemedText>
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
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
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
          )}

          {/* Email */}
          <View style={[styles(currentTheme)["input-container"]]}>
            <ThemedText style={[styles(currentTheme)["input-label"]]}>
              Adres email
            </ThemedText>
            <View style={[styles(currentTheme)["input-wrapper"]]}>
              <TextInput
                placeholder="Wprowadź adres email"
                placeholderTextColor={Colors[currentTheme].icon}
                style={[
                  styles(currentTheme)["input"],
                  focusedInput === "email" &&
                    styles(currentTheme)["input-focused"],
                ]}
                value={email}
                onChangeText={setEmail}
                onBlur={() => setFocusedInput(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              <View style={[styles(currentTheme)["input-icon"]]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    focusedInput === "email"
                      ? Colors[currentTheme].tint
                      : Colors[currentTheme].icon
                  }
                />
              </View>
            </View>
          </View>

          {/* Password - tylko przy rejestracji */}
          {mode === "register" && (
            <>
              <View style={[styles(currentTheme)["input-container"]]}>
                <ThemedText style={[styles(currentTheme)["input-label"]]}>
                  Hasło
                </ThemedText>
                <View style={[styles(currentTheme)["input-wrapper"]]}>
                  <TextInput
                    placeholder="Wprowadź hasło (min. 6 znaków)"
                    placeholderTextColor={Colors[currentTheme].icon}
                    secureTextEntry={!showPassword}
                    style={[
                      styles(currentTheme)["input"],
                      focusedInput === "password" &&
                        styles(currentTheme)["input-focused"],
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => setFocusedInput(null)}
                    returnKeyType="next"
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

              <View style={[styles(currentTheme)["input-container"]]}>
                <ThemedText style={[styles(currentTheme)["input-label"]]}>
                  Potwierdź hasło
                </ThemedText>
                <View style={[styles(currentTheme)["input-wrapper"]]}>
                  <TextInput
                    placeholder="Powtórz hasło"
                    placeholderTextColor={Colors[currentTheme].icon}
                    secureTextEntry={!showConfirmPassword}
                    style={[
                      styles(currentTheme)["input"],
                      focusedInput === "confirmPassword" &&
                        styles(currentTheme)["input-focused"],
                    ]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onBlur={() => setFocusedInput(null)}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  <Pressable
                    style={[
                      styles(currentTheme)["input-icon"],
                      styles(currentTheme)["password-toggle"],
                    ]}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color={
                        focusedInput === "confirmPassword"
                          ? Colors[currentTheme].tint
                          : Colors[currentTheme].icon
                      }
                    />
                  </Pressable>
                </View>
              </View>
            </>
          )}

          <Pressable
            onPress={handleSubmit}
            style={[
              styles(currentTheme)["button"],
              isLoading && styles(currentTheme)["button-disabled"],
            ]}
            disabled={isLoading}
          >
            <ThemedText style={[styles(currentTheme)["button-text"]]}>
              {isLoading
                ? mode === "register"
                  ? "Rejestrowanie..."
                  : "Wysyłanie..."
                : mode === "register"
                  ? "Zarejestruj się"
                  : "Wyślij link"}
            </ThemedText>
          </Pressable>
        </View>

        <Pressable
          style={[styles(currentTheme)["footer"]]}
          onPress={() => router.push("/login")}
        >
          <Text style={[styles(currentTheme)["footer-text"]]}>
            Masz już konto?{" "}
            <Text style={[styles(currentTheme)["login-text"]]}>
              Zaloguj się
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
      padding: 24,
      paddingTop: 60,
    },
    "back-button": {
      position: "absolute",
      top: 24,
      left: 24,
      zIndex: 1,
      padding: 8,
      borderRadius: 8,
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
      marginTop: 20,
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
      paddingTop: 8,
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].icon,
      textAlign: "center",
    },
    "mode-toggle": {
      flexDirection: "row",
      backgroundColor: Colors[theme].input.backgroundColor,
      borderRadius: 12,
      padding: 4,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: Colors[theme].inputBorder,
    },
    "toggle-button": {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 8,
    },
    "toggle-button-active": {
      backgroundColor: Colors[theme].tint,
      shadowColor: Colors[theme].shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    "toggle-text": {
      fontSize: 14,
      fontWeight: "600",
      color: Colors[theme].icon,
    },
    "toggle-text-active": {
      color: theme === "dark" ? Colors[theme].background : "#ffffff",
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
    "login-text": {
      color: Colors[theme].tint,
      fontWeight: "600",
    },
  });
