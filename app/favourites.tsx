import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import WrapperComponent from "@/components/ui/WrapperComponent";
import { getAllSpiders, Spider } from "@/db/database";

export default function Favourites() {
  const [favouriteSpiders, setFavouriteSpiders] = useState<Spider[]>([]);

  const fetchFavourites = async () => {
    const allSpiders = await getAllSpiders();
    if (!allSpiders) return;

    const typedSpiders: Spider[] = allSpiders as Spider[];

    const favourites = typedSpiders.filter((spider) => spider.isFavourite);
    setFavouriteSpiders(favourites);
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <WrapperComponent>
      <ScrollView>
        <SpiderFullList data={favouriteSpiders} />
      </ScrollView>
    </WrapperComponent>
  );
}
