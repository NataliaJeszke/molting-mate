import { ThemedText } from "@/components/ui/ThemedText";
import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";

type SpiderListProps = {
  title: string;
};

const sampleSpiders = [
  {
    id: "1",
    name: "Pająk 1",
    date: "2024-04-01",
  },
  {
    id: "2",
    name: "Pająk 2",
    date: "2024-04-02",
  },
];

const SpiderList = ({ title }: SpiderListProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.listWrapper}>
      {sampleSpiders.map((spider) => (
        <View key={spider.id} style={styles.spiderContainer}>
          <Image
            source={require("@/assets/images/spider.png")}
            style={styles.spiderImage}
          />
          <ThemedText style={styles.spiderInfo}>{spider.name}</ThemedText>
          <ThemedText style={styles.spiderInfo}>{spider.date}</ThemedText>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a759f",
  },
  spiderContainer: {
    marginBottom: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  spiderImage: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 25,
    backgroundColor: "#f1f1f1",
  },
  spiderInfo: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
  },
  listWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default SpiderList;
