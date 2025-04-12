import {
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  View,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";

export default function NewSpiderScreen() {
  const [name, setName] = useState<string>();
  const [age, setAge] = useState<string>();
  const [origin, setOrigin] = useState<string>();
  const [lastFed, setLastFed] = useState<string>();
  const [feedingFrequency, setFeedingFrequency] = useState<string>();
  const [lastMolt, setLastMolt] = useState<string>();

  const handleSubmit = () => {
    if (
      !name ||
      !age ||
      !origin ||
      !lastFed ||
      !feedingFrequency ||
      !lastMolt
    ) {
      return Alert.alert("Błąd walidacji", "Uzupełnij wszystkie pola.");
    }

    console.log("Nowy pająk:", {
      name,
      age,
      origin,
      lastFed,
      feedingFrequency,
      lastMolt,
    });

    Alert.alert("Sukces", `Dodano pająka o imieniu ${name}!`);
  };

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.centered}>
        <ThemedText style={[styles.headerText]}>Dodaj nowego pająka</ThemedText>
        <ThemedText style={[styles.subHeaderText]}>
          Uzupełnij informacje o pająku
        </ThemedText>
      </View>

      <ThemedText style={[styles.label]}>Imię</ThemedText>
      <TextInput
        value={name}
        onChangeText={setName}
        style={[styles.input, { borderColor: Colors.light.tint }]}
        placeholder="Zyzio"
        placeholderTextColor={Colors.light.icon}
        autoCapitalize="words"
      />

      <ThemedText style={[styles.label, { color: Colors.light.text }]}>
        Wiek
      </ThemedText>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={[styles.input, { borderColor: Colors.light.tint }]}
        placeholder="L1"
        placeholderTextColor={Colors.light.icon}
      />

      <ThemedText style={[styles.label]}>Pochodzenie</ThemedText>
      <Picker
        selectedValue={origin}
        onValueChange={(itemValue) => setOrigin(itemValue)}
        style={[styles.picker, { borderColor: Colors.light.tint }]}
      >
        <Picker.Item label="Wybierz..." value="" />
        <Picker.Item label="Ameryka Północna" value="north_america" />
        <Picker.Item label="Ameryka Południowa" value="south_america" />
        <Picker.Item label="Obie Ameryki" value="both_americas" />
        <Picker.Item label="Australia" value="australia" />
        <Picker.Item label="Azja" value="asia" />
        <Picker.Item label="Europa" value="europe" />
      </Picker>

      <ThemedText style={[styles.label]}>Ostatnio karmiony</ThemedText>
      <TextInput
        value={lastFed}
        onChangeText={setLastFed}
        style={[styles.input, { borderColor: Colors.light.tint }]}
        placeholder="dd-mm-rrrr"
        placeholderTextColor={Colors.light.icon}
      />

      <ThemedText style={[styles.label]}>Częstotliwość karmienia</ThemedText>
      <Picker
        selectedValue={feedingFrequency}
        onValueChange={(itemValue) => setFeedingFrequency(itemValue)}
        style={[styles.picker, { borderColor: Colors.light.tint }]}
      >
        <Picker.Item label="Wybierz..." value="" />
        <Picker.Item label="Kilka razy w tygodniu" value="few_times_week" />
        <Picker.Item label="Raz w tygodniu" value="once_week" />
        <Picker.Item label="Raz na dwa tygodnie" value="once_two_weeks" />
        <Picker.Item label="Dwa razy w miesiącu" value="twice_month" />
        <Picker.Item label="Raz w miesiącu" value="once_month" />
        <Picker.Item label="Rzadziej" value="rarely" />
      </Picker>

      <ThemedText style={[styles.label]}>Data ostatniego linienia</ThemedText>
      <TextInput
        value={lastMolt}
        onChangeText={setLastMolt}
        style={[styles.input, { borderColor: Colors.light.tint }]}
        placeholder="dd-mm-rrrr"
        placeholderTextColor={Colors.light.icon}
      />

      <Pressable
        style={[styles.button, { backgroundColor: Colors.light.tint }]}
        onPress={handleSubmit}
      >
        <ThemedText style={styles.buttonText}>Zapisz pająka</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  input: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 6,
    marginBottom: 24,
    fontSize: 18,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  centered: {
    alignItems: "center",
    marginBottom: 24,
  },
  picker: {
    borderWidth: 2,
    borderRadius: 6,
    marginBottom: 24,
    fontSize: 18,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
  },
  headerText: {
    fontSize: 24,
  },
  subHeaderText: {
    fontSize: 16,
  },
});
