import { useEffect, useState } from "react";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import WrapperComponent from "@/components/ui/WrapperComponent";
import { SpiderDetailType } from "@/db/database";
import { useSpidersStore } from "@/store/spidersStore";

export default function Favourites() {
  const [favouriteSpiders, setFavouriteSpiders] = useState<SpiderDetailType[]>(
    [],
  );
  const spiders = useSpidersStore(
    (state: any) => state.spiders,
  ) as SpiderDetailType[];

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
      <SpiderFullList data={favouriteSpiders} />
    </WrapperComponent>
  );
}
