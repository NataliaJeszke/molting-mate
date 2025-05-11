import React, { useMemo } from "react";
import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { getFeedingStatus } from "../../utils/feedingUtils";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { Spider } from "@/db/database";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";

interface PostFeedingListComponentProps {
  spiders: Spider[];
}

const PostFeedingListComponent = ({
  spiders,
}: PostFeedingListComponentProps) => {
  const postFeedingSpiders = useMemo(() => {
    return spiders
      .filter((spider) => {
        const feedingStatus = getFeedingStatus(
          spider.lastFed,
          spider.feedingFrequency as unknown as FeedingFrequency,
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
