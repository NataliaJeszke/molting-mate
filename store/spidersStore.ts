import { create } from "zustand";

import {
  addDocumentToSpider,
  addSpider,
  deleteDocument,
  deleteSpider,
  getAllSpiders,
  getSpiderById,
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

  getSpiderById: async (spiderId: string) => {
    try {
      const spiderData = await getSpiderById(spiderId);
      console.log("Pająk:", spiderData);
      if (!spiderData) throw new Error("Nie znaleziono pająka");
      return spiderData;
    } catch (error: any) {
      console.error("Błąd przy getSpiderByIdFromDB:", error);
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

  addDocumentToSpider: async (spiderId: string, documentUri: string) => {
    const result = await addDocumentToSpider(spiderId, documentUri);
    await (get() as SpidersState).fetchSpiders();
    return result;
  },

  deleteSpiderDocument: async (documentId: number) => {
    try {
      await deleteDocument(documentId);
      await (get() as SpidersState).fetchSpiders();
      return { success: true, message: "Dokument został usunięty." };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        success: false,
        message: "Wystąpił błąd podczas usuwania dokumentu:",
        error,
      };
    }
  },
}));
