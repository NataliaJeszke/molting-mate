import React, { useMemo } from "react";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import FiltersComponent from "../FiltersComponent/FiltersComponent";
import { useSpidersStore } from "@/store/spidersStore";
import { ViewTypes } from "@/constants/ViewTypes.enums";

const convertToISODate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
};

const FeedingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const viewType = ViewTypes.VIEW_FEEDING;

  const sortedSpiders = useMemo(() => {
    return [...spiders]
      .filter((spider) => !!spider.lastFed)
      .sort((a, b) => {
        const dateA = new Date(convertToISODate(a.lastFed)).getTime();
        const dateB = new Date(convertToISODate(b.lastFed)).getTime();
        return dateA - dateB;
      });
  }, [spiders]);

  return (
    <>
      <FiltersComponent
        title="Karmienie"
        spiderCount={sortedSpiders.length}
        info="Lista pająków według karmienia."
      />
      <SpiderFullList data={sortedSpiders} viewType={viewType}/>
    </>
  );
};

export default FeedingListComponent;
