import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSpiderSpeciesStore } from "@/store/spiderSpeciesStore";
import AutocompleteSpeciesInput from "@/components/ui/AutocompleteSpeciesInput";
import { useUserStore } from "@/store/userStore";

export default function SpiderSpeciesManager() {
  const { species, speciesOptions, fetchSpecies, addSpeciesToDb } =
    useSpiderSpeciesStore();
  const { currentTheme } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddButton, setShowAddButton] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const router = useRouter();

  const filteredSpecies = searchQuery
    ? speciesOptions.filter((species) =>
        species.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : speciesOptions;

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setShowAddButton(false);
      return;
    }

    const speciesExists = speciesOptions.some(
      (species) => species.label.toLowerCase() === searchQuery.toLowerCase(),
    );

    setShowAddButton(!speciesExists);
  }, [searchQuery, speciesOptions]);

  const handleAddSpecies = () => {
    if (searchQuery.trim() === "") return;

    addSpeciesToDb(searchQuery);
    setMessageText(
      `Gatunek "${searchQuery}" został pomyślnie dodany do listy!`,
    );
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    setSearchQuery("");
  };

  const handleDelete = (species: any) => {
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
          onPress: () => {
            removeSpecies(species.value);
            setMessageText(
              `Gatunek "${species.label}" został usunięty z listy!`,
            );
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gatunki pająków</Text>

      <View style={styles.searchSection}>
        <Text style={styles.searchLabel}>Wyszukaj gatunek:</Text>
        <View style={styles.searchInputContainer}>
          <AutocompleteSpeciesInput
            value={searchQuery}
            onSelect={setSearchQuery}
            theme={currentTheme}
          />
        </View>

        {showAddButton && searchQuery.trim() !== "" && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddSpecies}>
            <Text style={styles.addButtonText}>
              Dodaj gatunek "{searchQuery}"
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {showSuccessMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>{messageText}</Text>
        </View>
      )}

      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Lista gatunków:</Text>

        <FlatList
          data={filteredSpecies}
          renderItem={({ item }) => (
            <View style={styles.speciesItem}>
              <Text style={styles.speciesName}>{item.label}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.deleteButtonText}>Usuń</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.value}
          style={styles.speciesList}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>
              {searchQuery
                ? "Nie znaleziono gatunków"
                : "Brak gatunków na liście"}
            </Text>
          }
        />

        <Button title="Powrót" onPress={() => router.back()} color="#2196F3" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchSection: {
    marginBottom: 20,
  },
  searchLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  searchInputContainer: {
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  successMessage: {
    backgroundColor: "#DFF2BF",
    borderColor: "#4CAF50",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  successText: {
    color: "#4CAF50",
  },
  listSection: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  speciesList: {
    flex: 1,
    marginBottom: 15,
  },
  speciesItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  speciesName: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#FFFFFF",
  },
  emptyListText: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
});
