import { useEffect, useState } from "react";
import {
  TextInput,
  Alert,
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { parse } from "date-fns";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";

import { IndividualType } from "@/models/Spider.model";
import { Colors, ThemeType } from "@/constants/Colors";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import {
  feedingFrequencyOptions,
  individualTypeOptions,
} from "./SpiderForm.constants";

import CardComponent from "@/components/ui/CardComponent";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";
import AutocompleteSpeciesInput from "@/components/ui/AutocompleteSpeciesInput";
import { ThemedText } from "@/components/ui/ThemedText";

import SpiderImage from "@/components/commons/SpiderImage/SpiderImage";
import { useSpiderSpeciesStore } from "@/store/spiderSpeciesStore";
import {
  addDocumentToSpider,
  addFeedingEntry,
  addMoltingEntry,
  Spider,
} from "@/db/database";

export default function SpiderForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { currentTheme } = useUserStore();
  const spiders = useSpidersStore((state: any) => state.spiders) as Spider[];
  const addNewSpider = useSpidersStore((state: any) => state.addNewSpider);
  const updateSpider = useSpidersStore((state: any) => state.updateSpider);
  const { addSpeciesToDb } = useSpiderSpeciesStore();
  const speciesOptions = useSpiderSpeciesStore((state) => state.speciesOptions);
  const species = useSpiderSpeciesStore((state) => state.species);

  const [name, setName] = useState<string>();
  const [age, setAge] = useState<number>();
  const [lastFed, setLastFed] = useState<string>();
  const [feedingFrequency, setFeedingFrequency] = useState<string>();
  const [lastMolt, setLastMolt] = useState<string>();
  // const [spiderSpecies, setSpiderSpecies] = useState<string>("");
  const [spiderSpecies, setSpiderSpecies] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeDateField, setActiveDateField] = useState<
    "lastFed" | "lastMolt" | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [documentUri, setDocumentUri] = useState<string>();
  const [individualType, setIndividualType] = useState<
    IndividualType | undefined
  >();

  useEffect(() => {
    console.log("Fetched species:", species);
    console.log("Species options:", speciesOptions);
  }, []);

  useEffect(() => {
    if (id) {
      const spiderToEdit = spiders.find((s) => s.id === id);
      console.log("Spider to edit:", spiderToEdit?.spiderSpecies);
      if (spiderToEdit) {
        setName(spiderToEdit.name);
        setAge(spiderToEdit.age);
        setSpiderSpecies(spiderToEdit.spiderSpecies);
        setIndividualType(spiderToEdit.individualType as IndividualType);
        setLastFed(spiderToEdit.lastFed);
        setFeedingFrequency(spiderToEdit.feedingFrequency);
        setLastMolt(spiderToEdit.lastMolt);
        setImageUri(spiderToEdit.imageUri);
      }
    } else {
      setName("");
      setAge(0);
      setSpiderSpecies(null);
      setIndividualType(undefined);
      setLastFed("");
      setFeedingFrequency("");
      setLastMolt("");
      setImageUri(undefined);
    }
  }, [id, spiders]);

  const handleSubmit = async () => {
    console.log("Submitting spider data...");
    console.log(
      name,
      age,
      spiderSpecies,
      individualType,
      lastFed,
      feedingFrequency,
      lastMolt,
      imageUri,
    );
    if (
      !name?.trim() ||
      !age ||
      !spiderSpecies ||
      !lastFed?.trim() ||
      !feedingFrequency?.trim() ||
      !lastMolt?.trim()
    ) {
      return Alert.alert("Błąd walidacji", "Uzupełnij wszystkie pola.");
    }

    const speciesExists = speciesOptions.some(
      (species) => species.value === spiderSpecies,
    );

    if (!speciesExists) {
      return Alert.alert("Błąd", "Wybrany gatunek nie istnieje w bazie.");
    }

    const existingSpider = id ? spiders.find((s) => s.id === id) : null;

    const spiderData = {
      id: id ? id : Date.now().toString(),
      name,
      age,
      spiderSpecies,
      individualType,
      lastFed: lastFed,
      feedingFrequency: feedingFrequency as FeedingFrequency,
      lastMolt: lastMolt,
      imageUri: imageUri || "",
      documentUri: documentUri || "",
      isFavourite: existingSpider?.isFavourite ?? false,
    };

    if (id) {
      updateSpider(spiderData);
      Alert.alert("Sukces", `Zaktualizowano pająka o imieniu ${name}!`);
    } else {
      await addNewSpider({
        ...spiderData,
        status: "",
        nextFeedingDate: "",
      });
      await addFeedingEntry(spiderData.id, lastFed);
      await addMoltingEntry(spiderData.id, lastMolt);
      await addDocumentToSpider(spiderData.id, spiderData.documentUri);
      Alert.alert("Sukces", `Dodano pająka o imieniu ${name}!`);
    }

    clearForm();
  };

  const clearForm = () => {
    setName("");
    setAge(0);
    setSpiderSpecies(null);
    setIndividualType(undefined);
    setLastFed("");
    setFeedingFrequency("");
    setLastMolt("");
    setImageUri(undefined);
  };

  const handleChooseImage = async () => {
    const galleryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryPermission.status !== "granted") {
      Alert.alert("Brak uprawnień", "Nie masz dostępu do galerii.");
      return;
    }

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== "granted") {
      Alert.alert("Brak uprawnień", "Nie masz dostępu do kamery.");
      return;
    }

    Alert.alert(
      "Wybierz opcję",
      "Chcesz zrobić zdjęcie czy wybrać z galerii?",
      [
        {
          text: "Zrób zdjęcie",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!result.canceled) {
              setImageUri(result.assets[0].uri);
            }
          },
        },
        {
          text: "Wybierz z galerii",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!result.canceled) {
              setImageUri(result.assets[0].uri);
            }
          },
        },
      ],
    );
  };

  const handleChooseDocument = () => {
    Alert.alert("Wybierz źródło", "Dołącz dokument pochodzenia", [
      {
        text: "Zrób zdjęcie",
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (permission.status !== "granted") {
            Alert.alert("Brak uprawnień", "Nie masz dostępu do kamery.");
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled) {
            setDocumentUri(result.assets[0].uri);
          }
        },
      },
      {
        text: "Wybierz z galerii",
        onPress: async () => {
          const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permission.status !== "granted") {
            Alert.alert("Brak uprawnień", "Nie masz dostępu do galerii.");
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled) {
            setDocumentUri(result.assets[0].uri);
          }
        },
      },
      {
        text: "Anuluj",
        style: "cancel",
      },
    ]);
  };

  const parseDate = (dateStr: string): Date => {
    return parse(dateStr, "yyyy-MM-dd", new Date());
  };

  const showDatePicker = (field: "lastFed" | "lastMolt") => {
    setActiveDateField(field);

    const dateToSet =
      field === "lastFed" && lastFed
        ? parseDate(lastFed)
        : field === "lastMolt" && lastMolt
          ? parseDate(lastMolt)
          : new Date();

    setSelectedDate(dateToSet);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveDateField(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <CardComponent>
          <View style={styles(currentTheme).centered}>
            <ThemedText style={styles(currentTheme).subHeaderText}>
              Uzupełnij informacje o pająku
            </ThemedText>
          </View>

          <ThemedText style={styles(currentTheme).label}>
            Zdjęcie pająka
          </ThemedText>

          <TouchableOpacity
            onPress={handleChooseImage}
            activeOpacity={0.8}
            style={styles(currentTheme).imageWrapper}
          >
            <SpiderImage size={100} imageUri={imageUri} />
          </TouchableOpacity>

          <ThemedText style={styles(currentTheme).label}>Imię</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles(currentTheme).input}
            placeholder="Zyzio"
            placeholderTextColor={Colors[currentTheme].input.placeholder}
            autoCapitalize="words"
          />

          <ThemedText style={styles(currentTheme)["label"]}>
            Wiek "L"
          </ThemedText>
          <TextInput
            value={age?.toString() ?? "0"}
            onChangeText={(text) => {
              const parsedAge = parseInt(text, 10);
              if (isNaN(parsedAge)) {
                setAge(0);
              } else {
                setAge(parsedAge);
              }
            }}
            keyboardType="numeric"
            style={styles(currentTheme).input}
            placeholder="0"
          />

          <ThemedText style={styles(currentTheme).label}>Gatunek</ThemedText>
          <View style={styles(currentTheme).pickerWrapper}>
            <AutocompleteSpeciesInput
              value={spiderSpecies}
              onSelect={(value) => {
                console.log("Selected species:", value);
                setSpiderSpecies(value);
              }}
              theme={currentTheme}
            />
          </View>

          <ThemedText style={styles(currentTheme).label}>Płeć</ThemedText>
          <View style={styles(currentTheme).pickerWrapper}>
            {individualTypeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() =>
                  setIndividualType(option.value as IndividualType)
                }
                style={[
                  styles(currentTheme).radioButton,
                  individualType === option.value &&
                    styles(currentTheme).selectedRadioButton,
                ]}
              >
                <ThemedText
                  style={
                    individualType === option.value
                      ? styles(currentTheme).selectedText
                      : undefined
                  }
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <ThemedText style={styles(currentTheme).label}>
            Data ostatniego karmienia
          </ThemedText>
          <TouchableOpacity
            onPress={() => showDatePicker("lastFed")}
            style={styles(currentTheme).input}
          >
            <ThemedText>{lastFed || "Wybierz datę"}</ThemedText>
          </TouchableOpacity>

          {isDatePickerVisible && activeDateField === "lastFed" && (
            <ThemedDatePicker
              isVisible={isDatePickerVisible}
              initialDate={selectedDate}
              maximumDate={new Date()}
              onConfirm={(formattedDate) => {
                setLastFed(formattedDate);
                hideDatePicker();
              }}
              onCancel={hideDatePicker}
            />
          )}
          <ThemedText style={styles(currentTheme).label}>
            Data ostatniego linienia
          </ThemedText>
          <TouchableOpacity
            onPress={() => showDatePicker("lastMolt")}
            style={styles(currentTheme).input}
          >
            <ThemedText>{lastMolt || "Wybierz datę"}</ThemedText>
          </TouchableOpacity>

          {isDatePickerVisible && activeDateField === "lastMolt" && (
            <ThemedDatePicker
              isVisible={isDatePickerVisible}
              initialDate={selectedDate}
              maximumDate={new Date()}
              onConfirm={(formattedDate) => {
                setLastMolt(formattedDate);
                hideDatePicker();
              }}
              onCancel={hideDatePicker}
            />
          )}

          <ThemedText style={styles(currentTheme).label}>
            Częstotliwość karmienia
          </ThemedText>
          <View style={styles(currentTheme).pickerWrapper}>
            {feedingFrequencyOptions.map((option) => {
              const isSelected = feedingFrequency === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setFeedingFrequency(option.value)}
                  style={[
                    styles(currentTheme).radioButton,
                    isSelected && styles(currentTheme).selectedRadioButton,
                  ]}
                >
                  <ThemedText
                    style={
                      isSelected ? styles(currentTheme).selectedText : undefined
                    }
                  >
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          <ThemedText style={styles(currentTheme).label}>
            Dokument pochodzenia pająka (zdjęcie)
          </ThemedText>

          <TouchableOpacity
            onPress={handleChooseDocument}
            activeOpacity={0.8}
            style={styles(currentTheme).filePicker}
          >
            <ThemedText>
              {documentUri ? "Wybrano dokument" : "Wybierz dokument"}
            </ThemedText>
          </TouchableOpacity>

          <Pressable style={styles(currentTheme).button} onPress={handleSubmit}>
            <ThemedText style={styles(currentTheme).buttonText}>
              Zapisz pająka
            </ThemedText>
          </Pressable>
        </CardComponent>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
/* eslint-disable react-native/no-unused-styles */
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
      marginTop: 16,
    },
    centered: {
      alignItems: "center",
      marginBottom: 24,
    },
    pickerWrapper: {},
    button: {
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      backgroundColor: Colors[theme].tint,
      marginTop: 24,
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
    radioButton: {
      padding: 12,
      marginBottom: 12,
      borderRadius: 6,
      borderWidth: 0.5,
      borderColor: Colors[theme].card.borderColor,
      alignItems: "center",
    },
    selectedRadioButton: {
      backgroundColor: "#4CAF50",
    },

    selectedText: {
      color: "#fff",
      fontWeight: "bold",
    },

    filePicker: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      alignItems: "center",
    },

    pickerOption: {
      padding: 10,
      marginRight: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ccc",
    },
    selectedOption: {
      backgroundColor: "#ddd",
      borderColor: "#666",
    },
  });
