import * as SQLite from "expo-sqlite";
import { seedSpiderSpecies } from "./seedSpecies";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { IndividualType } from "@/models/Spider.model";

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

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
  db = await SQLite.openDatabaseAsync("spiders.db");

  await db.execAsync(`
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
  await seedSpiderSpecies(db);
};

// export const getAllSpiders = async () => {
//   try {
//     if (!db) throw new Error("Baza danych nie została zainicjalizowana");

//     const result = await db.getAllAsync("SELECT * FROM spiders");
//     return result;
//   } catch (error) {
//     console.error("Błąd podczas pobierania pająków:", error);
//     return [];
//   }
// };
export const getAllSpiders = async (): Promise<Spider[]> => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    const result = await db.getAllAsync(`
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

export const updateSpider = async (spider: any) => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    if (spider.lastFed) {
      const existingFeed = await db.getFirstAsync(
        `SELECT * FROM feeding_history WHERE spider_id = ? AND fed_at = ?`,
        [spider.id, spider.lastFed],
      );

      if (!existingFeed) {
        await db.runAsync(
          `INSERT INTO feeding_history (spider_id, fed_at) VALUES (?, ?)`,
          [spider.id, spider.lastFed],
        );
        console.log(`✅ Dodano wpis karmienia ${spider.lastFed}`);
      } else {
        console.log(`ℹ️ Karmienie z datą ${spider.lastFed} już istnieje`);
      }

      const latestFeedingDate = await db.getFirstAsync<{ fed_at: string }>(
        `SELECT fed_at FROM feeding_history 
         WHERE spider_id = ? 
         ORDER BY datetime(fed_at) DESC 
         LIMIT 1`,
        [spider.id],
      );

      if (latestFeedingDate && latestFeedingDate.fed_at) {
        spider.lastFed = latestFeedingDate.fed_at;
        console.log(
          `ℹ️ Ustawiono lastFed na najnowszą datę: ${spider.lastFed}`,
        );
      }
    }

    if (spider.lastMolt) {
      const existingMolt = await db.getFirstAsync(
        `SELECT * FROM molting_history WHERE spider_id = ? AND molted_at = ?`,
        [spider.id, spider.lastMolt],
      );

      if (!existingMolt) {
        await db.runAsync(
          `INSERT INTO molting_history (spider_id, molted_at) VALUES (?, ?)`,
          [spider.id, spider.lastMolt],
        );
        console.log(`✅ Dodano wpis linienia ${spider.lastMolt}`);
      } else {
        console.log(`ℹ️ Linienie z datą ${spider.lastMolt} już istnieje`);
      }

      const latestMoltingDate = await db.getFirstAsync<{ molted_at: string }>(
        `SELECT molted_at FROM molting_history 
         WHERE spider_id = ? 
         ORDER BY datetime(molted_at) DESC 
         LIMIT 1`,
        [spider.id],
      );

      if (latestMoltingDate && latestMoltingDate.molted_at) {
        spider.lastMolt = latestMoltingDate.molted_at;
        console.log(
          `ℹ️ Ustawiono lastMolt na najnowszą datę: ${spider.lastMolt}`,
        );
      }
    }

    await db.runAsync(
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
      const existingDocument = await db.getFirstAsync(
        `SELECT * FROM spider_documents WHERE spider_id = ? AND document_uri = ?`,
        [spider.id, spider.documentUri],
      );

      const existingDocsCount: { count: number }[] = await db.getAllAsync(
        `SELECT COUNT(*) as count FROM spider_documents WHERE spider_id = ?`,
        [spider.id],
      );

      if (existingDocument) {
        console.log(`ℹ️ Dokument już istnieje dla pająka ID ${spider.id}`);
      } else if (existingDocsCount[0].count >= 5) {
        console.warn(
          `⚠️ Pająk ID ${spider.id} ma już 5 dokumentów. Nie dodano.`,
        );
      } else {
        await db.runAsync(
          `INSERT INTO spider_documents (spider_id, document_uri) VALUES (?, ?)`,
          [spider.id, spider.documentUri],
        );
        console.log(`✅ Dodano nowy dokument dla pająka ID ${spider.id}`);
      }
    }

    console.log("✅ Zaktualizowano dane pająka:", spider.id);
  } catch (error) {
    console.error("Błąd podczas aktualizacji pająka:", error);
  }
};

export const deleteSpider = async (spiderId: string) => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    await db.runAsync(`DELETE FROM spiders WHERE id = ?`, [spiderId]);

    console.log(`🕷️ Usunięto pająka oraz powiązane dane: ${spiderId}`);
  } catch (error) {
    console.error("Błąd podczas usuwania pająka:", error);
  }
};

export const addFeedingEntry = async (spiderId: string, fedAt: string) => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    await db.runAsync(
      `INSERT INTO feeding_history (spider_id, fed_at) VALUES (?, ?)`,
      [spiderId, fedAt],
    );
    console.log(`✅ Dodano wpis karmienia dla pająka ID ${spiderId}`);
  } catch (error) {
    console.error("Błąd podczas dodawania wpisu karmienia:", error);
  }
};

export const addMoltingEntry = async (spiderId: string, moltedAt: string) => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    await db.runAsync(
      `INSERT INTO molting_history (spider_id, molted_at) VALUES (?, ?)`,
      [spiderId, moltedAt],
    );
    console.log(`Dodano wpis linienia dla pająka ID ${spiderId}`);
  } catch (error) {
    console.error("Błąd podczas dodawania wpisu linienia:", error);
  }
};

export const addDocumentToSpider = async (
  spiderId: string,
  documentUri: string,
) => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    const existingDocs: { count: number }[] = await db.getAllAsync(
      `SELECT COUNT(*) as count FROM spider_documents WHERE spider_id = ?`,
      [spiderId],
    );

    if (existingDocs[0].count >= 5) {
      console.warn("⚠️ Pająk ma już 5 dokumentów. Nie można dodać więcej.");
      return false;
    }

    await db.runAsync(
      `INSERT INTO spider_documents (spider_id, document_uri) VALUES (?, ?)`,
      [spiderId, documentUri],
    );

    console.log(`✅ Dodano dokument dla pająka ID ${spiderId}`);
    return true;
  } catch (error) {
    console.error("Błąd podczas dodawania dokumentu do pająka:", error);
    return false;
  }
};

export const deleteDocument = async (documentId: number) => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    await db.runAsync(`DELETE FROM spider_documents WHERE id = ?`, [
      documentId,
    ]);

    console.log(`Usunięto dokument ID ${documentId}`);
  } catch (error) {
    console.error("Błąd podczas usuwania dokumentu:", error);
  }
};

export const checkSpiderRecords = async (spiderId: string) => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    const feedingHistory = await db.getAllAsync(
      `SELECT * FROM feeding_history WHERE spider_id = ?`,
      [spiderId],
    );

    const moltingHistory = await db.getAllAsync(
      `SELECT * FROM molting_history WHERE spider_id = ?`,
      [spiderId],
    );

    const spiderDocuments = await db.getAllAsync(
      `SELECT * FROM spider_documents WHERE spider_id = ?`,
      [spiderId],
    );

    console.log("Historia karmienia:", feedingHistory);
    console.log("Historia linienia:", moltingHistory);
    console.log("Dokumenty:", spiderDocuments);

    if (feedingHistory.length === 0) {
      console.warn("Brak historii karmienia dla pająka o ID:", spiderId);
    }

    if (moltingHistory.length === 0) {
      console.warn("Brak historii linienia dla pająka o ID:", spiderId);
    }

    if (spiderDocuments.length === 0) {
      console.warn("Brak dokumentów dla pająka o ID:", spiderId);
    }

    if (
      feedingHistory.length > 0 &&
      moltingHistory.length > 0 &&
      spiderDocuments.length > 0
    ) {
      console.log(
        `Wszystkie dane zostały poprawnie dodane dla pająka ID ${spiderId}`,
      );
    }
  } catch (error) {
    console.error("Błąd podczas sprawdzania danych pająka:", error);
  }
};

export const getSpiderById = async (spiderId: string) => {
  try {
    if (!db) throw new Error("Baza danych nie została zainicjalizowana");

    // Pobieramy pająka wraz z nazwą gatunku
    const spider = await db.getFirstAsync(
      `
      SELECT 
        s.id,
        s.name,
        s.age,
        ss.name AS spiderSpecies, -- tu zamiast ID pobieramy nazwę
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

    const feedingHistory = await db.getAllAsync(
      `SELECT * FROM feeding_history WHERE spider_id = ? ORDER BY fed_at DESC`,
      [spiderId],
    );

    const moltingHistory = await db.getAllAsync(
      `SELECT * FROM molting_history WHERE spider_id = ? ORDER BY molted_at DESC`,
      [spiderId],
    );

    const documents = await db.getAllAsync(
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
  const results = await db.getAllAsync<SpiderSpecies>(
    "SELECT * FROM spider_species",
  );
  return results;
};

export const addSpecies = async (name: string): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("spiders.db");
  await db.runAsync("INSERT INTO spider_species (name) VALUES (?)", [name]);
};
