import React, { useMemo, useState } from "react";

import { useSpidersStore } from "@/store/spidersStore";
import { ViewTypes } from "@/constants/ViewTypes.enums";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import FiltersComponent from "../FiltersComponent/FiltersComponent";
import ModalInfo from "@/components/commons/Modal/Modal";

export type FeedingStatus = "HUNGRY" | "FEED_TODAY" | null;

const getFeedingStatus = (
  lastFed: string,
  frequencyInDays: string
): FeedingStatus => {
  if (!lastFed || !frequencyInDays) return null;

  const isoDate = convertToISODate(lastFed);
  const lastFedDate = new Date(isoDate);
  const today = new Date();

  if (isNaN(lastFedDate.getTime())) {
    console.warn("Invalid date:", lastFed);
    return null;
  }

  let frequency: number;
  switch (frequencyInDays) {
    case "few_times_week":
      frequency = 3;
      break;
    case "once_week":
      frequency = 7;
      break;
    case "once_two_weeks":
      frequency = 14;
      break;
    case "once_month":
      frequency = 30;
      break;
    case "rarely":
      frequency = 60;
      break;
    default:
      return null;
  }

  const nextFeedingDate = new Date(lastFedDate);
  nextFeedingDate.setDate(lastFedDate.getDate() + frequency);

  const todayStr = today.toISOString().split("T")[0];
  const nextStr = nextFeedingDate.toISOString().split("T")[0];

  if (today > nextFeedingDate) {
    return "HUNGRY";
  } else if (todayStr === nextStr) {
    return "FEED_TODAY";
  }

  return null;
};

const convertToISODate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
};

const FeedingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const viewType = ViewTypes.VIEW_FEEDING;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSubmitDate = () => {
    console.log("Submitted date");
    setIsModalVisible(false);
  };

  const sortedSpidersWithStatus = useMemo(() => {
    return [...spiders]
      .filter((spider) => !!spider.lastFed)
      .map((spider) => ({
        ...spider,
        status: getFeedingStatus(spider.lastFed, spider.feedingFrequency),
      }))
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
        spiderCount={sortedSpidersWithStatus.length}
        info="Lista pająków według karmienia."
      />
      <SpiderFullList
        data={sortedSpidersWithStatus}
        viewType={viewType}
        onAlertPress={handleModalOpen}
      />
      <ModalInfo
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onSubmit={handleSubmitDate}
      />
    </>
  );
};

export default FeedingListComponent;
