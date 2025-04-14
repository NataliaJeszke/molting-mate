import { useEffect, useState } from "react";
import {
  TextInput,
  Alert,
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";

import { Colors, ThemeType } from "@/constants/Colors";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import {
  spiderTypesOptions,
  spiderSpeciesByType,
  feedingFrequencyOptions,
} from "./SpiderForm.constants";

import CardComponent from "@/components/ui/CardComponent";
import ThemedPicker from "@/components/ui/ThemedPicker";
import { ThemedText } from "@/components/ui/ThemedText";
import { SpiderImage } from "@/components/commons/SpiderImage/SpiderImage";
import { useLocalSearchParams } from "expo-router";

export default function SpiderForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { currentTheme } = useUserStore();
  const { addSpider, updateSpider, spiders } = useSpidersStore();

  const [name, setName] = useState<string>();
  const [age, setAge] = useState<string>();
  const [lastFed, setLastFed] = useState<string>();
  const [feedingFrequency, setFeedingFrequency] = useState<string>();
  const [lastMolt, setLastMolt] = useState<string>();
  const [spiderType, setSpiderType] = useState<string>();
  const [spiderSpecies, setSpiderSpecies] = useState<string>();
  const [imageUri, setImageUri] = useState<string>();

  useEffect(() => {
    if (id) {
      const spiderToEdit = spiders.find((s) => s.id === id);
      if (spiderToEdit) {
        setName(spiderToEdit.name);
        setAge(spiderToEdit.age);
        setSpiderType(spiderToEdit.spiderType);
        setSpiderSpecies(spiderToEdit.spiderSpecies);
        setLastFed(spiderToEdit.lastFed);
        setFeedingFrequency(spiderToEdit.feedingFrequency);
        setLastMolt(spiderToEdit.lastMolt);
        setImageUri(spiderToEdit.imageUri);
      }
    }
  }, [id]);

  const handleSubmit = () => {
    if (
      !name?.trim() ||
      !age?.trim() ||
      !spiderType?.trim() ||
      !spiderSpecies?.trim() ||
      !lastFed?.trim() ||
      !feedingFrequency?.trim() ||
      !lastMolt?.trim()
    ) {
      return Alert.alert("Błąd walidacji", "Uzupełnij wszystkie pola.");
    }
  
    const spiderData = {
      id: id || Date.now().toString(),
      name,
      age,
      spiderType,
      spiderSpecies,
      lastFed,
      feedingFrequency: feedingFrequency as FeedingFrequency,
      lastMolt,
      imageUri: imageUri || "",
      isFavourite: false,
    };
  
    if (id) {
      updateSpider(id, spiderData);
      Alert.alert("Sukces", `Zaktualizowano pająka o imieniu ${name}!`);
    } else {
      addSpider(spiderData);
      Alert.alert("Sukces", `Dodano pająka o imieniu ${name}!`);
    }
  
    clearForm();
  };
  

  const clearForm = () => {
    setName("");
    setAge("");
    setSpiderType("");
    setSpiderSpecies("");
    setLastFed("");
    setFeedingFrequency("");
    setLastMolt("");
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

  return (
    <CardComponent>
      <View style={styles(currentTheme)["centered"]}>
        <ThemedText style={styles(currentTheme)["subHeaderText"]}>
          Uzupełnij informacje o pająku
        </ThemedText>
      </View>

      <ThemedText style={styles(currentTheme).label}>Zdjęcie pająka</ThemedText>

      <TouchableOpacity
        onPress={handleChooseImage}
        activeOpacity={0.8}
        style={styles(currentTheme).imageWrapper}
      >
        <SpiderImage imageUri={imageUri} />
      </TouchableOpacity>

      <ThemedText style={styles(currentTheme)["label"]}>Imię</ThemedText>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles(currentTheme)["input"]}
        placeholder="Zyzio"
        placeholderTextColor={Colors[currentTheme].input.placeholder}
        autoCapitalize="words"
      />

      <ThemedText style={styles(currentTheme)["label"]}>Wiek</ThemedText>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={styles(currentTheme)["input"]}
        placeholder="L1"
        placeholderTextColor={Colors[currentTheme].input.placeholder}
      />

      <ThemedText style={styles(currentTheme)["label"]}>
        Rodzina i gatunek
      </ThemedText>
      <View style={styles(currentTheme)["pickerWrapper"]}>
        <ThemedPicker
          label="Wybierz rodzinę"
          selectedValue={spiderType || ""}
          onValueChange={(value) => {
            setSpiderType(value);
            setSpiderSpecies("");
          }}
          options={spiderTypesOptions}
          theme={currentTheme}
        />
        <ThemedPicker
          label="Wybierz gatunek"
          selectedValue={spiderSpecies || ""}
          onValueChange={(value) => setSpiderSpecies(value)}
          options={getSpeciesForType(spiderType || "")}
          theme={currentTheme}
        />
      </View>

      <ThemedText style={styles(currentTheme)["label"]}>
        Ostatnio karmiony
      </ThemedText>
      <TextInput
        value={lastFed}
        onChangeText={setLastFed}
        style={styles(currentTheme)["input"]}
        placeholder="dd-mm-rrrr"
        placeholderTextColor={Colors[currentTheme].input.placeholder}
      />

      <ThemedText style={styles(currentTheme)["label"]}>
        Częstotliwość karmienia
      </ThemedText>
      <View style={styles(currentTheme)["pickerWrapper"]}>
        <ThemedPicker
          label="Wybierz częstotliwość karmienia"
          selectedValue={feedingFrequency || ""}
          onValueChange={(value) => setFeedingFrequency(value)}
          options={feedingFrequencyOptions}
          theme={currentTheme}
        />
      </View>

      <ThemedText style={styles(currentTheme)["label"]}>
        Data ostatniego linienia
      </ThemedText>
      <TextInput
        value={lastMolt}
        onChangeText={setLastMolt}
        style={styles(currentTheme)["input"]}
        placeholder="dd-mm-rrrr"
        placeholderTextColor={Colors[currentTheme].input.placeholder}
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
      fontSize: 16,
      marginBottom: 8,
      fontWeight: "bold",
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
      borderColor: Colors[theme].picker.borderColor,
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
    imageWrapper: {
      alignItems: "center",
      marginBottom: 24,
    },
  });
