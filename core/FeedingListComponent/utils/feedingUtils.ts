import { convertToISODate } from "@/utils/dateUtils";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { addDays, addWeeks, parse } from "date-fns";

export const getFeedingStatus = (
  lastFed: string,
  frequencyInDays: FeedingFrequency
): FeedingStatus | null => {
  if (!lastFed || !frequencyInDays) return null;

  const isoDate = convertToISODate(lastFed);
  const lastFedDate = new Date(isoDate);
  const today = new Date();

  if (isNaN(lastFedDate.getTime())) {
    console.warn("Invalid date:", lastFed);
    return null;
  }

  const frequencyMap: Record<FeedingFrequency, number> = {
    [FeedingFrequency.FewTimesWeek]: 3,
    [FeedingFrequency.OnceWeek]: 7,
    [FeedingFrequency.OnceTwoWeeks]: 14,
    [FeedingFrequency.OnceMonth]: 30,
    [FeedingFrequency.Rarely]: 60,
  };

  const frequency = frequencyMap[frequencyInDays];

  const daysSinceLastFed = Math.floor(
    (today.getTime() - lastFedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastFed === frequency) return FeedingStatus.FEED_TODAY;
  if (daysSinceLastFed > frequency) return FeedingStatus.HUNGRY;

  return FeedingStatus.NOT_HUNGRY;
};

export const getNextFeedingDate = (lastFed: string, feedingFrequency: string): string => {
  const lastFedDate = parse(lastFed, "dd-MM-yyyy", new Date());

  let nextFeedingDate: Date;

  switch (feedingFrequency) {
    case "daily":
      nextFeedingDate = addDays(lastFedDate, 1);
      break;
    case "weekly":
      nextFeedingDate = addWeeks(lastFedDate, 1);
      break;
    case "biweekly":
      nextFeedingDate = addWeeks(lastFedDate, 2);
      break;
    default:
      nextFeedingDate = lastFedDate;
  }

  return nextFeedingDate.toLocaleDateString();
};
