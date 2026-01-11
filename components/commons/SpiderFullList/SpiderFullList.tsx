import React, { useEffect, useState, useCallback } from "react";
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
  const [spiders, setSpiders] = useState<SpiderItem[]>(data);
  const { currentTheme } = useUserStore();
  const updateSpider = useSpidersStore((state: any) => state.updateSpider);
  const { t } = useTranslation();

  useEffect(() => {
    setSpiders(data);
  }, [data]);

  const toggleFavourite = useCallback(
    async (spiderId: string, isFavourite: boolean) => {
      const spider = spiders.find((s) => s.id === spiderId);
      if (!spider) return;

      const updatedSpider = {
        ...spider,
        isFavourite: !isFavourite,
        status: spider.status ?? "",
      };

      try {
        await updateSpider(updatedSpider);

        setSpiders((prev) =>
          prev.map((s) => (s.id === spiderId ? updatedSpider : s)),
        );
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [spiders, updateSpider],
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

  return (
    <CardComponent customStyle={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlashList<SpiderItem>
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          drawDistance={500}
          contentContainerStyle={{ paddingBottom: 150 }}
        />
      </View>
    </CardComponent>
  );
};

export default SpiderFullList;
