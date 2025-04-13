import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useUserStore } from "@/store/userStore";
import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import { useSpidersStore } from "@/store/spidersStore";
import { AntDesign, Feather } from "@expo/vector-icons";
import { FeedingStatus } from "@/core/FeedingListComponent/FeedingListComponent";
import ModalInfo from "../Modal/Modal";

type Spider = {
  id: string;
  name: string;
  age: string;
  spiderType: string;
  spiderSpecies: string;
  lastFed: string;
  feedingFrequency: string;
  lastMolt: string;
  imageUri: string | undefined;
  isFavourite: boolean;
  status?: FeedingStatus | string;
};

type SpiderListProps = {
  data: Spider[];
  viewType?: string;
  onAlertPress?:(spiderId: string)=> void;
};

const SpiderFullList = ({ data, viewType, onAlertPress }: SpiderListProps) => {
  const { currentTheme } = useUserStore();
  const { addToFavorites, removeFromFavorites, removeSpider, spiders } =
    useSpidersStore();

  useEffect(() => {
    console.log("Spider data:", spiders);
  }, [spiders]);

  const toggleFavourite = (spiderId: string, isFavourite: boolean) => {
    if (isFavourite) {
      removeFromFavorites(spiderId);
    } else {
      addToFavorites(spiderId);
    }
  };

  const handleRemoveSpider = (spiderId: string) => {
    removeSpider(spiderId);
  };

  return (
    <CardComponent>
      <View>
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles(currentTheme)["spider-list__item"],
              index !== data.length - 1 &&
                styles(currentTheme)["spider-list__separator"],
            ]}
          >
            <View style={styles(currentTheme)["spider-list__item-content"]}>
              <Image
                source={
                  item.imageUri
                    ? { uri: item.imageUri }
                    : require("@/assets/images/spider.png")
                }
                style={styles(currentTheme)["spider-list__image"]}
              />
              <View style={{ marginLeft: 12 }}>
                <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                  {item.name}
                </ThemedText>

                {(viewType === "collection" || viewType === "feeding") && (
                  <>
                    <ThemedText
                      style={styles(currentTheme)["spider-list__info"]}
                    >
                      Data karmienia: {item.lastFed}
                    </ThemedText>

                    {item.status === "HUNGRY" && (
                      <TouchableOpacity
                      onPress={() => onAlertPress && onAlertPress(item.id)}
                      >
                        <Feather
                          size={24}
                          name="alert-triangle"
                          color={Colors[currentTheme].warning.text}
                        />
                      </TouchableOpacity>
                    )}
                  </>
                )}

                {(viewType === "collection" || viewType === "molting") && (
                  <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                    Data linienia: {item.lastMolt}
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity
                onPress={() => toggleFavourite(item.id, item.isFavourite)}
                style={styles(currentTheme)["spider-list__heart-icon"]}
              >
                <AntDesign
                  size={24}
                  name={item.isFavourite ? "heart" : "hearto"}
                  color={Colors[currentTheme].tint}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleRemoveSpider(item.id)}
                style={styles(currentTheme)["spider-list__trash-icon"]}
              >
                <AntDesign
                  size={24}
                  name="delete"
                  color={Colors[currentTheme].tint}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </CardComponent>
  );
};

const styles = (theme: ThemeType) =>
  StyleSheet.create({
    "spider-list__item": {
      paddingVertical: 12,
    },
    "spider-list__item-content": {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      marginBottom: 12,
    },
    "spider-list__separator": {
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      marginBottom: 12,
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
    "spider-list__heart-icon": {
      position: "absolute",
      top: -10,
      right: 0,
    },

    "spider-list__trash-icon": {
      position: "absolute",
      bottom: -10,
      right: 0,
    },
  });

export default SpiderFullList;
