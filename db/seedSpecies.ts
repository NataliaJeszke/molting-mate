import * as SQLite from "expo-sqlite";

const spiderSpeciesList = [
  "Brachypelma hamorii",
  "Brachypelma albopilosum",
  "Chromatopelma cyaneopubescens",
  "Aphonopelma chalcodes",
  "Grammostola rosea",
  "Grammostola cala",
  "Lasiodora parahybana",
  "Phidippus regius",
  "Phidippus audax",
  "Salticus scenicus",
  "Salticus cingulatus",
  "Marpissa muscosa",
  "Menemerus semilimbatus",
  "Araneus diadematus",
  "Araneus quadratus",
  "Neoscona crucifera",
  "Cyclosa conica",
  "Zygiella x-notata",
  "Lycosa tarantula",
  "Lycosa tarentula",
  "Hogna radiata",
  "Pardosa amentata",
  "Pardosa palustris",
  "Agelena labyrinthica",
  "Tegenaria domestica",
  "Tegenaria atrica",
  "Coelotes terrestris",
  "Araneus marmoreus",
  "Loxosceles reclusa",
  "Loxosceles deserta",
  "Loxosceles laeta",
  "Latrodectus mactans",
  "Latrodectus hesperus",
  "Latrodectus geometricus",
  "Argyroneta aquatica",
];

export const seedSpiderSpecies = async (db: SQLite.SQLiteDatabase) => {
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM spider_species",
  );

  if (result && result.count === 0) {
    const insertQuery = "INSERT INTO spider_species (name) VALUES (?)";
    const insertPromises = spiderSpeciesList.map((species) =>
      db.runAsync(insertQuery, [species]),
    );
    await Promise.all(insertPromises);
    console.log("Initial spider species seeded.");
  } else {
    console.log("Spider species already seeded.");
  }
};
