import { useState } from "react";
import {
    TextInput,
    Alert,
    View,
    Pressable,
    StyleSheet,
  } from "react-native";
  import { Picker } from "@react-native-picker/picker";

  import { useUserStore } from "@/store/userStore";
  
  import { Colors, ThemeType } from "@/constants/Colors";
  import { ThemedText } from "@/components/ui/ThemedText";
  import CardComponent from "@/components/ui/CardComponent";
  
  type PickerItemProps = {
    label: string;
    value: string;
    color?: string;
    style?: object;
  };
  
  type PickerOption = {
    label: string;
    value: string;
  };
  
  export default function NewSpiderForm() {
    const [name, setName] = useState<string>();
    const [age, setAge] = useState<string>();
    const [origin, setOrigin] = useState<string>();
    const [lastFed, setLastFed] = useState<string>();
    const [feedingFrequency, setFeedingFrequency] = useState<string>();
    const [lastMolt, setLastMolt] = useState<string>();
  
    const { currentTheme } = useUserStore();
  
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
  
      Alert.alert("Sukces", `Dodano pająka o imieniu ${name}!`);
    };
  
    const ThemedPickerItem = ({ label, value }: PickerItemProps) => (
      <Picker.Item label={label} value={value} />
    );
  
    const originOptions: PickerOption[] = [
      { label: "Wybierz...", value: "" },
      { label: "Ameryka Północna", value: "north_america" },
      { label: "Ameryka Południowa", value: "south_america" },
      { label: "Obie Ameryki", value: "both_americas" },
      { label: "Australia", value: "australia" },
      { label: "Azja", value: "asia" },
      { label: "Europa", value: "europe" },
    ];
  
    const feedingFrequencyOptions = [
      { label: "Wybierz...", value: "" },
      { label: "Kilka razy w tygodniu", value: "few_times_week" },
      { label: "Raz w tygodniu", value: "once_week" },
      { label: "Raz na dwa tygodnie", value: "once_two_weeks" },
      { label: "Dwa razy w miesiącu", value: "twice_month" },
      { label: "Raz w miesiącu", value: "once_month" },
      { label: "Rzadziej", value: "rarely" },
    ];
  
    return (
          <CardComponent>
            <View style={styles(currentTheme)["centered"]}>
              <ThemedText style={styles(currentTheme)["subHeaderText"]}>
                Uzupełnij informacje o pająku
              </ThemedText>
            </View>
  
            <ThemedText style={styles(currentTheme)["label"]}>Imię</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles(currentTheme)["input"]}
              placeholder="Zyzio"
              placeholderTextColor={styles(currentTheme)["input"].color}
              autoCapitalize="words"
            />
  
            <ThemedText style={styles(currentTheme)["label"]}>Wiek</ThemedText>
            <TextInput
              value={age}
              onChangeText={setAge}
              style={styles(currentTheme)["input"]}
              placeholder="L1"
              placeholderTextColor={styles(currentTheme)["input"].color}
            />
  
            <ThemedText style={styles(currentTheme)["label"]}>
              Pochodzenie
            </ThemedText>
            <View style={styles(currentTheme)["pickerWrapper"]}>
              <Picker
                selectedValue={origin}
                onValueChange={(itemValue) => setOrigin(itemValue)}
                dropdownIconColor={Colors[currentTheme].picker.text}
              >
                {originOptions.map((option) => {
                  console.log(
                    `Renderuję picker item: ${option.label}, kolor: ${Colors[currentTheme].picker.text}`
                  );
                  return (
                    <ThemedPickerItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={Colors[currentTheme].picker.text}
                      style={{ color: Colors[currentTheme].picker.text }}
                    />
                  );
                })}
              </Picker>
            </View>
  
            <ThemedText style={styles(currentTheme)["label"]}>
              Ostatnio karmiony
            </ThemedText>
            <TextInput
              value={lastFed}
              onChangeText={setLastFed}
              style={styles(currentTheme)["input"]}
              placeholder="dd-mm-rrrr"
              placeholderTextColor={Colors[currentTheme].icon}
            />
  
            <ThemedText style={styles(currentTheme)["label"]}>
              Częstotliwość karmienia
            </ThemedText>
            <View style={styles(currentTheme)["pickerWrapper"]}>
              <Picker
                selectedValue={origin}
                onValueChange={(itemValue) => setOrigin(itemValue)}
                dropdownIconColor={Colors[currentTheme].picker.text}
              >
                {feedingFrequencyOptions.map((option) => {
                  console.log(
                    `Renderuję picker item: ${option.label}, kolor: ${Colors[currentTheme].picker.text}`
                  );
                  return (
                    <ThemedPickerItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={Colors[currentTheme].picker.text}
                      style={{ color: Colors[currentTheme].picker.text }}
                    />
                  );
                })}
              </Picker>
            </View>
  
            <ThemedText style={styles(currentTheme)["label"]}>
              Data ostatniego linienia
            </ThemedText>
            <TextInput
              value={lastMolt}
              onChangeText={setLastMolt}
              style={styles(currentTheme)["input"]}
              placeholder="dd-mm-rrrr"
              placeholderTextColor={Colors[currentTheme].icon}
            />
  
            <Pressable
              style={styles(currentTheme)["button"]}
              onPress={handleSubmit}
            >
              <ThemedText style={styles(currentTheme)["buttonText"]}>
                Zapisz pająka
              </ThemedText>
            </Pressable>
          </CardComponent>
    );
  }
  
  const styles = (theme: ThemeType) =>
    StyleSheet.create({
      input: {
        borderWidth: 0.5,
        padding: 12,
        borderRadius: 6,
        marginBottom: 24,
        fontSize: 18,
        borderColor: Colors[theme].card.borderColor,
        color: Colors[theme].text,
      },
      label: {
        fontSize: 18,
        marginBottom: 8,
      },
      centered: {
        alignItems: "center",
        marginBottom: 24,
      },
      pickerWrapper: {
        borderWidth: 0.5,
        borderRadius: 6,
        marginBottom: 24,
        overflow: "hidden",
        borderColor: Colors[theme].tint,
        backgroundColor: Colors[theme].picker.background,
      },
      button: {
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: Colors[theme].tint,
      },
      buttonText: {
        fontSize: 18,
        color: Colors[theme].button.text.color,
      },
      subHeaderText: {
        fontSize: 16,
      },
    });
  