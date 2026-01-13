import * as SQLite from "expo-sqlite";
import { seedSpiderSpecies } from "./seedSpecies";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { IndividualType } from "@/constants/IndividualType.enums";

export interface Spider {
  id: string;
  name: string;
  age: number;
  spiderSpecies: number;
  individualType: string;
  lastFed: string;
  feedingFrequency: string;
  lastMolt: string;
  imageUri: string;
  isFavourite: boolean;
  status: string;
  nextFeedingDate: string;
}

export interface SpiderDetailType {
  id: string;
  name: string;
  age: number;
  spiderSpecies: string;
  individualType: IndividualType;
  lastFed: string;
  feedingFrequency: FeedingFrequency;
  lastMolt: string;
  imageUri: string;
  isFavourite: boolean;
  status: string;
  nextFeedingDate: string;
  feedingHistory: [];
  moltingHistory: [];
  documents: [];
}

export interface SpiderSpecies {
  id: number;
  name: string;
}

let db: SQLite.SQLiteDatabase | null = null;
let dbInitPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let dbReady = false;

export const isDatabaseReady = (): boolean => dbReady;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  // Return existing database if already initialized
  if (db) {
    return db;
  }

  // If initialization is in progress, wait for it
  if (dbInitPromise) {
    return dbInitPromise;
  }

  // Start initialization
  dbInitPromise = (async () => {
    const database = await SQLite.openDatabaseAsync("spiders.db");

    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS spider_species (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS spiders (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        age INTEGER,
        spiderSpecies INTEGER,
        individualType TEXT,
        lastFed TEXT,
        feedingFrequency TEXT,
        lastMolt TEXT,
        imageUri TEXT,
        isFavourite BOOLEAN,
        status TEXT,
        nextFeedingDate TEXT,
        FOREIGN KEY (spiderSpecies) REFERENCES spider_species(id) ON DELETE SET NULL
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

      CREATE TABLE IF NOT EXISTS spider_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spider_id TEXT NOT NULL,
        document_uri TEXT NOT NULL,
        FOREIGN KEY (spider_id) REFERENCES spiders(id) ON DELETE CASCADE
      );
    `);

    db = database;
    dbReady = true;
    return database;
  })();

  return dbInitPromise;
};

export const initDatabase = async () => {
  const database = await getDatabase();
  await seedSpiderSpecies(database);
};

export const getAllSpiders = async (): Promise<Spider[]> => {
  try {
    const database = await getDatabase();

    const result = await database.getAllAsync(`
      SELECT
        spiders.*,
        spider_species.name as spiderSpecies
      FROM spiders
      LEFT JOIN spider_species ON spiders.spiderSpecies = spider_species.id
    `);

    return result as Spider[];
  } catch (error) {
    console.error("Błąd podczas pobierania pająków:", error);
    return [];
  }
};

export const addSpider = async (spider: any) => {
  try {
    const database = await getDatabase();

    await database.execAsync(`
      INSERT INTO spiders (id, name, age, spiderSpecies, individualType, lastFed, feedingFrequency, lastMolt, imageUri, isFavourite, status, nextFeedingDate)
      VALUES ('${spider.id}', '${spider.name}', ${spider.age}, '${spider.spiderSpecies}', '${spider.individualType}', '${spider.lastFed}', '${spider.feedingFrequency}', '${spider.lastMolt}', '${spider.imageUri}', ${spider.isFavourite ? 1 : 0}, '${spider.status}', '${spider.nextFeedingDate}');
    `);
  } catch (error) {
    console.error("Błąd podczas dodawania pająka:", error);
  }
};

export const updateSpider = async (spider: any) => {
  try {
    const database = await getDatabase();

    if (spider.lastFed) {
      const existingFeed = await database.getFirstAsync(
        `SELECT * FROM feeding_history WHERE spider_id = ? AND fed_at = ?`,
        [spider.id, spider.lastFed],
      );

      if (!existingFeed) {
        await database.runAsync(
          `INSERT INTO feeding_history (spider_id, fed_at) VALUES (?, ?)`,
          [spider.id, spider.lastFed],
        );
      }

      const latestFeedingDate = await database.getFirstAsync<{
        fed_at: string;
      }>(
        `SELECT fed_at FROM feeding_history
         WHERE spider_id = ?
         ORDER BY datetime(fed_at) DESC
         LIMIT 1`,
        [spider.id],
      );

      if (latestFeedingDate && latestFeedingDate.fed_at) {
        spider.lastFed = latestFeedingDate.fed_at;
      }
    }

    if (spider.lastMolt) {
      const existingMolt = await database.getFirstAsync(
        `SELECT * FROM molting_history WHERE spider_id = ? AND molted_at = ?`,
        [spider.id, spider.lastMolt],
      );

      if (!existingMolt) {
        await database.runAsync(
          `INSERT INTO molting_history (spider_id, molted_at) VALUES (?, ?)`,
          [spider.id, spider.lastMolt],
        );
      }

      const latestMoltingDate = await database.getFirstAsync<{
        molted_at: string;
      }>(
        `SELECT molted_at FROM molting_history
         WHERE spider_id = ?
         ORDER BY datetime(molted_at) DESC
         LIMIT 1`,
        [spider.id],
      );

      if (latestMoltingDate && latestMoltingDate.molted_at) {
        spider.lastMolt = latestMoltingDate.molted_at;
      }
    }

    await database.runAsync(
      `UPDATE spiders SET
       name = ?,
       age = ?,
       spiderSpecies = ?,
       individualType = ?,
       lastFed = ?,
       feedingFrequency = ?,
       lastMolt = ?,
       imageUri = ?,
       isFavourite = ?,
       status = ?,
       nextFeedingDate = ?
       WHERE id = ?`,
      [
        spider.name,
        spider.age,
        spider.spiderSpecies,
        spider.individualType,
        spider.lastFed,
        spider.feedingFrequency,
        spider.lastMolt,
        spider.imageUri,
        spider.isFavourite ? 1 : 0,
        spider.status,
        spider.nextFeedingDate,
        spider.id,
      ],
    );

    if (spider.documentUri) {
      const existingDocument = await database.getFirstAsync(
        `SELECT * FROM spider_documents WHERE spider_id = ? AND document_uri = ?`,
        [spider.id, spider.documentUri],
      );

      const existingDocsCount: { count: number }[] = await database.getAllAsync(
        `SELECT COUNT(*) as count FROM spider_documents WHERE spider_id = ?`,
        [spider.id],
      );

      if (!existingDocument && existingDocsCount[0].count < 5) {
        await database.runAsync(
          `INSERT INTO spider_documents (spider_id, document_uri) VALUES (?, ?)`,
          [spider.id, spider.documentUri],
        );
      }
    }
  } catch (error) {
    console.error("Błąd podczas aktualizacji pająka:", error);
  }
};

export const deleteSpider = async (spiderId: string) => {
  try {
    const database = await getDatabase();

    await database.runAsync(`DELETE FROM spiders WHERE id = ?`, [spiderId]);
  } catch (error) {
    console.error("Błąd podczas usuwania pająka:", error);
  }
};

export const addFeedingEntry = async (spiderId: string, fedAt: string) => {
  try {
    const database = await getDatabase();

    await database.runAsync(
      `INSERT INTO feeding_history (spider_id, fed_at) VALUES (?, ?)`,
      [spiderId, fedAt],
    );
  } catch (error) {
    console.error("Błąd podczas dodawania wpisu karmienia:", error);
  }
};

export const addMoltingEntry = async (spiderId: string, moltedAt: string) => {
  try {
    const database = await getDatabase();

    await database.runAsync(
      `INSERT INTO molting_history (spider_id, molted_at) VALUES (?, ?)`,
      [spiderId, moltedAt],
    );
  } catch (error) {
    console.error("Błąd podczas dodawania wpisu linienia:", error);
  }
};

export const addDocumentToSpider = async (
  spiderId: string,
  documentUri: string,
) => {
  try {
    // Don't add empty documents
    if (!documentUri || documentUri.trim() === "") {
      return false;
    }

    const database = await getDatabase();

    // Check if this exact document already exists (prevent duplicates)
    const existingDoc = await database.getFirstAsync<{ id: number }>(
      `SELECT id FROM spider_documents WHERE spider_id = ? AND document_uri = ?`,
      [spiderId, documentUri],
    );

    if (existingDoc) {
      console.warn("⚠️ Ten dokument już istnieje dla tego pająka.");
      return false;
    }

    const existingDocs: { count: number }[] = await database.getAllAsync(
      `SELECT COUNT(*) as count FROM spider_documents WHERE spider_id = ?`,
      [spiderId],
    );

    if (existingDocs[0].count >= 5) {
      console.warn("⚠️ Pająk ma już 5 dokumentów. Nie można dodać więcej.");
      return false;
    }

    await database.runAsync(
      `INSERT INTO spider_documents (spider_id, document_uri) VALUES (?, ?)`,
      [spiderId, documentUri],
    );

    return true;
  } catch (error) {
    console.error("Błąd podczas dodawania dokumentu do pająka:", error);
    return false;
  }
};

export const deleteDocument = async (documentId: number) => {
  try {
    const database = await getDatabase();

    await database.runAsync(`DELETE FROM spider_documents WHERE id = ?`, [
      documentId,
    ]);
  } catch (error) {
    console.error("Błąd podczas usuwania dokumentu:", error);
  }
};

export const checkSpiderRecords = async (spiderId: string) => {
  try {
    const database = await getDatabase();

    const feedingHistory = await database.getAllAsync(
      `SELECT * FROM feeding_history WHERE spider_id = ?`,
      [spiderId],
    );

    const moltingHistory = await database.getAllAsync(
      `SELECT * FROM molting_history WHERE spider_id = ?`,
      [spiderId],
    );

    const spiderDocuments = await database.getAllAsync(
      `SELECT * FROM spider_documents WHERE spider_id = ?`,
      [spiderId],
    );

    if (feedingHistory.length === 0) {
      console.warn("Brak historii karmienia dla pająka o ID:", spiderId);
    }

    if (moltingHistory.length === 0) {
      console.warn("Brak historii linienia dla pająka o ID:", spiderId);
    }

    if (spiderDocuments.length === 0) {
      console.warn("Brak dokumentów dla pająka o ID:", spiderId);
    }
  } catch (error) {
    console.error("Błąd podczas sprawdzania danych pająka:", error);
  }
};

export const getSpiderById = async (spiderId: string) => {
  try {
    const database = await getDatabase();

    const spider = await database.getFirstAsync(
      `
      SELECT
        s.id,
        s.name,
        s.age,
        ss.name AS spiderSpecies,
        s.individualType,
        s.lastFed,
        s.feedingFrequency,
        s.lastMolt,
        s.imageUri,
        s.isFavourite,
        s.status,
        s.nextFeedingDate
      FROM spiders s
      LEFT JOIN spider_species ss ON s.spiderSpecies = ss.id
      WHERE s.id = ?
      `,
      [spiderId],
    );

    if (!spider) {
      console.warn(`⚠️ Nie znaleziono pająka o ID: ${spiderId}`);
      return null;
    }

    const feedingHistory = await database.getAllAsync(
      `SELECT * FROM feeding_history WHERE spider_id = ? ORDER BY fed_at DESC`,
      [spiderId],
    );

    const moltingHistory = await database.getAllAsync(
      `SELECT * FROM molting_history WHERE spider_id = ? ORDER BY molted_at DESC`,
      [spiderId],
    );

    const documents = await database.getAllAsync(
      `SELECT * FROM spider_documents WHERE spider_id = ?`,
      [spiderId],
    );

    return {
      ...spider,
      feedingHistory,
      moltingHistory,
      documents,
    } as SpiderDetailType;
  } catch (error) {
    console.error("Błąd podczas pobierania danych pająka:", error);
    return null;
  }
};

export const getAllSpiderSpecies = async (): Promise<SpiderSpecies[]> => {
  const database = await getDatabase();
  const results = await database.getAllAsync<SpiderSpecies>(
    "SELECT * FROM spider_species",
  );
  return results;
};

export const addSpecies = async (name: string): Promise<number> => {
  const database = await getDatabase();
  const result = await database.runAsync(
    "INSERT INTO spider_species (name) VALUES (?)",
    [name],
  );
  return result.lastInsertRowId as number;
};

export const countSpidersBySpecies = async (
  speciesId: number,
): Promise<number> => {
  try {
    const database = await getDatabase();

    const result = await database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM spiders WHERE spiderSpecies = ?`,
      [speciesId],
    );

    return result?.count ?? 0;
  } catch (error) {
    console.error("Błąd podczas liczenia pająków dla gatunku:", error);
    return -1;
  }
};

export const deleteSpiderSpecies = async (
  speciesId: number,
): Promise<{ success: boolean; count: number }> => {
  try {
    const database = await getDatabase();

    const count = await countSpidersBySpecies(speciesId);

    if (count > 0) {
      console.warn(
        `❌ Gatunek ma ${count} przypisanych pająków, nie można usunąć.`,
      );
      return { success: false, count };
    }

    await database.runAsync(`DELETE FROM spider_species WHERE id = ?`, [
      speciesId,
    ]);
    return { success: true, count: 0 };
  } catch (error) {
    console.error("Błąd podczas usuwania gatunku pająka:", error);
    return { success: false, count: -1 };
  }
};

export const updateSpiderSpeciesName = async (id: number, newName: string) => {
  try {
    const database = await getDatabase();

    await database.runAsync(`UPDATE spider_species SET name = ? WHERE id = ?`, [
      newName,
      id,
    ]);

    return {
      success: true,
      message: `Zaktualizowano nazwę gatunku.`,
      id,
      name: newName,
    };
  } catch (error) {
    if ((error as any)?.message?.includes("UNIQUE constraint failed")) {
      console.error("❌ Gatunek o tej nazwie już istnieje.");
      return {
        success: false,
        message: "Gatunek o tej nazwie już istnieje.",
      };
    } else {
      console.error("Błąd podczas aktualizacji gatunku:", error);
      return {
        success: false,
        message: "Błąd podczas aktualizacji gatunku.",
        error,
      };
    }
  }
};

export const countSpiders = async () => {
  const database = await getDatabase();
  await database.getFirstAsync("SELECT COUNT(*) as count FROM spiders");
};

export const getSpeciesIdByName = async (
  name: string,
): Promise<number | null> => {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ id: number }>(
    `SELECT id FROM spider_species WHERE name = ?`,
    [name],
  );
  return result?.id ?? null;
};
