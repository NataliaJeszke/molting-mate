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
  
  export default function NewSpiderScreen() {
    const [name, setName] = useState<string>();
    const [age, setAge] = useState<string>();
    const [origin, setOrigin] = useState<string>();
    const [lastFed, setLastFed] = useState<string>();
    const [feedingFrequency, setFeedingFrequency] = useState<string>();
    const [lastMolt, setLastMolt] = useState<string>();
  
    const handleSubmit = () => {
      if (!name || !age || !origin || !lastFed || !feedingFrequency || !lastMolt) {
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
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.centered}>
          <Text style={{ fontSize: 24 }}>Dodaj nowego pająka</Text>
          <Text style={{ fontSize: 16 }}>
            Uzupełnij informacje o pająku
          </Text>
        </View>
  
        <Text style={styles.label}>Imię</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Zyzio"
          autoCapitalize="words"
        />
  
        <Text style={styles.label}>Wiek</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          style={styles.input}
          placeholder="L1"
        />
  
        <Text style={styles.label}>Pochodzenie</Text>
        <Picker
          selectedValue={origin}
          onValueChange={(itemValue) => setOrigin(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Wybierz..." value="" />
          <Picker.Item label="Ameryka Północna" value="north_america" />
          <Picker.Item label="Ameryka Południowa" value="south_america" />
          <Picker.Item label="Obie Ameryki" value="both_americas" />
          <Picker.Item label="Australia" value="australia" />
          <Picker.Item label="Azja" value="asia" />
          <Picker.Item label="Europa" value="europe" />
        </Picker>
  
        <Text style={styles.label}>Ostatnio karmiony</Text>
        <TextInput
          value={lastFed}
          onChangeText={setLastFed}
          style={styles.input}
          placeholder="dd-mm-rrrr"
        />
  
        <Text style={styles.label}>Częstotliwość karmienia</Text>
        <Picker
          selectedValue={feedingFrequency}
          onValueChange={(itemValue) => setFeedingFrequency(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Wybierz..." value="" />
          <Picker.Item label="Kilka razy w tygodniu" value="few_times_week" />
          <Picker.Item label="Raz w tygodniu" value="once_week" />
          <Picker.Item label="Raz na dwa tygodnie" value="once_two_weeks" />
          <Picker.Item label="Dwa razy w miesiącu" value="twice_month" />
          <Picker.Item label="Raz w miesiącu" value="once_month" />
          <Picker.Item label="Rzadziej" value="rarely" />
        </Picker>
  
        <Text style={styles.label}>Data ostatniego linienia</Text>
        <TextInput
          value={lastMolt}
          onChangeText={setLastMolt}
          style={styles.input}
          placeholder="dd-mm-rrrr"
        />
  
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Zapisz pająka</Text>
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
      backgroundColor: "#222",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
    },
  });
  