import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { useUserStore } from "@/store/userStore";
import { Colors } from "@/constants/Colors";

import { ThemedText } from "@/components/ui/ThemedText";

const SearchComponent = () => {
  const [searchText, setSearchText] = useState("");
  const { currentTheme } = useUserStore();

  const isDarkMode = currentTheme === "dark";
  const searchBarColors = isDarkMode
    ? Colors.dark.searchBar
    : Colors.light.searchBar;

  const handleSearch = (text: string) => {
    setSearchText(text);
    console.log("Wpisano:", text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, searchBarColors]}
        placeholder="Szukaj pająka..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={handleSearch}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (searchText.trim() === "") {
            Alert.alert("Błąd", "Wpisz coś, aby wyszukać.");
            return;
          }

          router.push({
            pathname: "/searched",
            params: { query: searchText },
          });
        }}
      >
        <ThemedText style={styles.buttonText}>Szukaj</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SearchComponent;
