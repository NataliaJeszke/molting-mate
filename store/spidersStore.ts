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
  isFavourite: boolean;
};

type SpidersState = {
  nextId: number;
  spiders: SpiderType[];
  addSpider: (spider: Omit<SpiderType, "id">) => void;
  removeSpider: (spiderId: string) => void;
  addToFavorites: (spiderId: string) => void;
  removeFromFavorites: (spiderId: string) => void;
};

export const useSpidersStore = create(
  persist<SpidersState>(
    (set) => ({
      spiders: [],
      nextId: 1,
      addSpider: (spider: Omit<SpiderType, "id">) =>
        set((state) => ({
          spiders: [
            {
              id: String(state.spiders.length + 1),
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
      addToFavorites: (spiderId: string) =>
        set((state) => ({
          ...state,
          spiders: state.spiders.map((spider) =>
            spider.id === spiderId
              ? { ...spider, isFavourite: true }
              : spider
          ),
        })),

      removeFromFavorites: (spiderId: string) =>
        set((state) => ({
          ...state,
          spiders: state.spiders.map((spider) =>
            spider.id === spiderId
              ? { ...spider, isFavourite: false }
              : spider
          ),
        })),
    }),
    {
      name: "moltingmate-spider-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
