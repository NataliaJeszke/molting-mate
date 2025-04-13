import { useState } from "react";
import {
  TextInput,
  Alert,
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";

import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import {
  spiderTypesOptions,
  spiderSpeciesByType,
  feedingFrequencyOptions,
} from "./NewSpiderForm.constants";
import { SpiderImage } from "@/components/commons/SpiderImage/SpiderImage";
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
  const { currentTheme } = useUserStore();
  const { addSpider } = useSpidersStore();

  const [name, setName] = useState<string>();
  const [age, setAge] = useState<string>();
  const [lastFed, setLastFed] = useState<string>();
  const [feedingFrequency, setFeedingFrequency] = useState<string>();
  const [lastMolt, setLastMolt] = useState<string>();
  const [spiderType, setSpiderType] = useState<string>();
  const [spiderSpecies, setSpiderSpecies] = useState<string>();
  const [imageUri, setImageUri] = useState<string>();

  const handleSubmit = () => {
    if (
      !name ||
      !age ||
      !spiderType ||
      !spiderSpecies ||
      !lastFed ||
      !feedingFrequency ||
      !lastMolt
    ) {
      return Alert.alert("Błąd walidacji", "Uzupełnij wszystkie pola.");
    }
  
    const newSpider = {
      name,
      age,
      spiderType,
      spiderSpecies,
      lastFed,
      feedingFrequency,
      lastMolt,
      imageUri,
    };
  
    addSpider(newSpider);
    Alert.alert("Sukces", `Dodano pająka o imieniu ${name}!`);
  
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setAge('');
    setSpiderType('');
    setSpiderSpecies('');
    setLastFed('');
    setFeedingFrequency('');
    setLastMolt('');
    setImageUri(undefined);
  };

  const getSpeciesForType = (type: string) => {
    return (
      spiderSpeciesByType[type as keyof typeof spiderSpeciesByType] || [
        { label: "Brak dostępnych gatunków", value: "" },
      ]
    );
  };

  const handleChooseImage = async () => {
    if (Platform.OS === "web") {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const ThemedPickerItem = ({ label, value }: PickerItemProps) => (
    <Picker.Item label={label} value={value} />
  );

  return (
    <CardComponent>
      <View style={styles(currentTheme)["centered"]}>
        <ThemedText style={styles(currentTheme)["subHeaderText"]}>
          Uzupełnij informacje o pająku
        </ThemedText>
      </View>

      <ThemedText style={styles(currentTheme).label}>Zdjęcie pająka</ThemedText>

      <TouchableOpacity onPress={handleChooseImage} activeOpacity={0.8}>
        <SpiderImage imageUri={imageUri} />
      </TouchableOpacity>

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

      <ThemedText style={styles(currentTheme)["label"]}>Pochodzenie</ThemedText>
      <View style={styles(currentTheme)["pickerWrapper"]}>
        <Picker
          selectedValue={spiderType}
          onValueChange={(value) => {
            setSpiderType(value);
            setSpiderSpecies("");
          }}
        >
          {spiderTypesOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>

        <Picker
          selectedValue={spiderSpecies}
          onValueChange={(value) => setSpiderSpecies(value)}
        >
          {getSpeciesForType(spiderType || "").map((species: PickerOption) => (
            <Picker.Item
              key={species.value}
              label={species.label}
              value={species.value}
            />
          ))}
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
          selectedValue={feedingFrequency}
          onValueChange={(itemValue) => setFeedingFrequency(itemValue)}
          dropdownIconColor={Colors[currentTheme].picker.text}
        >
          {feedingFrequencyOptions.map((option) => {
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

      <Pressable style={styles(currentTheme)["button"]} onPress={handleSubmit}>
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
