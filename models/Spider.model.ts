import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { IndividualType } from "@/constants/IndividualType.enums";

export type Spider = {
  id: string;
  name: string;
  age: number;
  spiderSpecies: string;
  individualType: IndividualType | undefined;
  lastFed: string;
  feedingFrequency: FeedingFrequency;
  lastMolt: string;
  imageUri: string | undefined;
  isFavourite: boolean;
  feedingHistoryData: string[];
  moltingHistoryData: string[];
  status?: FeedingStatus | string | null;
  nextFeedingDate?: string;
  documentUris?: string[];
};
