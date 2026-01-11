import React, { useCallback } from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";

import { ExtendedSpider } from "@/core/FeedingListComponent/FeedingListComponent";

import { ViewTypes } from "@/constants/ViewTypes.enums";

import { SpiderDetailType } from "@/db/database";

import { useTranslation } from "@/hooks/useTranslation";

import CardComponent from "@/components/ui/CardComponent";
import { SpiderListItem } from "../SpiderListItem/SpiderListItem";

type SpiderItem = SpiderDetailType | ExtendedSpider;

type SpiderListProps = {
  data: SpiderItem[];
  viewType?: ViewTypes;
};

const SpiderFullList = ({ data, viewType }: SpiderListProps) => {
  const { currentTheme } = useUserStore();
  const updateSpider = useSpidersStore((state) => state.updateSpider);
  const { t } = useTranslation();

  const toggleFavourite = useCallback(
    async (spiderId: string, isFavourite: boolean) => {
      try {
        // Update only the isFavourite field
        await updateSpider({
          id: spiderId,
          isFavourite: !isFavourite,
        });
      } catch (error) {
        console.error("Error toggling favourite:", error);
      }
    },
    [updateSpider],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: SpiderItem; index: number }) => (
      <SpiderListItem
        spider={item}
        isLast={index === data.length - 1}
        viewType={viewType}
        currentTheme={currentTheme}
        t={t}
        toggleFavourite={toggleFavourite}
      />
    ),
    [data.length, viewType, currentTheme, t, toggleFavourite],
  );

  const keyExtractor = useCallback((item: SpiderItem) => item.id, []);

  return (
    <CardComponent customStyle={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlashList<SpiderItem>
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          drawDistance={500}
          contentContainerStyle={{ paddingBottom: 150 }}
          extraData={data}
        />
      </View>
    </CardComponent>
  );
};

export default SpiderFullList;
