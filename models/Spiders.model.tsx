import { FeedingStatus } from "@/core/FeedingListComponent/FeedingListComponent";

export type Spider = {
    id: string;
    name: string;
    age: string;
    spiderType: string;
    spiderSpecies: string;
    lastFed: string;
    feedingFrequency: string;
    lastMolt: string;
    imageUri: string | undefined;
    isFavourite: boolean;
    status?: FeedingStatus | string;
  };