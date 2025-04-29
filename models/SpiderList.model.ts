import { FeedingStatus } from "@/constants/FeedingStatus.enums";

export type SpiderListItem = {
  id: number;
  name: string;
  date: string;
  imageUri?: string | undefined;
  status?: FeedingStatus | string | undefined;
};
