import { useMemo } from "react";
import { ScrollView } from "react-native";

import { useSpidersStore } from "@/store/spidersStore";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import WrapperComponent from "@/components/ui/WrapperComponent";

export default function Favourites() {
  const spiders = useSpidersStore((state) => state.spiders);

  const favouriteSpiders = useMemo(
    () => spiders.filter((spider) => spider.isFavourite),
    [spiders],
  );

  return (
    <WrapperComponent>
      <ScrollView>
        <SpiderFullList data={favouriteSpiders} />
      </ScrollView>
    </WrapperComponent>
  );
}
