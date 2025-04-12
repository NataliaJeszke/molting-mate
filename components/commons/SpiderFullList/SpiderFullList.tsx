import React from "react";
import { View, Image, StyleSheet } from "react-native";

import { useUserStore } from "@/store/userStore";
import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";

type Spider = {
  id: string;
  name: string;
  date: string;
  status: string;
};

type SpiderListProps = {
  data: Spider[];
  info?: string;
};

const SpiderFullList = ({ data, info }: SpiderListProps) => {
  const { currentTheme } = useUserStore();

  return (
    <CardComponent>
      <View>
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles(currentTheme)["spider-list__list-item"],
              index !== data.length - 1 &&
                styles(currentTheme)["spider-list__separator"],
            ]}
          >
            <View style={styles(currentTheme)["spider-list__item-content"]}>
              <Image
                source={require("@/assets/images/spider.png")}
                style={styles(currentTheme)["spider-list__image"]}
              />
              <View style={{ marginLeft: 12 }}>
                <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                  {item.name}
                </ThemedText>
                <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                  {item.date}
                </ThemedText>
                <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                  {item.status}
                </ThemedText>
              </View>
            </View>
          </View>
        ))}
      </View>
    </CardComponent>
  );
};

const styles = (theme: ThemeType) =>
  StyleSheet.create({
    "spider-list__wrapper": {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    "spider-list__list-item": {
      paddingVertical: 12,
    },
    "spider-list__item-content": {
      flexDirection: "row",
      alignItems: "center",
    },
    "spider-list__separator": {
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    "spider-list__image": {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: Colors[theme].spiderImage.backgroundColor,
    },
    "spider-list__info": {
      fontSize: 12,
      fontWeight: "500",
      textAlign: "left",
      marginBottom: 2,
    },
    "spider-list__overlay": {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    "spider-list__tooltip": {
      backgroundColor: "#fff",
      padding: 12,
      borderRadius: 8,
      maxWidth: 300,
      elevation: 6,
    },
    "spider-list__tooltip-text": {
      fontSize: 14,
      color: "#333",
      textAlign: "center",
    },
  });

export default SpiderFullList;
