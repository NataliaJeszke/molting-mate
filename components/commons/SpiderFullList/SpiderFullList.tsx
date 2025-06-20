import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";

import { useUserStore } from "@/store/userStore";
import { useSpidersStore } from "@/store/spidersStore";

import { ExtendedSpider } from "@/core/FeedingListComponent/FeedingListComponent";

import { ViewTypes } from "@/constants/ViewTypes.enums";

import { SpiderDetailType } from "@/db/database";

import { useTranslation } from "@/hooks/useTranslation";

import CardComponent from "@/components/ui/CardComponent";
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

  return (
    <CardComponent>
      <View>
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

export default SpiderFullList;
