import React from "react";
import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { MissedFeedingListMsg } from "./MissedFeedingList.constants";

const MissedFeedingListComponent = () => {
  const missedFeedingSpiders = [
    { id: "1", name: "Pająk 1", date: "2024-03-30", status: "Nie nakarmiony" },
    { id: "2", name: "Pająk 2", date: "2024-03-28", status: "Nie nakarmiony" },
    { id: "3", name: "Pająk 1", date: "2024-03-30", status: "Nie nakarmiony" },
    { id: "4", name: "Pająk 2", date: "2024-03-28", status: "Nie nakarmiony" },
    { id: "5", name: "Pająk 1", date: "2024-03-30", status: "Nie nakarmiony" },
    { id: "6", name: "Pająk 2", date: "2024-03-28", status: "Nie nakarmiony" },
  ];

  return (
    <SpiderList
      title="Głodne pająki"
      data={missedFeedingSpiders}
      info={MissedFeedingListMsg.INFORMATION}
    />
  );
};

export default MissedFeedingListComponent;
