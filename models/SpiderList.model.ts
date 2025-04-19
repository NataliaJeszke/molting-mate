import { FeedingStatus } from "@/constants/FeedingStatus.enums";

export type SpiderListItem = {
  id: string;
  name: string;
  date: string;
  imageUri?: string | null;
  status?: FeedingStatus | string | null;
};
