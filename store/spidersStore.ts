import { create } from "zustand";

import {
  addSpider,
  deleteSpider,
  getAllSpiders,
  Spider,
  updateSpider,
} from "@/db/database";

type SpidersState = {
  nextId: number;
  spiders: Spider[];
  fetchSpiders: () => Promise<void>;
};

export const useSpidersStore = create((set, get) => ({
  spiders: [],
  loading: false,
  error: null,

  fetchSpiders: async () => {
    set({ loading: true, error: null });
    try {
      const spiders = await getAllSpiders();
      set({ spiders, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  addNewSpider: async (spider: any) => {
    await addSpider(spider);
    await (get() as SpidersState).fetchSpiders();
  },

  updateSpider: async (spider: any) => {
    await updateSpider(spider);
    await (get() as SpidersState).fetchSpiders();
  },

  deleteSpider: async (id: string) => {
    await deleteSpider(id);
    await (get() as SpidersState).fetchSpiders();
  },
}));
