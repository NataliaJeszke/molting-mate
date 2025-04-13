import { ScrollView } from "react-native";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import WrapperComponent from "@/components/ui/WrapperComponent";
import { useSpidersStore } from "@/store/spidersStore";
import { useMemo } from "react";

export default function Favourites() {
  const spiders = useSpidersStore((state) => state.spiders);

  const favouriteSpiders = useMemo(
    () => spiders.filter((spider) => spider.isFavourite),
    [spiders]
  );

  return (
    <WrapperComponent>
      <ScrollView>
        <SpiderFullList data={favouriteSpiders} info="Ulubione pająki" />
      </ScrollView>
    </WrapperComponent>
  );
}
