import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

import { router } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";
import { Colors, ThemeType } from "@/constants/Colors";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";

import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import { ViewTypes } from "@/constants/ViewTypes.enums";

type Spider = {
  id: string;
  name: string;
  age: string;
  spiderType: string;
  spiderSpecies: string;
  lastFed: string;
  feedingFrequency: FeedingFrequency;
  lastMolt: string;
  imageUri: string | undefined;
  isFavourite: boolean;
  status?: FeedingStatus | null;
};

type SpiderListProps = {
  data: Spider[];
  viewType?: ViewTypes;

};

const SpiderFullList = ({ data, viewType }: SpiderListProps) => {
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
        {data.map((spider, index) => (
          <View
            key={spider.id}
            style={[
              styles(currentTheme)["spider-list__item"],
              index !== data.length - 1 &&
                styles(currentTheme)["spider-list__separator"],
            ]}
          >
            <View style={styles(currentTheme)["spider-list__item-content"]}>
              <Image
                source={
                  spider.imageUri
                    ? { uri: spider.imageUri }
                    : require("@/assets/images/spider.png")
                }
                style={styles(currentTheme)["spider-list__image"]}
              />
              <View style={{ marginLeft: 12 }}>
                <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                  {spider.name}
                </ThemedText>

                {(viewType === ViewTypes.VIEW_COLLECTION || ViewTypes.VIEW_FEEDING ) && (
                  <>
                    <ThemedText
                      style={styles(currentTheme)["spider-list__info"]}
                    >
                      Data karmienia: {spider.lastFed}
                    </ThemedText>

                    {spider.status === FeedingStatus.HUNGRY && (
                      <TouchableOpacity
                        onPress={() => {
                          router.push({
                            pathname: "/manageAlertModal",
                            params: { id: spider.id, type: ViewTypes.VIEW_FEEDING },
                          });
                        }}
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

                {(viewType === ViewTypes.VIEW_COLLECTION || viewType === ViewTypes.VIEW_MOLTING) && (
                  <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                    Data linienia: {spider.lastMolt}
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity
                onPress={() => toggleFavourite(spider.id, spider.isFavourite)}
                style={styles(currentTheme)["spider-list__heart-icon"]}
              >
                <AntDesign
                  size={24}
                  name={spider.isFavourite ? "heart" : "hearto"}
                  color={Colors[currentTheme].tint}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleRemoveSpider(spider.id)}
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
