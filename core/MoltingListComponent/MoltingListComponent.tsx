import React from "react";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import FiltersComponent from "../FiltersComponent/FiltersComponent";

const MoltingListComponent = () => {
  const moltingSpiders = [
    { id: "1", name: "Pająk 1", date: "2024-03-30", status: "Po linieniu" },
    { id: "2", name: "Pająk 2", date: "2024-03-28", status: "Przed linieniem" },
  ];

  return (
    <>
    <FiltersComponent title="Linienie" spiderCount={15} info="Lista pająków według linienia."/>
      <SpiderFullList
        data={moltingSpiders}
      />
    </>
  );
};

export default MoltingListComponent;
