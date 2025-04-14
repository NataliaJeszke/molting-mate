import React, { useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

import { router } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";
import { Colors, ThemeType } from "@/constants/Colors";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";

import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import { Spider } from "@/models/Spiders.model";

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

  useEffect(() => {
    console.log("VIEW TYPE", viewType);
  }, [viewType]);

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
              <View style={styles(currentTheme)["spider-list__info-container"]}>
                <ThemedText style={styles(currentTheme)["spider-list__info"]}>
                  {spider.name}
                </ThemedText>

                {(viewType === ViewTypes.VIEW_COLLECTION ||
                  viewType === ViewTypes.VIEW_FEEDING) && (
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
                            params: {
                              id: spider.id,
                              type: ViewTypes.VIEW_FEEDING,
                            },
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
                    {spider.status === FeedingStatus.FEED_TODAY && (
                      <TouchableOpacity
                        onPress={() => {
                          router.push({
                            pathname: "/manageAlertModal",
                            params: {
                              id: spider.id,
                              type: ViewTypes.VIEW_FEEDING,
                              status: spider.status
                            },
                          });
                        }}
                      >
                        <Feather
                          size={24}
                          name="alert-octagon"
                          color={Colors[currentTheme].info.text}
                        />
                      </TouchableOpacity>
                    )}
                  </>
                )}

                {(viewType === ViewTypes.VIEW_COLLECTION ||
                  viewType === ViewTypes.VIEW_MOLTING) && (
                  <>
                    <ThemedText
                      style={styles(currentTheme)["spider-list__info"]}
                    >
                      Data linienia: {spider.lastMolt}
                    </ThemedText>
                    {/* <ThemedText
                      style={styles(currentTheme)["spider-list__info"]}
                    >
                      Predykcja Linienia: {spider.status}
                    </ThemedText> */}
                    {viewType === ViewTypes.VIEW_MOLTING && (
                      <TouchableOpacity
                        onPress={() => {
                          router.push({
                            pathname: "/manageAlertModal",
                            params: {
                              id: spider.id,
                              type: ViewTypes.VIEW_MOLTING,
                            },
                          });
                        }}
                      >
                        <Feather
                          size={24}
                          name="edit-3"
                          color={Colors[currentTheme].info.text}
                        />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
              
              <View style={styles(currentTheme)["spider-list__actions-container"]}>
                <TouchableOpacity
                  style={styles(currentTheme)["spider-list__action-button"]}
                  onPress={() => toggleFavourite(spider.id, spider.isFavourite)}
                >
                  <AntDesign
                    size={24}
                    name={spider.isFavourite ? "heart" : "hearto"}
                    color={Colors[currentTheme].tint}
                  />
                </TouchableOpacity>

                {(viewType === ViewTypes.VIEW_COLLECTION || viewType === ViewTypes.VIEW_FEEDING) && (
                  <TouchableOpacity
                    style={styles(currentTheme)["spider-list__action-button"]}
                    onPress={() => {
                      router.push({
                        pathname: "/spiderForm",
                        params: {
                          id: spider.id,
                          type: ViewTypes.VIEW_COLLECTION,
                        },
                      });
                    }}
                  >
                    <Feather
                      size={24}
                      name="edit"
                      color={Colors[currentTheme].info.text}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles(currentTheme)["spider-list__action-button"]}
                  onPress={() => handleRemoveSpider(spider.id)}
                >
                  <AntDesign
                    size={24}
                    name="delete"
                    color={Colors[currentTheme].tint}
                  />
                </TouchableOpacity>
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
    "spider-list__item": {
      paddingVertical: 12,
    },
    "spider-list__item-content": {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      marginBottom: 20,
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
    "spider-list__info-container": {
      flex: 1,
      marginLeft: 12,
    },
    "spider-list__info": {
      fontSize: 14,
      fontWeight: "500",
      textAlign: "left",
      marginBottom: 2,
    },
    "spider-list__actions-container": {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      height: 120,
      marginLeft: 10,
      paddingVertical: 8,
    },
    "spider-list__action-button": {
      padding: 8,
    }
  });

export default SpiderFullList;