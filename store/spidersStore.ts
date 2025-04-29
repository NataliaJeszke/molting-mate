import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Spider } from "@/models/Spider.model";
import { db } from "@/db/db";
import { SpiderDB, spiders } from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

// type SpidersState = {
//   nextId: number;
//   spiders: Spider[];
//   addSpider: (spider: Omit<Spider, "id">) => void;
//   removeSpider: (spiderId: string) => void;
//   addToFavorites: (spiderId: string) => void;
//   removeFromFavorites: (spiderId: string) => void;
//   updateSpider: (spiderId: string, updates: Partial<Spider>) => void;
// };

type SpidersState = {
  spiders: SpiderDB[];
  nextId: number;
  db: ExpoSQLiteDatabase<{ spiders: typeof spiders }> | null;
  setDB: (db: ReturnType<typeof drizzle>) => void;
  loadSpidersFromDB: () => Promise<void>;
  addSpider: (spider: Omit<SpiderDB, "id">) => Promise<void>;
};

export const useSpidersStore = create(
  persist<SpidersState>(
    (set, get) => ({
      spiders: [],
      nextId: 1,
      db: null,

      setDB: (db) =>
        set({
          db: db as unknown as ExpoSQLiteDatabase<{ spiders: typeof spiders }>,
        }),

      loadSpidersFromDB: async () => {
        const db = get().db;
        if (!db) return;

        const results = await db.query.spiders.findMany();
        set({
          spiders: results.map((r) => ({
            ...r,
            id: r.id,
          })),
          nextId:
            results.length > 0 ? Math.max(...results.map((r) => r.id)) + 1 : 1,
        });
      },

      addSpider: async (spider: Omit<SpiderDB, "id">) => {
        const db = get().db;
        if (!db) return;

        const newId = get().nextId;
        const newSpider = { id: newId, ...spider };

        db.insert(spiders)
          .values({
            id: newId,
            name: newSpider.name,
            age: newSpider.age,
            spiderSpecies: newSpider.spiderSpecies,
            individualType: newSpider.individualType,
            lastFed: newSpider.lastFed,
            feedingFrequency: newSpider.feedingFrequency,
            lastMolt: newSpider.lastMolt,
            imageUri: newSpider.imageUri,
            isFavourite: newSpider.isFavourite ?? false,
            status: newSpider.status,
            nextFeedingDate: newSpider.nextFeedingDate,
          })
          .run();

        set((state) => ({
          spiders: [newSpider, ...state.spiders],
          nextId: newId + 1,
        }));
      },
    }),
    {
      name: "spiders-storage",
    },
  ),
);
// export const useSpidersStore = create(
//   persist<SpidersState>(
//     (set) => ({
//       spiders: [],
//       nextId: 1,
//       addSpider: (spider: Omit<Spider, "id">) =>
//         set((state) => ({
//           spiders: [
//             {
//               id: String(state.spiders.length + 1),
//               ...spider,
//             },
//             ...state.spiders,
//           ],
//         })),
//       removeSpider: (spiderId: string) => {
//         return set((state) => {
//           return {
//             ...state,
//             spiders: state.spiders.filter((spider) => spider.id !== spiderId),
//           };
//         });
//       },
//       addToFavorites: (spiderId: string) =>
//         set((state) => ({
//           ...state,
//           spiders: state.spiders.map((spider) =>
//             spider.id === spiderId ? { ...spider, isFavourite: true } : spider,
//           ),
//         })),

//       removeFromFavorites: (spiderId: string) =>
//         set((state) => ({
//           ...state,
//           spiders: state.spiders.map((spider) =>
//             spider.id === spiderId ? { ...spider, isFavourite: false } : spider,
//           ),
//         })),
//       updateSpider: (spiderId, updates) =>
//         set((state) => ({
//           ...state,
//           spiders: state.spiders.map((spider) =>
//             spider.id === spiderId ? { ...spider, ...updates } : spider,
//           ),
//         })),
//     }),
//     {
//       name: "moltingmate-spider-store",
//       storage: createJSONStorage(() => AsyncStorage),
//     },
//   ),
// );
