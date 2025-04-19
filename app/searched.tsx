import { useMemo } from "react";
import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useSpidersStore } from "@/store/spidersStore";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import WrapperComponent from "@/components/ui/WrapperComponent";

export default function Filtered() {
  const spiders = useSpidersStore((state) => state.spiders);
  const { query } = useLocalSearchParams();

  const filteredSpiders = useMemo(
    () =>
      spiders.filter((spider) => {
        const name = spider.name?.toLowerCase() || "";
        const spiderSpecies = spider.spiderSpecies?.toLowerCase() || "";

        return (
          name.includes(
            Array.isArray(query) ? query[0].toLowerCase() : query.toLowerCase(),
          ) ||
          spiderSpecies.includes(
            Array.isArray(query) ? query[0].toLowerCase() : query.toLowerCase(),
          )
        );
      }),
    [spiders, query],
  );

  return (
    <WrapperComponent>
      <ScrollView>
        <SpiderFullList data={filteredSpiders} />
      </ScrollView>
    </WrapperComponent>
  );
}
