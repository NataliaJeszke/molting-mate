import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import {
  addDocumentToSpider,
  addSpider,
  deleteDocument,
  deleteSpider,
  getAllSpiders,
  getSpeciesIdByName,
  getSpiderById,
  updateSpider as updateSpiderInDb,
  SpiderDetailType,
} from "@/db/database";

// ============================================================================
// TYPES
// ============================================================================

interface SpiderById {
  [id: string]: SpiderDetailType;
}

type SortType = "lastMolt" | "lastFed" | "nextFeedingDate" | null;
type SortOrder = "asc" | "desc";

interface SpidersState {
  // Normalized state - O(1) lookups
  byId: SpiderById;
  allIds: string[];

  // UI state
  loading: boolean;
  error: string | null;
  sortOrder: SortOrder;
  sortType: SortType;

  // Version counter for reactive updates
  version: number;
}

interface SpidersActions {
  // Sorting
  setSortOrder: (order: SortOrder) => void;
  setSortType: (type: SortType) => void;

  // CRUD operations
  fetchSpiders: () => Promise<void>;
  getSpiderById: (spiderId: string) => Promise<SpiderDetailType | null>;
  addNewSpider: (spider: Omit<SpiderDetailType, "feedingHistory" | "moltingHistory" | "documents">) => Promise<void>;
  updateSpider: (spider: Partial<SpiderDetailType> & { id: string }) => Promise<void>;
  deleteSpider: (id: string) => Promise<void>;

  // Document operations
  addDocumentToSpider: (spiderId: string, documentUri: string) => Promise<boolean | undefined>;
  deleteSpiderDocument: (documentId: number) => Promise<{ success: boolean; message: string }>;

  // Selectors (derived data)
  getSpiders: () => SpiderDetailType[];
  getSpidersByIds: (ids: string[]) => SpiderDetailType[];
}

type SpidersStore = SpidersState & SpidersActions;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const normalizeSpiders = (spiders: SpiderDetailType[]): { byId: SpiderById; allIds: string[] } => {
  const byId: SpiderById = {};
  const allIds: string[] = [];

  for (const spider of spiders) {
    byId[spider.id] = spider;
    allIds.push(spider.id);
  }

  return { byId, allIds };
};

// ============================================================================
// STORE
// ============================================================================

export const useSpidersStore = create<SpidersStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    sortOrder: "desc",
    sortType: null,
    version: 0,

    // ========================================================================
    // SORTING
    // ========================================================================

    setSortOrder: (order) => set({ sortOrder: order }),
    setSortType: (type) => set({ sortType: type }),

    // ========================================================================
    // SELECTORS
    // ========================================================================

    getSpiders: () => {
      const { byId, allIds } = get();
      return allIds.map((id) => byId[id]).filter(Boolean);
    },

    getSpidersByIds: (ids) => {
      const { byId } = get();
      return ids.map((id) => byId[id]).filter(Boolean);
    },

    // ========================================================================
    // FETCH ALL (initial load only)
    // ========================================================================

    fetchSpiders: async () => {
      set({ loading: true, error: null });
      try {
        // getAllSpiders returns data with JOINed species name, cast to SpiderDetailType
        const spiders = (await getAllSpiders()) as unknown as SpiderDetailType[];
        const { byId, allIds } = normalizeSpiders(spiders);
        set({ byId, allIds, loading: false, version: get().version + 1 });
      } catch (error) {
        set({ error: (error as Error).message, loading: false });
      }
    },

    // ========================================================================
    // GET SINGLE SPIDER
    // ========================================================================

    getSpiderById: async (spiderId) => {
      try {
        // First check local state
        const localSpider = get().byId[spiderId];
        if (localSpider) return localSpider;

        // Fallback to DB
        const spiderData = await getSpiderById(spiderId);
        if (!spiderData) return null;

        // Update local state with fetched spider
        set((state) => ({
          byId: { ...state.byId, [spiderId]: spiderData },
          allIds: state.allIds.includes(spiderId)
            ? state.allIds
            : [...state.allIds, spiderId],
        }));

        return spiderData;
      } catch (error) {
        console.error("Error fetching spider:", error);
        return null;
      }
    },

    // ========================================================================
    // ADD NEW SPIDER
    // ========================================================================

    addNewSpider: async (spider) => {
      try {
        await addSpider(spider as any);

        // Fetch the complete spider data from DB (includes JOINed data)
        const newSpider = await getSpiderById(spider.id);
        if (!newSpider) throw new Error("Failed to fetch new spider");

        // Optimistic update - add to local state immediately
        set((state) => ({
          byId: { ...state.byId, [spider.id]: newSpider },
          allIds: [...state.allIds, spider.id],
          version: state.version + 1,
        }));
      } catch (error) {
        console.error("Error adding spider:", error);
        throw error;
      }
    },

    // ========================================================================
    // UPDATE SPIDER (single item - O(1))
    // ========================================================================

    updateSpider: async (spider) => {
      const { id, ...updates } = spider;

      try {
        // Get existing spider data to merge with updates
        const existingSpider = get().byId[id];
        if (!existingSpider) {
          throw new Error(`Spider not found in store: ${id}`);
        }

        // Merge existing data with updates
        let mergedSpider = { ...existingSpider, ...updates, id };

        // Handle species name to ID conversion if needed
        if (typeof mergedSpider.spiderSpecies === "string") {
          const speciesId = await getSpeciesIdByName(mergedSpider.spiderSpecies as string);
          if (speciesId) {
            mergedSpider.spiderSpecies = speciesId as unknown as string;
          }
        }

        // Update in SQLite with full data
        await updateSpiderInDb({
          id: mergedSpider.id,
          name: mergedSpider.name,
          age: mergedSpider.age,
          spiderSpecies: mergedSpider.spiderSpecies,
          individualType: mergedSpider.individualType,
          lastFed: mergedSpider.lastFed,
          feedingFrequency: mergedSpider.feedingFrequency,
          lastMolt: mergedSpider.lastMolt,
          imageUri: mergedSpider.imageUri || "",
          isFavourite: mergedSpider.isFavourite,
          status: mergedSpider.status || "",
          nextFeedingDate: mergedSpider.nextFeedingDate || "",
        });

        // Fetch fresh data from DB (includes JOINed species name, etc.)
        const updatedSpider = await getSpiderById(id);
        if (!updatedSpider) throw new Error("Failed to fetch updated spider");

        // Update ONLY this spider in local state - O(1) operation
        set((state) => ({
          byId: {
            ...state.byId,
            [id]: updatedSpider,
          },
          version: state.version + 1,
        }));
      } catch (error) {
        console.error("Error updating spider:", error);
        throw error;
      }
    },

    // ========================================================================
    // DELETE SPIDER
    // ========================================================================

    deleteSpider: async (id) => {
      try {
        await deleteSpider(id);

        // Remove from local state - O(1) for byId, O(n) for allIds
        set((state) => {
          const { [id]: removed, ...restById } = state.byId;
          return {
            byId: restById,
            allIds: state.allIds.filter((spiderId) => spiderId !== id),
            version: state.version + 1,
          };
        });
      } catch (error) {
        console.error("Error deleting spider:", error);
        throw error;
      }
    },

    // ========================================================================
    // DOCUMENT OPERATIONS
    // ========================================================================

    addDocumentToSpider: async (spiderId, documentUri) => {
      try {
        const result = await addDocumentToSpider(spiderId, documentUri);

        // Refresh only the affected spider
        const updatedSpider = await getSpiderById(spiderId);
        if (updatedSpider) {
          set((state) => ({
            byId: { ...state.byId, [spiderId]: updatedSpider },
            version: state.version + 1,
          }));
        }

        return result;
      } catch (error) {
        console.error("Error adding document:", error);
        return undefined;
      }
    },

    deleteSpiderDocument: async (documentId) => {
      try {
        await deleteDocument(documentId);

        // Increment version to trigger re-renders
        set((state) => ({ version: state.version + 1 }));

        return { success: true, message: "Document deleted." };
      } catch (error) {
        return { success: false, message: "Error deleting document." };
      }
    },
  }))
);

// ============================================================================
// CUSTOM HOOKS / SELECTORS
// ============================================================================

/**
 * Hook to get all spiders as an array (derived from normalized state)
 * Automatically updates when any spider changes
 */
export const useSpiders = (): SpiderDetailType[] => {
  const byId = useSpidersStore((state) => state.byId);
  const allIds = useSpidersStore((state) => state.allIds);
  const version = useSpidersStore((state) => state.version);

  // This will recompute when byId, allIds, or version changes
  return allIds.map((id) => byId[id]).filter(Boolean);
};

/**
 * Hook to get a single spider by ID
 * Only re-renders when this specific spider changes
 */
export const useSpider = (id: string): SpiderDetailType | undefined => {
  return useSpidersStore((state) => state.byId[id]);
};

/**
 * Hook to get sort configuration
 */
export const useSortConfig = () => {
  const sortOrder = useSpidersStore((state) => state.sortOrder);
  const sortType = useSpidersStore((state) => state.sortType);
  return { sortOrder, sortType };
};
