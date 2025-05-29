import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { router } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";
import { Colors, ThemeType } from "@/constants/Colors";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";

import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import { Spider, SpiderDetailType } from "@/db/database";
import { ExtendedSpider } from "@/core/FeedingListComponent/FeedingListComponent";
import { useSpidersStore } from "@/store/spidersStore";
import { useTranslation } from "@/hooks/useTranslation";
import { SpiderListItem } from "../SpiderListItem/SpiderListItem";

type SpiderListProps = {
  data: SpiderDetailType[] | ExtendedSpider[];
  viewType?: ViewTypes;
};

const SpiderFullList = ({ data, viewType }: SpiderListProps) => {
  const [spiders, setSpiders] = useState<ExtendedSpider[] | SpiderDetailType[]>(
    data,
  );
  const { currentTheme } = useUserStore();
  const updateSpider = useSpidersStore((state: any) => state.updateSpider);
  const { t } = useTranslation();

  useEffect(() => {
    setSpiders(data);
  }, [data]);

  useEffect(() => {
    console.log("VIEW TYPE", viewType);
  }, [viewType]);

  const toggleFavourite = async (spiderId: string, isFavourite: boolean) => {
    const spider = spiders.find((s) => s.id === spiderId);
    if (!spider) return;

    const updatedSpider = {
      ...spider,
      isFavourite: !isFavourite,
      status: spider.status ?? "",
    };

    try {
      await updateSpider(updatedSpider);

      setSpiders((prev: any) =>
        prev.map((s: any) => (s.id === spiderId ? updatedSpider : s)),
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderStatusIcon = (spider: Spider | ExtendedSpider) => {
    if (spider.status === FeedingStatus.HUNGRY) {
      return (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/manageModal",
              params: {
                id: spider.id,
                type: ViewTypes.VIEW_FEEDING,
                action: "edit",
              },
            });
          }}
        >
          <Feather
            style={styles(currentTheme)["spider-list__status-icon"]}
            size={18}
            name="alert-triangle"
            color={Colors[currentTheme].warning.text}
          />
        </TouchableOpacity>
      );
    } else if (spider.status === FeedingStatus.FEED_TODAY) {
      return (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/manageModal",
              params: {
                id: spider.id,
                type: ViewTypes.VIEW_FEEDING,
                status: spider.status,
                action: "edit",
              },
            });
          }}
        >
          <Feather
            style={styles(currentTheme)["spider-list__status-icon"]}
            size={18}
            name="alert-octagon"
            color={Colors[currentTheme].info.text}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <CardComponent>
      <View>
        {/* {data.map((spider, index) => (
          <View
            key={spider.id}
            style={[
              styles(currentTheme)["spider-list__item"],
              index !== data.length - 1 &&
                styles(currentTheme)["spider-list__separator"],
            ]}
          >
            <View style={styles(currentTheme)["spider-list__item-content"]}>
              <TouchableOpacity
                onPress={() => {
                  router.push(`/spider/${spider.id}`);
                }}
              >
                <Image
                  source={
                    spider.imageUri
                      ? { uri: spider.imageUri }
                      : require("@/assets/images/spider.png")
                  }
                  style={styles(currentTheme)["spider-list__image"]}
                />
              </TouchableOpacity>

              <View style={styles(currentTheme)["spider-list__info-container"]}>
                <ThemedText
                  style={styles(currentTheme)["spider-list__info-name"]}
                >
                  {spider.name}
                </ThemedText>

                {(viewType === ViewTypes.VIEW_COLLECTION ||
                  viewType === ViewTypes.VIEW_FEEDING) && (
                  <View style={styles(currentTheme)["spider-list__info-group"]}>
                    <View style={styles(currentTheme)["spider-list__info-row"]}>
                      <ThemedText
                        style={styles(currentTheme)["spider-list__info-label"]}
                      >
                        {t("spider-full-list.last_feeding")}:
                      </ThemedText>
                      {spider.status === FeedingStatus.HUNGRY &&
                        renderStatusIcon(spider)}
                    </View>
                    <ThemedText
                      style={styles(currentTheme)["spider-list__info-date"]}
                    >
                      {spider.lastFed}
                    </ThemedText>

                    {viewType === ViewTypes.VIEW_FEEDING && (
                      <>
                        <View
                          style={styles(currentTheme)["spider-list__info-row"]}
                        >
                          <ThemedText
                            style={
                              styles(currentTheme)["spider-list__info-label"]
                            }
                          >
                            {t("spider-full-list.next_feeding")}:
                          </ThemedText>
                          {spider.status === FeedingStatus.FEED_TODAY &&
                            renderStatusIcon(spider)}
                        </View>
                        <ThemedText
                          style={styles(currentTheme)["spider-list__info-date"]}
                        >
                          {spider.nextFeedingDate}
                        </ThemedText>
                      </>
                    )}

                    {viewType === ViewTypes.VIEW_FEEDING &&
                      spider.status !== FeedingStatus.HUNGRY &&
                      spider.status !== FeedingStatus.FEED_TODAY && (
                        <TouchableOpacity
                          onPress={() => {
                            router.push({
                              pathname: "/manageModal",
                              params: {
                                id: spider.id,
                                type: ViewTypes.VIEW_FEEDING,
                                action: "edit",
                              },
                            });
                          }}
                          style={
                            styles(currentTheme)["spider-list__edit-button"]
                          }
                        >
                          <Feather
                            size={18}
                            name="edit-3"
                            color={Colors[currentTheme].info.text}
                          />
                          <ThemedText
                            style={
                              styles(currentTheme)["spider-list__edit-text"]
                            }
                          >
                            {t("spider-full-list.edit_feeding")}
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                  </View>
                )}

                {(viewType === ViewTypes.VIEW_COLLECTION ||
                  viewType === ViewTypes.VIEW_MOLTING) && (
                  <View style={styles(currentTheme)["spider-list__info-group"]}>
                    <ThemedText
                      style={styles(currentTheme)["spider-list__info-label"]}
                    >
                      {t("spider-full-list.last_molting")}:
                    </ThemedText>
                    <ThemedText
                      style={styles(currentTheme)["spider-list__info-date"]}
                    >
                      {spider.lastMolt}
                    </ThemedText>

                    {viewType === ViewTypes.VIEW_MOLTING && (
                      <TouchableOpacity
                        onPress={() => {
                          router.push({
                            pathname: "/manageModal",
                            params: {
                              id: spider.id,
                              type: ViewTypes.VIEW_MOLTING,
                              action: "edit",
                            },
                          });
                        }}
                        style={styles(currentTheme)["spider-list__edit-button"]}
                      >
                        <Feather
                          size={18}
                          name="edit-3"
                          color={Colors[currentTheme].info.text}
                        />
                        <ThemedText
                          style={styles(currentTheme)["spider-list__edit-text"]}
                        >
                          {t("spider-full-list.edit_molting")}
                        </ThemedText>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              <View
                style={styles(currentTheme)["spider-list__actions-container"]}
              >
                <TouchableOpacity
                  style={styles(currentTheme)["spider-list__action-button"]}
                  onPress={() => toggleFavourite(spider.id, spider.isFavourite)}
                >
                  <AntDesign
                    size={22}
                    name={spider.isFavourite ? "heart" : "hearto"}
                    color={Colors[currentTheme].tint}
                  />
                </TouchableOpacity>

                {viewType === ViewTypes.VIEW_COLLECTION && (
                  <TouchableOpacity
                    style={styles(currentTheme)["spider-list__action-button"]}
                    onPress={() => {
                      router.push({
                        pathname: "/spiderForm",
                        params: {
                          id: spider.id,
                          type: ViewTypes.VIEW_COLLECTION,
                          action: "edit",
                        },
                      });
                    }}
                  >
                    <Feather
                      size={22}
                      name="edit"
                      color={Colors[currentTheme].info.text}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles(currentTheme)["spider-list__action-button"]}
                  onPress={() => {
                    router.push({
                      pathname: "/manageModal",
                      params: {
                        id: spider.id,
                        action: "delete",
                      },
                    });
                  }}
                >
                  <AntDesign
                    size={22}
                    name="delete"
                    color={Colors[currentTheme].tint}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))} */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <SpiderListItem
              spider={item}
              isLast={index === data.length - 1}
              viewType={viewType}
              currentTheme={currentTheme}
              t={t}
              toggleFavourite={toggleFavourite}
            />
          )}
          contentContainerStyle={{ paddingBottom: 150 }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </View>
    </CardComponent>
  );
};

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    "spider-list__item": {
      paddingVertical: 16,
      paddingHorizontal: 8,
    },
    "spider-list__item-content": {
      flexDirection: "row",
      position: "relative",
    },
    "spider-list__separator": {
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].list.borderColor,
      marginBottom: 8,
      paddingBottom: 8,
    },
    "spider-list__image": {
      width: 70,
      height: 70,
      borderRadius: 8,
      backgroundColor: Colors[theme].spiderImage.backgroundColor,
    },
    "spider-list__info-container": {
      flex: 1,
      marginLeft: 12,
      justifyContent: "flex-start",
    },
    "spider-list__info": {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500",
      textAlign: "left",
      marginBottom: 4,
      color: Colors[theme].text,
    },
    "spider-list__info-name": {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 6,
      color: Colors[theme].text,
    },
    "spider-list__info-label": {
      fontSize: 14,
      color: Colors[theme].text,
      marginBottom: 1,
    },
    "spider-list__info-date": {
      fontSize: 16,
      fontWeight: "600",
      color: Colors[theme].text,
      marginBottom: 4,
    },
    "spider-list__info-row": {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    "spider-list__status-icon": {
      marginLeft: 6,
    },
    "spider-list__info-group": {
      marginBottom: 6,
      paddingVertical: 2,
    },
    "spider-list__actions-container": {
      flexDirection: "column",
      marginLeft: 8,
      height: "auto",
      justifyContent: "space-between",
    },
    "spider-list__action-button": {
      marginBottom: 16,
    },
    "spider-list__edit-button": {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
      paddingVertical: 4,
    },
    "spider-list__edit-text": {
      fontSize: 14,
      color: Colors[theme].info.text,
      marginLeft: 4,
    },
  });

export default SpiderFullList;
