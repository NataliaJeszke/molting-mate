import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { FilterViewTypes, useFiltersStore } from "@/store/filtersStore";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";

type Props = {
  viewType: FilterViewTypes;
};

const Filters = ({ viewType }: Props) => {
  const { filters, setFilters, resetFilters } = useFiltersStore();
  const current = filters[viewType];

  const [isDateFromPickerVisible, setDateFromPickerVisible] = useState(false);
  const [isDateToPickerVisible, setDateToPickerVisible] = useState(false);

  const handleChange = (field: keyof typeof current, value: string) => {
    setFilters(viewType, {
      ...current,
      [field]: value,
    });
  };

  const handleReset = () => {
    resetFilters(viewType);
  };

  const showDateFromPicker = () => {
    setDateFromPickerVisible(true);
  };

  const hideDateFromPicker = () => {
    setDateFromPickerVisible(false);
  };

  const handleDateFromConfirm = (dateString: string) => {
    handleChange("dateFrom", dateString);
    hideDateFromPicker();
  };

  const showDateToPicker = () => {
    setDateToPickerVisible(true);
  };

  const hideDateToPicker = () => {
    setDateToPickerVisible(false);
  };

  const handleDateToConfirm = (dateString: string) => {
    handleChange("dateTo", dateString);
    hideDateToPicker();
  };

  const getInitialDateFrom = () => {
    if (current.dateFrom) {
      const [day, month, year] = current.dateFrom.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date > new Date() ? new Date() : date;
    }
    return new Date();
  };

  const getInitialDateTo = () => {
    if (current.dateTo) {
      const [day, month, year] = current.dateTo.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date > new Date() ? new Date() : date;
    }
    return new Date();
  };

  const today = new Date();

  return (
    <View style={styles.filtersContainer}>
      <ThemedText style={styles.filtersTitle}>Wybierz filtry:</ThemedText>

      <TextInput
        placeholder="Wiek (liczba)"
        value={current.age?.toString() || ""}
        onChangeText={(text) => handleChange("age", text)}
        style={styles.input}
        keyboardType="numeric"
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

      <TouchableOpacity style={styles.dateInput} onPress={showDateFromPicker}>
        <ThemedText
          style={current.dateFrom ? styles.dateText : styles.datePlaceholder}
        >
          {current.dateFrom || "Data od (dd-mm-yyyy)"}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dateInput} onPress={showDateToPicker}>
        <ThemedText
          style={current.dateTo ? styles.dateText : styles.datePlaceholder}
        >
          {current.dateTo || "Data do (dd-mm-yyyy)"}
        </ThemedText>
      </TouchableOpacity>

      <Button title="Wyczyść filtry" onPress={handleReset} color="#ff4747" />

      <ThemedDatePicker
        isVisible={isDateFromPickerVisible}
        initialDate={getInitialDateFrom()}
        maximumDate={today}
        onConfirm={handleDateFromConfirm}
        onCancel={hideDateFromPicker}
      />

      <ThemedDatePicker
        isVisible={isDateToPickerVisible}
        initialDate={getInitialDateTo()}
        maximumDate={today}
        onConfirm={handleDateToConfirm}
        onCancel={hideDateToPicker}
      />
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
  dateInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#aaa",
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    color: "#000",
  },
  datePlaceholder: {
    color: "#999",
  },
});

export default Filters;
