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

type SpiderSectionHeaderProps = {
  title: string;
  spiderCount: number;
  info: string;
};

const SpiderSectionHeader = ({
  title,
  spiderCount,
  info,
}: SpiderSectionHeaderProps) => {
  const router = useRouter();
  const { currentTheme } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

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

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles(currentTheme)["spiderSectionHeader__filterButton"]}
        >
          <ThemedText
            style={styles(currentTheme)["spiderSectionHeader__filterText"]}
          >
            Filtry
          </ThemedText>
          <MaterialIcons
            name={modalVisible ? "keyboard-arrow-down" : "keyboard-arrow-up"}
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

        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={styles(currentTheme)["spiderSectionHeader__modalOverlay"]}
            >
              <TouchableWithoutFeedback>
                <View
                  style={
                    styles(currentTheme)["spiderSectionHeader__modalContent"]
                  }
                >
                  <ThemedText
                    style={
                      styles(currentTheme)["spiderSectionHeader__modalTitle"]
                    }
                  >
                    Filtry
                  </ThemedText>
                  <Filters />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    spiderSectionHeader__modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    spiderSectionHeader__modalContent: {
      backgroundColor: Colors[theme].background,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      minHeight: 200,
    },
    spiderSectionHeader__modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
      color: Colors[theme].text,
    },
  });

export default SpiderSectionHeader;
