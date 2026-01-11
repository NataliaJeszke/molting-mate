import { useEffect, useRef, useState } from "react";
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
import { useSpiderSpeciesStore } from "@/store/spiderSpeciesStore";

import {
  addDocumentToSpider,
  addFeedingEntry,
  addMoltingEntry,
  Spider,
} from "@/db/database";

import { useTranslation } from "@/hooks/useTranslation";
import { useIndividualTypeOptions } from "@/hooks/useIndividualTypeOptions";
import { useFeedingFrequencyOptions } from "@/hooks/useFeedingFrequency";

import { Colors, ThemeType } from "@/constants/Colors";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { IndividualType } from "@/constants/IndividualType.enums";

import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";
import AutocompleteSpeciesInput from "@/components/ui/AutocompleteSpeciesInput";
import SpiderImage from "@/components/commons/SpiderImage/SpiderImage";

export default function SpiderForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t } = useTranslation();
  const individualTypeOptions = useIndividualTypeOptions();
  const feedingOptions = useFeedingFrequencyOptions();
  const { currentTheme } = useUserStore();

  // Use normalized store - access byId for efficient lookups
  const spiderById = useSpidersStore((state) => state.byId);
  const allIds = useSpidersStore((state) => state.allIds);
  const addNewSpider = useSpidersStore((state) => state.addNewSpider);
  const updateSpider = useSpidersStore((state) => state.updateSpider);
  const { addSpeciesToDb, speciesOptions } = useSpiderSpeciesStore();

  // Derive spiders array for compatibility
  const spiders = allIds.map((spiderId) => spiderById[spiderId]).filter(Boolean);

  const [name, setName] = useState<string>();
  const [age, setAge] = useState<number | null>(null);
  const [lastFed, setLastFed] = useState<string>();
  const [feedingFrequency, setFeedingFrequency] = useState<string>();
  const [lastMolt, setLastMolt] = useState<string>();
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
  const newSpeciesLabelRef = useRef<string | null>(null);

  useEffect(() => {
    if (id) {
      const spiderToEdit = spiders.find((s) => s.id === id);
      if (spiderToEdit) {
        setName(spiderToEdit.name);
        setAge(spiderToEdit.age);
        // Find species ID by name from speciesOptions
        const speciesMatch = speciesOptions.find(
          (s) => s.label === spiderToEdit.spiderSpecies,
        );
        setSpiderSpecies(speciesMatch ? speciesMatch.value : null);
        setIndividualType(spiderToEdit.individualType as IndividualType);
        setLastFed(spiderToEdit.lastFed);
        setFeedingFrequency(spiderToEdit.feedingFrequency);
        setLastMolt(spiderToEdit.lastMolt);
        setImageUri(spiderToEdit.imageUri);
      }
    } else {
      setName("");
      setAge(null);
      setSpiderSpecies(null);
      setIndividualType(undefined);
      setLastFed("");
      setFeedingFrequency("");
      setLastMolt("");
      setImageUri(undefined);
    }
  }, [id, spiders, speciesOptions]);

  const handleSubmit = async () => {
    let speciesId = spiderSpecies;

    if (newSpeciesLabelRef.current && !spiderSpecies) {
      const newLabel = newSpeciesLabelRef.current;
      try {
        speciesId = await addSpeciesToDb(newLabel);
        newSpeciesLabelRef.current = null;
      } catch {
        Alert.alert(t("submit.alert.error_species"));
        return;
      }
    }

    if (
      !name?.trim() ||
      !age ||
      !speciesId ||
      !lastFed?.trim() ||
      !feedingFrequency?.trim() ||
      !lastMolt?.trim()
    ) {
      return Alert.alert(
        t("spider-form.handle-submit.alert.error_validation"),
        t("spider-form.handle-submit.alert.error_validation_sub"),
      );
    }

    const existingSpider = id ? spiders.find((s) => s.id === id) : null;

    const spiderData = {
      id: id ? id : Date.now().toString(),
      name,
      age,
      spiderSpecies: speciesId,
      individualType,
      lastFed,
      feedingFrequency: feedingFrequency as FeedingFrequency,
      lastMolt,
      imageUri: imageUri || "",
      documentUri: documentUri || "",
      isFavourite: existingSpider?.isFavourite ?? false,
    };

    if (id) {
      // Cast to any to allow spiderSpecies as number (ID) - store handles conversion
      updateSpider(spiderData as any);
      Alert.alert(
        t("spider-form.handle-submit.alert.success"),
        `${t("spider-form.handle-submit.alert.success_sub")} "${name}"`,
      );
    } else {
      // Cast to any to allow spiderSpecies as number (ID) - store handles conversion
      await addNewSpider({
        ...spiderData,
        status: "",
        nextFeedingDate: "",
      } as any);
      await addFeedingEntry(spiderData.id, lastFed);
      await addMoltingEntry(spiderData.id, lastMolt);
      await addDocumentToSpider(spiderData.id, spiderData.documentUri);
      Alert.alert(
        t("spider-form.handle-submit.alert.success"),
        `${t("spider-form.handle-submit.alert.success_sub_add")} "${name}"`,
      );
    }

    clearForm();
  };

  const clearForm = () => {
    setName("");
    setAge(null);
    setSpiderSpecies(null);
    setIndividualType(undefined);
    setLastFed("");
    setFeedingFrequency("");
    setLastMolt("");
    setImageUri(undefined);
    setDocumentUri(undefined);
    newSpeciesLabelRef.current = null;
  };

  const handleChooseImage = async () => {
    const galleryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryPermission.status !== "granted") {
      Alert.alert(t("spider-form.handle-choose-image.alert.permission.denied"));
      return;
    }

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== "granted") {
      Alert.alert(t("spider-form.handle-choose-image.alert.permission.denied"));
      return;
    }

    Alert.alert(
      t("spider-form.handle-choose-image.alert.choose_option.title"),
      t("spider-form.handle-choose-image.alert.choose_option.info"),
      [
        {
          text: t("spider-form.handle-choose-image.alert.camera.title"),
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
          text: t("spider-form.handle-choose-image.alert.gallery.title"),
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
    Alert.alert(
      t("spider-form.handle-choose-document.alert.choose_source.title"),
      t("spider-form.handle-choose-document.alert.choose_source.info"),
      [
        {
          text: t("spider-form.handle-choose-document.alert.camera.title"),
          onPress: async () => {
            const permission =
              await ImagePicker.requestCameraPermissionsAsync();
            if (permission.status !== "granted") {
              Alert.alert(
                t("spider-form.handle-choose-document.alert.permission.denied"),
              );
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
          text: t("spider-form.handle-choose-document.alert.gallery.title"),
          onPress: async () => {
            const permission =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.status !== "granted") {
              Alert.alert(
                t("spider-form.handle-choose-document.alert.permission.denied"),
              );
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
          text: t("spider-form.handle-choose-document.alert.cancel"),
          style: "cancel",
        },
      ],
    );
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
        keyboardShouldPersistTaps="handled"
      >
        <CardComponent>
          <View style={styles(currentTheme).centered}>
            <ThemedText style={styles(currentTheme).subHeaderText}>
              {t("spider-form.title_form")}
            </ThemedText>
          </View>

          <ThemedText style={styles(currentTheme).label}>
            {t("spider-form.photo")}
          </ThemedText>

          <TouchableOpacity
            onPress={handleChooseImage}
            activeOpacity={0.8}
            style={styles(currentTheme).imageWrapper}
          >
            <SpiderImage size={100} imageUri={imageUri} />
          </TouchableOpacity>

          <ThemedText style={styles(currentTheme).label}>
            {" "}
            {t("spider-form.name")}
          </ThemedText>
          <TextInput
            defaultValue={name}
            onChangeText={(text) => {
              console.log("Name changed:", text);
              setName(text);
            }}
            style={styles(currentTheme).input}
            placeholder={t("spider-form.name_placeholder")}
            placeholderTextColor={Colors[currentTheme].input.placeholder}
            autoCapitalize="none"
          />

          <ThemedText style={styles(currentTheme)["label"]}>
            {t("spider-form.age")}
          </ThemedText>
          <TextInput
            value={age !== null ? age.toString() : ""}
            onChangeText={(text) => {
              if (text === "") {
                setAge(null);
              } else {
                const parsedAge = parseInt(text, 10);
                if (!isNaN(parsedAge)) {
                  setAge(parsedAge);
                }
              }
            }}
            keyboardType="numeric"
            style={styles(currentTheme).input}
            placeholder={t("spider-form.age_placeholder")}
            placeholderTextColor={Colors[currentTheme].input.placeholder}
          />

          <ThemedText style={styles(currentTheme).label}>
            {" "}
            {t("spider-form.species")}
          </ThemedText>
          <View style={styles(currentTheme).pickerWrapper}>
            <AutocompleteSpeciesInput
              value={spiderSpecies}
              onSelect={(value) => {
                setSpiderSpecies(value);
                newSpeciesLabelRef.current = null;
              }}
              onCustomInput={(text) => {
                newSpeciesLabelRef.current = text;
              }}
              theme={currentTheme}
            />
          </View>

          <ThemedText style={styles(currentTheme).label}>
            {" "}
            {t("spider-form.individual_type")}
          </ThemedText>
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
            {t("spider-form.date_last_feeding")}
          </ThemedText>
          <TouchableOpacity
            onPress={() => showDatePicker("lastFed")}
            style={styles(currentTheme).input}
          >
            <ThemedText>
              {lastFed || t("spider-form.date_last_feeding_placeholder")}
            </ThemedText>
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
            {t("spider-form.date_last_molting")}
          </ThemedText>
          <TouchableOpacity
            onPress={() => showDatePicker("lastMolt")}
            style={styles(currentTheme).input}
          >
            <ThemedText>
              {lastMolt || t("spider-form.date_last_molting_placeholder")}
            </ThemedText>
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
            {t("spider-form.feeding_frequency")}
          </ThemedText>

          <View style={styles(currentTheme).pickerWrapper}>
            {feedingOptions.map((option) => {
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
            {t("spider-form.spider_documents")}
          </ThemedText>

          <TouchableOpacity
            onPress={handleChooseDocument}
            activeOpacity={0.8}
            style={styles(currentTheme).filePicker}
          >
            <ThemedText>
              {documentUri
                ? t("spider-form.document_added")
                : t("spider-form.document_not_added")}
            </ThemedText>
          </TouchableOpacity>

          <Pressable style={styles(currentTheme).button} onPress={handleSubmit}>
            <ThemedText style={styles(currentTheme).buttonText}>
              {t("spider-form.save")}
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
      backgroundColor: Colors[theme].tint,
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
