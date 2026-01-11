import React, { useMemo } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { ExtendedSpider } from "@/core/FeedingListComponent/FeedingListComponent";

import { Spider } from "@/models/Spider.model";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { Colors, ThemeType } from "@/constants/Colors";

import { ThemedText } from "@/components/ui/ThemedText";

type Props = {
  spider: any;
  isLast: boolean;
  viewType?: ViewTypes;
  currentTheme: ThemeType;
  t: (key: string) => string;
  toggleFavourite: (id: string, isFav: boolean) => void;
};

const SpiderListItemComponent = ({
  spider,
  isLast,
  viewType,
  currentTheme,
  t,
  toggleFavourite,
}: Props) => {
  const router = useRouter();

  const componentStyles = useMemo(() => styles(currentTheme), [currentTheme]);

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
            style={componentStyles["spider-list__status-icon"]}
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
            style={componentStyles["spider-list__status-icon"]}
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
    <View
      key={spider.id}
      style={[
        componentStyles["spider-list__item"],
        !isLast && componentStyles["spider-list__separator"],
      ]}
    >
      <View style={componentStyles["spider-list__item-content"]}>
        <TouchableOpacity onPress={() => router.push(`/spider/${spider.id}`)}>
          <Image
            source={
              spider.imageUri
                ? { uri: spider.imageUri }
                : require("@/assets/images/spider.png")
            }
            style={componentStyles["spider-list__image"]}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={componentStyles["spider-list__info-container"]}>
          <ThemedText style={componentStyles["spider-list__info-name"]}>
            {spider.name}
          </ThemedText>

          {(viewType === ViewTypes.VIEW_COLLECTION ||
            viewType === ViewTypes.VIEW_FEEDING) && (
            <View style={componentStyles["spider-list__info-group"]}>
              <View style={componentStyles["spider-list__info-row"]}>
                <ThemedText style={componentStyles["spider-list__info-label"]}>
                  {t("spider-full-list.last_feeding")}:
                </ThemedText>
                {spider.status === FeedingStatus.HUNGRY &&
                  renderStatusIcon(spider)}
              </View>
              <ThemedText style={componentStyles["spider-list__info-date"]}>
                {spider.lastFed}
              </ThemedText>

              {viewType === ViewTypes.VIEW_FEEDING && (
                <>
                  <View style={componentStyles["spider-list__info-row"]}>
                    <ThemedText
                      style={componentStyles["spider-list__info-label"]}
                    >
                      {t("spider-full-list.next_feeding")}:
                    </ThemedText>
                    {spider.status === FeedingStatus.FEED_TODAY &&
                      renderStatusIcon(spider)}
                  </View>
                  <ThemedText style={componentStyles["spider-list__info-date"]}>
                    {spider.nextFeedingDate}
                  </ThemedText>
                </>
              )}

              {viewType === ViewTypes.VIEW_FEEDING &&
                spider.status !== FeedingStatus.HUNGRY &&
                spider.status !== FeedingStatus.FEED_TODAY && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/manageModal",
                        params: {
                          id: spider.id,
                          type: ViewTypes.VIEW_FEEDING,
                          action: "edit",
                        },
                      })
                    }
                    style={componentStyles["spider-list__edit-button"]}
                  >
                    <Feather
                      size={18}
                      name="edit-3"
                      color={Colors[currentTheme].info.text}
                    />
                    <ThemedText
                      style={componentStyles["spider-list__edit-text"]}
                    >
                      {t("spider-full-list.edit_feeding")}
                    </ThemedText>
                  </TouchableOpacity>
                )}
            </View>
          )}

          {(viewType === ViewTypes.VIEW_COLLECTION ||
            viewType === ViewTypes.VIEW_MOLTING) && (
            <View style={componentStyles["spider-list__info-group"]}>
              <ThemedText style={componentStyles["spider-list__info-label"]}>
                {t("spider-full-list.last_molting")}:
              </ThemedText>
              <ThemedText style={componentStyles["spider-list__info-date"]}>
                {spider.lastMolt}
              </ThemedText>

              {viewType === ViewTypes.VIEW_MOLTING && (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/manageModal",
                      params: {
                        id: spider.id,
                        type: ViewTypes.VIEW_MOLTING,
                        action: "edit",
                      },
                    })
                  }
                  style={componentStyles["spider-list__edit-button"]}
                >
                  <Feather
                    size={18}
                    name="edit-3"
                    color={Colors[currentTheme].info.text}
                  />
                  <ThemedText style={componentStyles["spider-list__edit-text"]}>
                    {t("spider-full-list.edit_molting")}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={componentStyles["spider-list__actions-container"]}>
          <TouchableOpacity
            style={componentStyles["spider-list__action-button"]}
            onPress={() => toggleFavourite(spider.id, spider.isFavourite)}
          >
            <Ionicons
              size={22}
              name={spider.isFavourite ? "heart" : "heart-outline"}
              color={Colors[currentTheme].tint}
            />
          </TouchableOpacity>

          {viewType === ViewTypes.VIEW_COLLECTION && (
            <TouchableOpacity
              style={componentStyles["spider-list__action-button"]}
              onPress={() =>
                router.push({
                  pathname: "/spiderForm",
                  params: {
                    id: spider.id,
                    type: ViewTypes.VIEW_COLLECTION,
                    action: "edit",
                  },
                })
              }
            >
              <Feather
                size={22}
                name="edit"
                color={Colors[currentTheme].info.text}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={componentStyles["spider-list__action-button"]}
            onPress={() =>
              router.push({
                pathname: "/manageModal",
                params: {
                  id: spider.id,
                  action: "delete",
                },
              })
            }
          >
            <Ionicons
              size={22}
              name="trash-outline"
              color={Colors[currentTheme].tint}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const SpiderListItem = React.memo(
  SpiderListItemComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.spider.id === nextProps.spider.id &&
      prevProps.spider.isFavourite === nextProps.spider.isFavourite &&
      prevProps.spider.lastFed === nextProps.spider.lastFed &&
      prevProps.spider.lastMolt === nextProps.spider.lastMolt &&
      prevProps.spider.status === nextProps.spider.status &&
      prevProps.spider.nextFeedingDate === nextProps.spider.nextFeedingDate &&
      prevProps.isLast === nextProps.isLast &&
      prevProps.viewType === nextProps.viewType &&
      prevProps.currentTheme === nextProps.currentTheme
    );
  },
);

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
