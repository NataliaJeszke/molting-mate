import { useMemo } from "react";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import WrapperComponent from "@/components/ui/WrapperComponent";
import { useSpiders } from "@/store/spidersStore";

export default function Favourites() {
  const spiders = useSpiders();

  const favouriteSpiders = useMemo(
    () => spiders.filter((spider) => spider.isFavourite),
    [spiders],
  );

  return (
    <WrapperComponent>
      <SpiderFullList data={favouriteSpiders} />
    </WrapperComponent>
  );
}
