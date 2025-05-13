import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";
import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import Filters from "@/components/commons/Filters/Filters";
import { useFiltersStore } from "@/store/filtersStore";
import { FilterViewTypes } from "@/models/Filters.model";

type SpiderSectionHeaderProps = {
  title: string;
  spiderCount: number;
  info: string;
  viewType: FilterViewTypes
};

const SpiderSectionHeader = ({
  title,
  spiderCount,
  info,
  viewType,
}: SpiderSectionHeaderProps) => {
  const router = useRouter();
  const { currentTheme } = useUserStore();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const filters = useFiltersStore((state) => state.filters[viewType]);
  const areFiltersActive = filters.isActive;

  return (
    <CardComponent>
      <View style={styles(currentTheme)["spiderSectionHeader__container"]}>
        <View style={styles(currentTheme)["spiderSectionHeader__header"]}>
          <ThemedText
            style={styles(currentTheme)["spiderSectionHeader__title"]}
          >
            {title}
          </ThemedText>
          <View style={styles(currentTheme)["spiderSectionHeader__iconsRight"]}>
            <ThemedText
              style={styles(currentTheme)["spiderSectionHeader__count"]}
            >
              ({spiderCount})
            </ThemedText>
            <TouchableOpacity
              style={{ marginHorizontal: 6 }}
              onPress={() => {
                console.log("Ulubione pająki");
                router.push("/favourites");
              }}
            >
              <AntDesign
                name="hearto"
                size={20}
                color={Colors[currentTheme].tint}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTooltipVisible(true)}>
              <MaterialIcons
                name="info-outline"
                size={20}
                color={Colors[currentTheme].tint}
              />
            </TouchableOpacity>
          </View>
        </View>

        {areFiltersActive && (
          <ThemedText
            style={styles(currentTheme)["spiderSectionHeader__filterStatus"]}
          >
            Filtry są włączone
          </ThemedText>
        )}

        <TouchableOpacity
          onPress={() => setFiltersVisible(true)}
          style={styles(currentTheme)["spiderSectionHeader__filterButton"]}
        >
          <ThemedText
            style={styles(currentTheme)["spiderSectionHeader__filterText"]}
          >
            Filtry
          </ThemedText>
          <MaterialIcons
            name="filter-list"
            size={20}
            color={Colors[currentTheme].text}
          />
        </TouchableOpacity>

        <Modal
          transparent
          visible={tooltipVisible}
          animationType="fade"
          onRequestClose={() => setTooltipVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setTooltipVisible(false)}>
            <View style={styles(currentTheme)["spiderSectionHeader__overlay"]}>
              <View
                style={styles(currentTheme)["spiderSectionHeader__tooltip"]}
              >
                <ThemedText
                  style={
                    styles(currentTheme)["spiderSectionHeader__tooltipText"]
                  }
                >
                  {info}
                </ThemedText>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Używamy poprawionego komponentu Filters, który sam ma już Modal */}
        <Filters
          viewType={viewType}
          isVisible={filtersVisible}
          onClose={() => setFiltersVisible(false)}
        />
      </View>
    </CardComponent>
  );
};

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    spiderSectionHeader__container: {
      marginBottom: 16,
    },
    spiderSectionHeader__header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    spiderSectionHeader__title: {
      fontSize: 20,
      fontWeight: "bold",
      color: Colors[theme].tint,
    },
    spiderSectionHeader__iconsRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    spiderSectionHeader__count: {
      fontSize: 14,
      color: Colors[theme].text,
    },
    spiderSectionHeader__filterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: Colors[theme].card.backgroundColor,
      borderRadius: 8,
      alignSelf: "flex-start",
    },
    spiderSectionHeader__filterText: {
      fontSize: 16,
      color: Colors[theme].text,
      marginRight: 4,
    },
    spiderSectionHeader__filterStatus: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors[theme].tint,
      marginTop: 4,
    },
    spiderSectionHeader__overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    spiderSectionHeader__tooltip: {
      backgroundColor: "#fff",
      padding: 12,
      borderRadius: 8,
      maxWidth: 300,
      elevation: 5,
    },
    spiderSectionHeader__tooltipText: {
      fontSize: 14,
      color: "#333",
      textAlign: "center",
    },
  });

export default SpiderSectionHeader;
