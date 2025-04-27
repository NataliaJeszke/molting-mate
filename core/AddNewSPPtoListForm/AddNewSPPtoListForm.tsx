import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSpiderSpeciesStore } from "@/store/spiderSpeciesStore";

export default function AddNewSPPtoListForm() {
  const [newSpecies, setNewSpecies] = useState("");
  const addSpecies = useSpiderSpeciesStore((state) => state.addSpecies);
  const router = useRouter();

  const handleAdd = () => {
    if (newSpecies.trim() !== "") {
      addSpecies(newSpecies.trim());
      setNewSpecies("");
      router.back(); // wróć na Home po dodaniu
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dodaj nowy gatunek pająka:</Text>
      <TextInput
        style={styles.input}
        placeholder="Wpisz nazwę..."
        value={newSpecies}
        onChangeText={setNewSpecies}
      />
      <Button title="Dodaj gatunek" onPress={handleAdd} color="#4CAF50" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
});
