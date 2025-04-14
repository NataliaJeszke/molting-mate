import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Spider } from "@/models/Spiders.model";

type SpidersState = {
  nextId: number;
  spiders: Spider[];
  addSpider: (spider: Omit<Spider, "id">) => void;
  removeSpider: (spiderId: string) => void;
  addToFavorites: (spiderId: string) => void;
  removeFromFavorites: (spiderId: string) => void;
  updateSpider: (spiderId: string, updates: Partial<Spider>) => void;
};

export const useSpidersStore = create(
  persist<SpidersState>(
    (set) => ({
      spiders: [],
      nextId: 1,
      addSpider: (spider: Omit<Spider, "id">) =>
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
            spider.id === spiderId ? { ...spider, isFavourite: true } : spider
          ),
        })),

      removeFromFavorites: (spiderId: string) =>
        set((state) => ({
          ...state,
          spiders: state.spiders.map((spider) =>
            spider.id === spiderId ? { ...spider, isFavourite: false } : spider
          ),
        })),
      updateSpider: (spiderId, updates) =>
        set((state) => ({
          ...state,
          spiders: state.spiders.map((spider) =>
            spider.id === spiderId ? { ...spider, ...updates } : spider
          ),
        })),
    }),
    {
      name: "moltingmate-spider-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
