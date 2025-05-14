import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useSpiderSpeciesStore } from "@/store/spiderSpeciesStore";
import AutocompleteSpeciesInput from "@/components/ui/AutocompleteSpeciesInput";
import { useUserStore } from "@/store/userStore";
import { Feather } from "@expo/vector-icons";
import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTranslation } from "@/hooks/useTranslation";

export default function SpiderSpeciesManager() {
  const {
    speciesOptions,
    addSpeciesToDb,
    deleteSpeciesFromDb,
    updateSpeciesInDb,
  } = useSpiderSpeciesStore();
  const { currentTheme } = useUserStore();
  const [selectedSpeciesValue, setSelectedSpeciesValue] = useState<
    number | null
  >(null);
  const [customInput, setCustomInput] = useState("");
  const [showAddButton, setShowAddButton] = useState(false);
  const router = useRouter();

  const [editingSpecies, setEditingSpecies] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [newSpeciesName, setNewSpeciesName] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { t } = useTranslation();

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
      t("add-new-spp.core.alert.confirmation.title"),
      t("add-new-spp.core.alert.confirmation.message", { customInput }),
      [
        {
          text: t("add-new-spp.core.alert.confirmation.cancel"),
          style: "cancel",
        },
        {
          text: t("add-new-spp.core.alert.confirmation.add"),
          onPress: () => {
            addSpeciesToDb(customInput);
            Alert.alert(
              t("add-new-spp.core.alert.confirmation.success"),
              t("add-new-spp.core.alert.confirmation.success_message", {
                customInput,
              }),
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
      t("add-new-spp.core.alert.delete.title"),
      t("add-new-spp.core.alert.delete.message", {
        customInput: species.label,
      }),
      [
        {
          text: t("add-new-spp.core.alert.delete.cancel"),
          style: "cancel",
        },
        {
          text: t("add-new-spp.core.alert.delete.text"),
          onPress: async () => {
            try {
              const result = await deleteSpeciesFromDb(species.value);
              if (result.success) {
                Alert.alert(
                  t("add-new-spp.core.alert.delete.success"),
                  t("add-new-spp.core.alert.delete.success_message", {
                    customInput: species.label,
                  }),
                  [{ text: "OK" }],
                );
              } else {
                Alert.alert(
                  t("add-new-spp.core.alert.delete.error"),
                  t("add-new-spp.core.alert.delete.error_message", { result }),
                  [{ text: "OK" }],
                );
              }
            } catch (error) {
              console.error(
                t("add-new-spp.core.alert.delete.error_alert"),
                error,
              );
              Alert.alert(
                t("add-new-spp.core.alert.delete.error_alert"),
                t("add-new-spp.core.alert.delete.error_message", {
                  result: { count: "?" },
                }),
                [{ text: "OK" }],
              );
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  const handleEdit = (species: { label: string; value: number }) => {
    setEditingSpecies({ id: species.value, name: species.label });
    setNewSpeciesName(species.label);
    setIsEditModalVisible(true);
    console.log("Edit species:", species);
  };

  const handleSaveEdit = async () => {
    if (!editingSpecies || newSpeciesName.trim() === "") return;

    try {
      await updateSpeciesInDb(editingSpecies.id, newSpeciesName.trim());
      Alert.alert(
        t("add-new-spp.core.alert.save_edit.title"),
        t("add-new-spp.core.alert.save_edit.message", {
          newSpeciesName: newSpeciesName.trim(),
        }),
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(t("add-new-spp.core.alert.save_edit.error_alert"));
    } finally {
      setIsEditModalVisible(false);
      setEditingSpecies(null);
      setNewSpeciesName("");
    }
  };

  return (
    <>
      <View style={styles(currentTheme)["species-manager"]}>
        <ThemedText style={styles(currentTheme)["species-manager__title"]}>
          {t("add-new-spp.core.title")}
        </ThemedText>

        <View style={styles(currentTheme)["species-manager__search"]}>
          <ThemedText
            style={styles(currentTheme)["species-manager__search-label"]}
          >
            {t("add-new-spp.core.serach")}:
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
                {t("add-new-spp.core.add")}: "{customInput}"
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles(currentTheme)["species-manager__list-section"]}>
          <ThemedText
            style={styles(currentTheme)["species-manager__list-title"]}
          >
            {t("add-new-spp.core.species_list")}:
          </ThemedText>

          <FlatList
            data={filteredSpecies}
            renderItem={({ item }) => (
              <View
                style={styles(currentTheme)["species-manager__species-item"]}
              >
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
                      styles(currentTheme)[
                        "species-manager__delete-button-text"
                      ]
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
                      styles(currentTheme)[
                        "species-manager__delete-button-text"
                      ]
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
                  ? t("add-new-spp.core.no_species_found")
                  : t("add-new-spp.core.no_species")}
              </ThemedText>
            }
          />

          <Button
            title={t("add-new-spp.core.back")}
            onPress={() => router.back()}
            color="#2196F3"
          />
        </View>
      </View>

      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <View style={styles(currentTheme)["modal-overlay"]}>
          <View style={styles(currentTheme)["modal-container"]}>
            <ThemedText style={styles(currentTheme)["modal-title"]}>
              {t("add-new-spp.core.edit")}
            </ThemedText>
            <TextInput
              style={styles(currentTheme)["modal-input"]}
              value={newSpeciesName}
              onChangeText={setNewSpeciesName}
              placeholder="Nowa nazwa gatunku"
              placeholderTextColor={Colors[currentTheme].input.placeholder}
            />
            <View style={styles(currentTheme)["modal-buttons"]}>
              <Button
                title={t("add-new-spp.core.cancel")}
                onPress={() => setIsEditModalVisible(false)}
              />
              <Button
                title={t("add-new-spp.core.save")}
                onPress={handleSaveEdit}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    "modal-overlay": {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    "modal-container": {
      width: "80%",
      backgroundColor: Colors[theme].card.backgroundColor,
      padding: 20,
      borderRadius: 10,
    },
    "modal-title": {
      fontSize: 18,
      marginBottom: 10,
    },
    "modal-input": {
      borderWidth: 1,
      backgroundColor: Colors[theme].input.backgroundColor,
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
      color: Colors[theme].text,
    },
    "modal-buttons": {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
