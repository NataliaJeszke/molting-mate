import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase;

// Funkcja inicjalizacji bazy danych — wywołaj ją raz, np. w App.tsx
export const initDatabase = async () => {
  db = await SQLite.openDatabaseAsync("spiders.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS spiders (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      age INTEGER,
      spiderSpecies TEXT,
      individualType TEXT,
      lastFed TEXT,
      feedingFrequency TEXT,
      lastMolt TEXT,
      imageUri TEXT,
      isFavourite INTEGER,
      status TEXT,
      nextFeedingDate TEXT
    );

    CREATE TABLE IF NOT EXISTS feeding_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spider_id TEXT,
      fed_at TEXT,
      FOREIGN KEY (spider_id) REFERENCES spiders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS molting_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spider_id TEXT,
      molted_at TEXT,
      FOREIGN KEY (spider_id) REFERENCES spiders(id) ON DELETE CASCADE
    );
  `);
};

export const getAllSpiders = async () => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    const result = await db.getAllAsync("SELECT * FROM spiders");
    return result;
  } catch (error) {
    console.error("Błąd podczas pobierania pająków:", error);
    return [];
  }
};

export const addSpider = async (spider: any) => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    await db.execAsync(`
      INSERT INTO spiders (id, name, age, spiderSpecies, individualType, lastFed, feedingFrequency, lastMolt, imageUri, isFavourite, status, nextFeedingDate)
      VALUES ('${spider.id}', '${spider.name}', ${spider.age}, '${spider.spiderSpecies}', '${spider.individualType}', '${spider.lastFed}', '${spider.feedingFrequency}', '${spider.lastMolt}', '${spider.imageUri}', ${spider.isFavourite ? 1 : 0}, '${spider.status}', '${spider.nextFeedingDate}');
    `);
    const result = await db.getFirstAsync(
      `SELECT * FROM spiders WHERE id = ?`,
      [spider.id],
    );
    console.log("✅ Dodano pająka do bazy:", result);
  } catch (error) {
    console.error("Błąd podczas dodawania pająka:", error);
  }
};
