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
    console.log("Species added to DB:", name);
    console.log("Updated species:", updatedSpecies);
    console.log("Updated options:", updatedOptions);
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
      console.log("Species deleted from DB:", id);
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
// interface SpiderSpeciesStore {
//   spiderSpeciesList: SpiderSpeciesList[];
//   addSpecies: (label: string) => void;
//   removeSpecies: (value: string) => void;
// }

// export const useSpiderSpeciesStore = create<SpiderSpeciesStore>((set) => ({
//   spiderSpeciesList: [
//     { label: "Brachypelma hamorii", value: "Brachypelma hamorii" },
//     { label: "Brachypelma albopilosum", value: "Brachypelma albopilosum" },
//     {
//       label: "Chromatopelma cyaneopubescens",
//       value: "Chromatopelma cyaneopubescens",
//     },
//     { label: "Aphonopelma chalcodes", value: "Aphonopelma chalcodes" },
//     { label: "Grammostola rosea", value: "Grammostola rosea" },
//     { label: "Grammostola cala", value: "Grammostola cala" },
//     { label: "Lasiodora parahybana", value: "Lasiodora parahybana" },
//     { label: "Phidippus regius", value: "Phidippus regius" },
//     { label: "Phidippus audax", value: "Phidippus audax" },
//     { label: "Salticus scenicus", value: "Salticus scenicus" },
//     { label: "Salticus cingulatus", value: "Salticus cingulatus" },
//     { label: "Marpissa muscosa", value: "Marpissa muscosa" },
//     { label: "Menemerus semilimbatus", value: "Menemerus semilimbatus" },
//     { label: "Araneus diadematus", value: "Araneus diadematus" },
//     { label: "Araneus quadratus", value: "Araneus quadratus" },
//     { label: "Neoscona crucifera", value: "Neoscona crucifera" },
//     { label: "Cyclosa conica", value: "Cyclosa conica" },
//     { label: "Zygiella x-notata", value: "Zygiella x-notata" },
//     { label: "Lycosa tarantula", value: "Lycosa tarantula" },
//     { label: "Lycosa tarentula", value: "Lycosa tarentula" },
//     { label: "Hogna radiata", value: "Hogna radiata" },
//     { label: "Pardosa amentata", value: "Pardosa amentata" },
//     { label: "Pardosa palustris", value: "Pardosa palustris" },
//     { label: "Agelena labyrinthica", value: "Agelena labyrinthica" },
//     { label: "Tegenaria domestica", value: "Tegenaria domestica" },
//     { label: "Tegenaria atrica", value: "Tegenaria atrica" },
//     { label: "Coelotes terrestris", value: "Coelotes terrestris" },
//     { label: "Araneus marmoreus", value: "Araneus marmoreus" },
//     { label: "Loxosceles reclusa", value: "Loxosceles reclusa" },
//     { label: "Loxosceles deserta", value: "Loxosceles deserta" },
//     { label: "Loxosceles laeta", value: "Loxosceles laeta" },
//     { label: "Latrodectus mactans", value: "Latrodectus mactans" },
//     { label: "Latrodectus hesperus", value: "Latrodectus hesperus" },
//     { label: "Latrodectus geometricus", value: "Latrodectus geometricus" },
//     { label: "Argyroneta aquatica", value: "Argyroneta aquatica" },
//   ],
//   addSpecies: (label) =>
//     set((state) => {
//       if (state.spiderSpeciesList.some((species) => species.label === label)) {
//         console.log("Species already exists in the list");
//         return state;
//       }
//       return {
//         spiderSpeciesList: [
//           ...state.spiderSpeciesList,
//           { label, value: label },
//         ],
//       };
//     }),
//   removeSpecies: (value) =>
//     set((state) => ({
//       spiderSpeciesList: state.spiderSpeciesList.filter(
//         (species) => species.value !== value,
//       ),
//     })),
// }));
