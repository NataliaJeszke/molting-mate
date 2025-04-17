import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { spiderSpeciesList } from "@/core/SpiderForm/SpiderForm.constants";
import { Colors, ThemeType } from "@/constants/Colors";

type Props = {
  value: string;
  onSelect: (value: string) => void;
  theme: ThemeType;
};

const AutocompleteSpeciesInput = ({ onSelect, theme }: Props) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(spiderSpeciesList);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleChange = (text: string) => {
    setQuery(text);
    if (text.trim() === "") {
      setFilteredData(spiderSpeciesList);
      setDropdownVisible(false);
    } else {
      const filtered = spiderSpeciesList.filter((item) =>
        item.label.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
      setDropdownVisible(true);
    }
  };

  const handleSelect = (item: { label: string; value: string }) => {
    setQuery(item.label);
    onSelect(item.value);
    setDropdownVisible(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setDropdownVisible(false);
        Keyboard.dismiss();
      }}
    >
      <View style={styles(theme)["autocomplete"]}>
        <TextInput
          style={styles(theme)["autocomplete__input"]}
          value={query}
          placeholder="Zacznij pisać aby wyświetlić podpowiedzi"
          onChangeText={handleChange}
          onFocus={() => {
            if (query.length > 0) {
              setDropdownVisible(true);
            }
          }}
        />
        {isDropdownVisible && (
          <ScrollView
            style={styles(theme)["autocomplete__results"]}
            keyboardShouldPersistTaps="handled"
          >
            {filteredData.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleSelect(item)}
                style={styles(theme)["autocomplete__item"]}
              >
                <ThemedText>{item.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AutocompleteSpeciesInput;

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    autocomplete: {
      borderWidth: 0.5,
      borderRadius: 6,
      marginBottom: 24,
      overflow: "hidden",
      borderColor: Colors[theme].picker.borderColor,
      backgroundColor: Colors[theme].picker.background,
      maxHeight: 200,
      padding: 9,
    },
    autocomplete__input: {
      backgroundColor: Colors[theme].picker.background,
      padding: 4,
      borderRadius: 10,
      fontSize: 16,
      color: Colors[theme].picker.text,
    },
    autocomplete__results: {
      maxHeight: 200,
      marginTop: 4,
      backgroundColor: Colors[theme].picker.background,
    },
    autocomplete__item: {
      padding: 12,
      backgroundColor: Colors[theme].picker.background,
      borderBottomWidth: 1,
    },
  });
