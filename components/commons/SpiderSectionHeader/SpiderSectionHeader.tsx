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
import { useSpidersStore } from "@/store/spidersStore";
import { SortModal } from "@/components/commons/SortModal/SortModal";

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
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const filters = useFiltersStore((state) => state.filters[viewType]);
  const areFiltersActive = filters.isActive;

  const sortOrder = useSpidersStore((state: any) => state.sortOrder);
  const sortType = useSpidersStore((state: any) => state.sortType);
  const setSortOrder = useSpidersStore((state: any) => state.setSortOrder);
  const setSortType = useSpidersStore((state: any) => state.setSortType);

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

        <View style={styles(currentTheme)["spiderSectionHeader__controlsRow"]}>
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

          <TouchableOpacity
            onPress={() => setSortModalVisible(true)}
            style={styles(currentTheme)["spiderSectionHeader__sortButton"]}
          >
            <ThemedText
              style={styles(currentTheme)["spiderSectionHeader__filterText"]}
            >
              Sortowanie
            </ThemedText>
            <MaterialIcons
              name="sort"
              size={20}
              color={Colors[currentTheme].text}
            />
          </TouchableOpacity>
        </View>

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

        <Filters
          viewType={viewType}
          isVisible={filtersVisible}
          onClose={() => setFiltersVisible(false)}
        />

        <SortModal
          visible={sortModalVisible}
          onClose={() => setSortModalVisible(false)}
          sortType={sortType}
          setSortType={setSortType}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewType={viewType}
          currentTheme={currentTheme}
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
      marginRight: 4,
    },
    spiderSectionHeader__controlsRow: {
      flexDirection: "row",
      marginTop: 10,
      marginBottom: 4,
    },
    spiderSectionHeader__filterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 14,
      backgroundColor: Colors[theme].card.backgroundColor,
      borderRadius: 8,
      marginRight: 10,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
    },
    spiderSectionHeader__sortButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 14,
      backgroundColor: Colors[theme].card.backgroundColor,
      borderRadius: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
    },
    spiderSectionHeader__filterText: {
      fontSize: 15,
      fontWeight: "500",
      color: Colors[theme].text,
      marginRight: 6,
    },
    spiderSectionHeader__filterStatus: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors[theme].tint,
      marginTop: 4,
      marginBottom: 8,
    },
    spiderSectionHeader__overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    spiderSectionHeader__tooltip: {
      backgroundColor: Colors[theme].background,
      padding: 16,
      borderRadius: 12,
      maxWidth: 300,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    spiderSectionHeader__tooltipText: {
      fontSize: 14,
      color: Colors[theme].text,
      textAlign: "center",
      lineHeight: 20,
    },
    spiderSectionHeader__modal: {
      backgroundColor: Colors[theme].background,
      padding: 20,
      borderRadius: 12,
      width: "80%",
      maxWidth: 320,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    spiderSectionHeader__modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: Colors[theme].text,
      marginBottom: 16,
    },
    spiderSectionHeader__sortOption: {
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    spiderSectionHeader__sortOptionText: {
      fontSize: 16,
      color: Colors[theme].text,
    },
    spiderSectionHeader__sortDivider: {
      height: 1,
      backgroundColor: Colors[theme].tabIconDefault,
      opacity: 0.3,
      marginVertical: 16,
    },
    spiderSectionHeader__sortDirectionOption: {
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
  });

export default SpiderSectionHeader;
