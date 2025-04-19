import { addDays, format, parse } from "date-fns";

import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";

export const getFeedingStatus = (
  lastFed: string,
  frequencyInDays: FeedingFrequency,
): FeedingStatus | null => {
  if (!lastFed || !frequencyInDays) return null;

  const lastFedDate = parse(lastFed, "yyyy-MM-dd", new Date());
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
    (today.getTime() - lastFedDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceLastFed === frequency) return FeedingStatus.FEED_TODAY;
  if (daysSinceLastFed > frequency) return FeedingStatus.HUNGRY;

  return FeedingStatus.NOT_HUNGRY;
};

export const getNextFeedingDate = (
  lastFed: string,
  feedingFrequency: FeedingFrequency,
): string => {
  if (!lastFed || !feedingFrequency) return "";

  const lastFedDate = parse(lastFed, "yyyy-MM-dd", new Date());

  if (isNaN(lastFedDate.getTime())) {
    console.warn("Invalid date format:", lastFed);
    return "";
  }

  const frequencyMap: Record<FeedingFrequency, number> = {
    [FeedingFrequency.FewTimesWeek]: 3,
    [FeedingFrequency.OnceWeek]: 7,
    [FeedingFrequency.OnceTwoWeeks]: 14,
    [FeedingFrequency.OnceMonth]: 30,
    [FeedingFrequency.Rarely]: 60,
  };

  const daysToAdd = frequencyMap[feedingFrequency];
  const nextFeedingDate = addDays(lastFedDate, daysToAdd);

  return format(nextFeedingDate, "yyyy-MM-dd");
};
