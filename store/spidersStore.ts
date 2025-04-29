import { create } from "zustand";
import { persist } from "zustand/middleware";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm/sql";

import { SpiderDB, spiders } from "@/db/schema";

type SpidersState = {
  spiders: SpiderDB[];
  nextId: number;
  db: ExpoSQLiteDatabase<{ spiders: typeof spiders }> | null;
  setDB: (db: ReturnType<typeof drizzle>) => void;
  loadSpidersFromDB: () => Promise<void>;
  addSpider: (spider: Omit<SpiderDB, "id">) => Promise<void>;
  updateSpider: (
    id: number,
    updatedSpider: Omit<SpiderDB, "id">,
  ) => Promise<void>;
  removeSpider: (id: number) => Promise<void>;
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
            status: newSpider.status ?? undefined,
            nextFeedingDate: newSpider.nextFeedingDate,
          })
          .run();

        set((state) => ({
          spiders: [newSpider, ...state.spiders],
          nextId: newId + 1,
        }));
      },

      updateSpider: async (id: number, updatedSpider: Omit<SpiderDB, "id">) => {
        const db = get().db;
        if (!db) return;

        db.update(spiders)
          .set({
            name: updatedSpider.name,
            age: updatedSpider.age,
            spiderSpecies: updatedSpider.spiderSpecies,
            individualType: updatedSpider.individualType,
            lastFed: updatedSpider.lastFed,
            feedingFrequency: updatedSpider.feedingFrequency,
            lastMolt: updatedSpider.lastMolt,
            imageUri: updatedSpider.imageUri,
            isFavourite: updatedSpider.isFavourite ?? false,
            status: updatedSpider.status,
            nextFeedingDate: updatedSpider.nextFeedingDate,
          })
          .where(eq(spiders.id, id))
          .run();

        set((state) => ({
          spiders: state.spiders.map((spider) =>
            spider.id === id ? { ...spider, id, ...updatedSpider } : spider,
          ),
        }));
      },

      removeSpider: async (id: number) => {
        const db = get().db;
        if (!db) return;

        db.delete(spiders).where(eq(spiders.id, id)).run();

        set((state) => ({
          spiders: state.spiders.filter((spider) => spider.id !== id),
        }));
      },
    }),
    {
      name: "spiders-storage",
    },
  ),
);
