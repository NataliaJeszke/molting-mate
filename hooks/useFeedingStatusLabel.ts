import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { useTranslation } from "./useTranslation";

export const useFeedingStatusLabel = () => {
  const { t } = useTranslation();

  return (status: FeedingStatus | null): string => {
    switch (status) {
      case FeedingStatus.HUNGRY:
        return t("spider-detail.feeding_status.hungry");
      case FeedingStatus.FEED_TODAY:
        return t("spider-detail.feeding_status.feed_today");
      case FeedingStatus.NOT_HUNGRY:
        return t("spider-detail.feeding_status.not_hungry");
      default:
        return t("spider-detail.feeding_status.unknown");
    }
  };
};
