import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import WrapperComponent from "@/components/ui/WrapperComponent";
import { Spider } from "@/db/database";
import { useSpidersStore } from "@/store/spidersStore";

export default function Favourites() {
  const [favouriteSpiders, setFavouriteSpiders] = useState<Spider[]>([]);
  const spiders = useSpidersStore((state: any) => state.spiders) as Spider[];

  const fetchFavourites = () => {
    const favourites = spiders.filter((spider) => spider.isFavourite);
    setFavouriteSpiders(favourites);
  };

  useEffect(() => {
    fetchFavourites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spiders]);

  return (
    <WrapperComponent>
      <ScrollView>
        <SpiderFullList data={favouriteSpiders} />
      </ScrollView>
    </WrapperComponent>
  );
}
