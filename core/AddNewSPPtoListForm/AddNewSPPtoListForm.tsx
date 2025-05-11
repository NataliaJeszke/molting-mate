import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSpiderSpeciesStore } from "@/store/spiderSpeciesStore";
import AutocompleteSpeciesInput from "@/components/ui/AutocompleteSpeciesInput";
import { useUserStore } from "@/store/userStore";
import { Feather } from "@expo/vector-icons";
import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";

export default function SpiderSpeciesManager() {
  const { speciesOptions, addSpeciesToDb, deleteSpeciesFromDb } =
    useSpiderSpeciesStore();
  const { currentTheme } = useUserStore();
  const [selectedSpeciesValue, setSelectedSpeciesValue] = useState<
    number | null
  >(null);
  const [customInput, setCustomInput] = useState("");
  const [showAddButton, setShowAddButton] = useState(false);
  const router = useRouter();

  const filteredSpecies = customInput
    ? speciesOptions.filter((species) =>
        species.label.toLowerCase().includes(customInput.toLowerCase()),
      )
    : speciesOptions;

  useEffect(() => {
    if (customInput.trim() === "") {
      setShowAddButton(false);
      return;
    }

    const speciesExists = speciesOptions.some(
      (species) => species.label.toLowerCase() === customInput.toLowerCase(),
    );

    setShowAddButton(!speciesExists);
  }, [customInput, speciesOptions]);

  const handleAddSpecies = () => {
    if (customInput.trim() === "") return;

    Alert.alert(
      "Potwierdzenie dodania",
      `Czy chcesz dodać gatunek "${customInput}" do listy?`,
      [
        {
          text: "Anuluj",
          style: "cancel",
        },
        {
          text: "Dodaj",
          onPress: () => {
            addSpeciesToDb(customInput);
            Alert.alert(
              "Sukces",
              `Gatunek "${customInput}" został pomyślnie dodany do listy!`,
              [{ text: "OK" }],
            );
            setSelectedSpeciesValue(null);
            setCustomInput("");
          },
        },
      ],
    );
  };

  const handleDelete = async (species: { label: string; value: number }) => {
    Alert.alert(
      "Potwierdź usunięcie",
      `Czy na pewno chcesz usunąć gatunek "${species.label}"?`,
      [
        {
          text: "Anuluj",
          style: "cancel",
        },
        {
          text: "Usuń",
          onPress: async () => {
            try {
              const result = await deleteSpeciesFromDb(species.value);
              if (result.success) {
                Alert.alert(
                  "Sukces",
                  `Gatunek "${species.label}" został usunięty z listy!`,
                  [{ text: "OK" }],
                );
              } else {
                Alert.alert(
                  "Nie można usunąć",
                  `Nie można usunąć — ${result.count} pająk(i) ma ten gatunek.`,
                  [{ text: "OK" }],
                );
              }
            } catch (error) {
              console.error("Błąd podczas usuwania gatunku:", error);
              Alert.alert("Błąd", "Wystąpił błąd podczas usuwania gatunku.", [
                { text: "OK" },
              ]);
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  const handleEdit = (species: { label: string; value: number }) => {
    // setEditingSpecies(species);
    // setCustomInput(species.label);
    // setSelectedSpeciesValue(species.value);
    console.log("Edit species:", species);
  };

  return (
    <View style={styles(currentTheme)["species-manager"]}>
      <ThemedText style={styles(currentTheme)["species-manager__title"]}>
        Gatunki pająków
      </ThemedText>

      <View style={styles(currentTheme)["species-manager__search"]}>
        <ThemedText
          style={styles(currentTheme)["species-manager__search-label"]}
        >
          Wyszukaj gatunek:
        </ThemedText>
        <View
          style={
            styles(currentTheme)["species-manager__search-input-container"]
          }
        >
          <AutocompleteSpeciesInput
            value={selectedSpeciesValue}
            onSelect={setSelectedSpeciesValue}
            onCustomInput={setCustomInput}
            theme={currentTheme}
          />
        </View>

        {showAddButton && customInput.trim() !== "" && (
          <TouchableOpacity
            style={styles(currentTheme)["species-manager__add-button"]}
            onPress={handleAddSpecies}
          >
            <ThemedText
              style={styles(currentTheme)["species-manager__add-button-text"]}
            >
              Dodaj gatunek "{customInput}"
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles(currentTheme)["species-manager__list-section"]}>
        <ThemedText style={styles(currentTheme)["species-manager__list-title"]}>
          Lista gatunków:
        </ThemedText>

        <FlatList
          data={filteredSpecies}
          renderItem={({ item }) => (
            <View style={styles(currentTheme)["species-manager__species-item"]}>
              <ThemedText
                style={styles(currentTheme)["species-manager__species-name"]}
              >
                {item.label}
              </ThemedText>
              <TouchableOpacity
                style={styles(currentTheme)["species-manager__edit-button"]}
                onPress={() => handleEdit(item)}
              >
                <Feather
                  name="edit-2"
                  size={20}
                  color={Colors[currentTheme].tint}
                  style={
                    styles(currentTheme)["species-manager__delete-button-text"]
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles(currentTheme)["species-manager__delete-button"]}
                onPress={() => handleDelete(item)}
              >
                <Feather
                  name="trash-2"
                  size={20}
                  color={Colors[currentTheme].warning.text}
                  style={
                    styles(currentTheme)["species-manager__delete-button-text"]
                  }
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.value.toString()}
          style={styles(currentTheme)["species-manager__species-list"]}
          ListEmptyComponent={
            <ThemedText
              style={styles(currentTheme)["species-manager__empty-list-text"]}
            >
              {customInput
                ? "Nie znaleziono gatunków"
                : "Brak gatunków na liście"}
            </ThemedText>
          }
        />

        <Button title="Powrót" onPress={() => router.back()} color="#2196F3" />
      </View>
    </View>
  );
}

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    "species-manager": {
      flex: 1,
      padding: 16,
      backgroundColor: Colors[theme].card.backgroundColor,
    },
    "species-manager__title": {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    "species-manager__search": {
      marginBottom: 20,
    },
    "species-manager__search-label": {
      fontSize: 18,
      marginBottom: 8,
    },
    "species-manager__search-input-container": {
      marginBottom: 10,
    },
    "species-manager__add-button": {
      backgroundColor: "#4CAF50",
      padding: 12,
      borderRadius: 4,
      alignItems: "center",
      marginBottom: 10,
    },
    "species-manager__add-button-text": {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    "species-manager__list-section": {
      flex: 1,
    },
    "species-manager__list-title": {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    "species-manager__species-list": {
      flex: 1,
      marginBottom: 15,
    },
    "species-manager__species-item": {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    "species-manager__species-name": {
      fontSize: 16,
      flex: 1,
    },
    "species-manager__actions": {
      flexDirection: "row",
      alignItems: "center",
    },
    "species-manager__edit-button": {
      backgroundColor: Colors[theme].tint,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      marginRight: 8,
    },
    "species-manager__edit-button-text": {
      color: "#FFFFFF",
    },
    "species-manager__delete-button": {
      backgroundColor: "#F44336",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
    },
    "species-manager__delete-button-text": {
      color: "#FFFFFF",
    },
    "species-manager__empty-list-text": {
      textAlign: "center",
      fontStyle: "italic",
      marginTop: 20,
    },
  });
