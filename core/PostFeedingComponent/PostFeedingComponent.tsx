import React, { useMemo } from "react";
import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { useSpidersStore } from "@/store/spidersStore";
import { getFeedingStatus } from "../../utils/feedingUtils";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";

const PostFeedingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);

  const postFeedingSpiders = useMemo(() => {
    return spiders
      .filter((spider) => {
        const feedingStatus = getFeedingStatus(
          spider.lastFed,
          spider.feedingFrequency
        );
        return feedingStatus === FeedingStatus.HUNGRY;
      })
      .map((spider) => ({
        id: spider.id,
        name: spider.name,
        date: spider.lastFed,
        imageUri: spider.imageUri,
        status: "GŁODNY",
      }));
  }, [spiders]);

  return (
    <SpiderList
      title="Pająki po terminie karmienia"
      data={postFeedingSpiders}
      info={"Głodne pająki"}
    />
  );
};

export default PostFeedingListComponent;
