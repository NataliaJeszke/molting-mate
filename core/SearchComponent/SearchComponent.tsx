import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";

import { useUserStore } from "@/store/userStore";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "@/hooks/useTranslation";

const SearchComponent = () => {
  const [searchText, setSearchText] = useState("");
  const { currentTheme } = useUserStore();
  const { t } = useTranslation();

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
        placeholder={t("searched.placeholder")}
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={handleSearch}
        returnKeyType="search"
        onSubmitEditing={() => {
          if (searchText.trim() === "") {
            Alert.alert(t("searched.error"));
            return;
          }

          router.push({
            pathname: "/searched",
            params: { query: searchText },
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});

export default SearchComponent;
