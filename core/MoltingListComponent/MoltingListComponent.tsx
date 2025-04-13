import React, { useMemo } from "react";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import FiltersComponent from "../FiltersComponent/FiltersComponent";
import { useSpidersStore } from "@/store/spidersStore";

const convertToISODate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
};

const MoltingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);

  const sortedSpiders = useMemo(() => {
    return [...spiders]
      .filter((spider) => !!spider.lastMolt)
      .sort((a, b) => {
        const dateA = new Date(convertToISODate(a.lastMolt)).getTime();
        const dateB = new Date(convertToISODate(b.lastMolt)).getTime();
        return dateA - dateB;
      });
  }, [spiders]);

  return (
    <>
      <FiltersComponent
        title="Linienie"
        spiderCount={sortedSpiders.length}
        info="Lista pająków według linienia."
      />
      <SpiderFullList data={sortedSpiders} />
    </>
  );
};

export default MoltingListComponent;
