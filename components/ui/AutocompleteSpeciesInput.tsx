import React, { useEffect, useState } from "react";
import { TextInput, FlatList, TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { spiderSpeciesList } from "@/core/SpiderForm/SpiderForm.constants";

type Props = {
  value: string;
  onSelect: (value: string) => void;
};

export default function AutocompleteSpeciesInput({ value, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(spiderSpeciesList);

  const handleChange = (text: string) => {
    setQuery(text);
    if (text.trim() === "") {
      setFilteredData(spiderSpeciesList);
    } else {
      const filtered = spiderSpeciesList.filter((item) =>
        item.label.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        value={query}
        placeholder="Wpisz gatunek..."
        onChangeText={handleChange}
      />
      {query.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.value}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setQuery(item.label);
                onSelect(item.value);
                setFilteredData([]);
              }}
              style={styles.item}
            >
              <ThemedText>{item.label}</ThemedText>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 10,
  },
  item: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
