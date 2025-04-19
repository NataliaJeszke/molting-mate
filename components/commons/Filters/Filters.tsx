import React from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { FilterViewTypes, useFiltersStore } from "@/store/filtersStore";

type Props = {
  viewType: FilterViewTypes;
};

const Filters = ({ viewType }: Props) => {
  const { filters, setFilters, resetFilters } = useFiltersStore();
  const current = filters[viewType];

  const handleChange = (field: keyof typeof current, value: string) => {
    setFilters(viewType, {
      ...current,
      [field]: value,
    });
  };

  const handleReset = () => {
    resetFilters(viewType);
  };

  return (
    <View style={styles.filtersContainer}>
      <ThemedText style={styles.filtersTitle}>Wybierz filtry:</ThemedText>

      <TextInput
        placeholder="Wiek (liczba)"
        value={current.age?.toString() || ""}
        onChangeText={(text) => handleChange("age", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Płeć (np. samica)"
        value={current.gender || ""}
        onChangeText={(text) => handleChange("gender", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Gatunek"
        value={current.species || ""}
        onChangeText={(text) => handleChange("species", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Data od (dd-mm-yyyy)"
        value={current.dateFrom || ""}
        onChangeText={(text) => handleChange("dateFrom", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Data do (dd-mm-yyyy)"
        value={current.dateTo || ""}
        onChangeText={(text) => handleChange("dateTo", text)}
        style={styles.input}
      />

      <Button title="Wyczyść filtry" onPress={handleReset} color="#ff4747" />
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    padding: 10,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#aaa",
  },
});

export default Filters;
