import React from "react";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import FiltersComponent from "../FiltersComponent/FiltersComponent";

const FeedingListComponent = () => {
  const feedingSpiders = [
    { id: "1", name: "Pająk 1", date: "2024-03-30", status: "Po linieniu" },
    { id: "2", name: "Pająk 2", date: "2024-03-28", status: "Przed linieniem" },
  ];

  return (
    <>
    <FiltersComponent title="Karmienie" spiderCount={15} info="Lista pająków według karmienia."/>
      <SpiderFullList
        data={feedingSpiders}
      />
    </>
  );
};

export default FeedingListComponent;