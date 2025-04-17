import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";

export type Spider = {
  id: string;
  name: string;
  age: string;
  spiderSpecies: string;
  lastFed: string;
  feedingFrequency: FeedingFrequency;
  lastMolt: string;
  imageUri: string | undefined;
  isFavourite: boolean;
  feedingHistoryData: string[];
  moltingHistoryData: string[];
  status?: FeedingStatus | string | null;
  nextFeedingDate?: string;
};
