import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SpiderType = {
    id: string;
    name: string;
    age: string;
    spiderType: string;
    spiderSpecies: string;
    lastFed: string;
    feedingFrequency: string;
    lastMolt: string;
    imageUri: string | undefined;
  };

  
type SpidersState = {
    nextId: number;
    spiders: SpiderType[];
    addSpider: (spider: Omit<SpiderType, "id">) => void;
    removeSpider: (spiderId: string) => void;
  };

export const useSpidersStore = create(
  persist<SpidersState>(
    (set) => ({
      spiders: [],
      nextId: 1,
      addSpider: (spider: Omit<SpiderType, "id">) =>
        set((state) => ({
          nextId: state.nextId + 1,
          spiders: [
            {
              id: String(state.nextId),
              ...spider,
            },
            ...state.spiders,
          ],
        })),
      removeSpider: (spiderId: string) => {
        return set((state) => {
          return {
            ...state,
            spiders: state.spiders.filter((spider) => spider.id !== spiderId),
          };
        });
      },
    }),
    {
      name: "moltingmate-spider-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);