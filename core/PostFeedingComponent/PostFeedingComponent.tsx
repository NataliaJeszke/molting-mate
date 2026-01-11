import React, { useMemo } from "react";
import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { getFeedingStatus } from "../../utils/feedingUtils";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { SpiderDetailType } from "@/db/database";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { useTranslation } from "@/hooks/useTranslation";

interface PostFeedingListComponentProps {
  spiders: SpiderDetailType[];
}

const PostFeedingListComponent = ({
  spiders,
}: PostFeedingListComponentProps) => {
  const { t } = useTranslation();

  const postFeedingSpiders = useMemo(() => {
    return spiders
      .filter((spider) => {
        const feedingStatus = getFeedingStatus(
          spider.lastFed,
          spider.feedingFrequency as unknown as FeedingFrequency,
        );
        return feedingStatus === FeedingStatus.HUNGRY;
      })
      .slice(0, 20)
      .map((spider) => ({
        id: spider.id,
        name: spider.name,
        date: spider.lastFed,
        imageUri: spider.imageUri,
        status: t("post-feeding-list.status"),
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spiders]);

  return (
    <SpiderList
      title={t("post-feeding-list.title")}
      data={postFeedingSpiders}
      info={t("post-feeding-list.info")}
    />
  );
};

export default PostFeedingListComponent;
