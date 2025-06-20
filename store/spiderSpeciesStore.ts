import {
  addSpecies,
  deleteSpiderSpecies,
  getAllSpiderSpecies,
  SpiderSpecies,
  updateSpiderSpeciesName,
} from "@/db/database";
import { create } from "zustand";

interface SpiderSpeciesOptions {
  label: string;
  value: number;
}

interface SpiderSpeciesStore {
  species: SpiderSpecies[];
  speciesOptions: SpiderSpeciesOptions[];
  fetchSpecies: () => Promise<void>;
  addSpeciesToDb: (name: string) => Promise<number>;
  deleteSpeciesFromDb: (
    id: number,
  ) => Promise<{ success: boolean; count: number }>;
  updateSpeciesInDb: (
    id: number,
    newName: string,
  ) => Promise<{
    success: boolean;
    message: string;
    id?: number;
    name?: string;
  }>;
}

export const useSpiderSpeciesStore = create<SpiderSpeciesStore>((set) => ({
  species: [],
  speciesOptions: [],

  fetchSpecies: async () => {
    const data = await getAllSpiderSpecies();
    const options = data.map((s) => ({
      label: s.name,
      value: s.id,
    }));
    set({ species: data, speciesOptions: options });
  },

  addSpeciesToDb: async (name: string): Promise<number> => {
    const insertedId = await addSpecies(name);
    const updatedSpecies = await getAllSpiderSpecies();
    const updatedOptions = updatedSpecies.map((s) => ({
      label: s.name,
      value: s.id,
    }));
    set({ species: updatedSpecies, speciesOptions: updatedOptions });
    return insertedId;
  },

  deleteSpeciesFromDb: async (
    id: number,
  ): Promise<{ success: boolean; count: number }> => {
    const result = await deleteSpiderSpecies(id);

    if (result.success) {
      const updatedSpecies = await getAllSpiderSpecies();
      const updatedOptions = updatedSpecies.map((s) => ({
        label: s.name,
        value: s.id,
      }));
      set({ species: updatedSpecies, speciesOptions: updatedOptions });
    } else {
      console.warn(
        `Nie można usunąć gatunku ID ${id} — przypisane pająki: ${result.count}`,
      );
    }

    return result;
  },

  updateSpeciesInDb: async (
    id: number,
    newName: string,
  ): Promise<{
    success: boolean;
    message: string;
    id?: number;
    name?: string;
  }> => {
    const result = await updateSpiderSpeciesName(id, newName);

    if (result.success) {
      const updatedSpecies = await getAllSpiderSpecies();
      const updatedOptions = updatedSpecies.map((s) => ({
        label: s.name,
        value: s.id,
      }));
      set({ species: updatedSpecies, speciesOptions: updatedOptions });
    }

    return result;
  },
}));
