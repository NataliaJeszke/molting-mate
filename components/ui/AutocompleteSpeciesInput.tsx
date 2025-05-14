import React, { useEffect, useState } from "react";
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
import { useSpiderSpeciesStore } from "@/store/spiderSpeciesStore";
import { Colors, ThemeType } from "@/constants/Colors";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  value: number | string | null;
  onSelect: (value: number) => void;
  onCustomInput?: (text: string) => void;
  theme: ThemeType;
};

const AutocompleteSpeciesInput = ({
  value,
  onSelect,
  onCustomInput,
  theme,
}: Props) => {
  const { speciesOptions } = useSpiderSpeciesStore();
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(speciesOptions);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const exactMatch = speciesOptions.find(
      (item) => item.label.toLowerCase() === query.toLowerCase(),
    );
    if (!exactMatch && onCustomInput && query.trim().length > 0) {
      onCustomInput(query.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (value !== null) {
      const matched = speciesOptions.find((item) => item.value === value);
      if (matched) {
        setQuery(matched.label);
      }
    } else {
      setQuery("");
    }
  }, [value, speciesOptions]);

  const handleChange = (text: string) => {
    setQuery(text);
    if (text.trim() === "") {
      setFilteredData(speciesOptions);
      setDropdownVisible(false);
    } else {
      const filtered = speciesOptions.filter((item) =>
        item.label.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
      setDropdownVisible(true);
    }
  };

  const handleSelect = (item: { label: string; value: number }) => {
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
          placeholder={t("components.ui.autocomplete.placeholder")}
          placeholderTextColor={Colors[theme].text}
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
