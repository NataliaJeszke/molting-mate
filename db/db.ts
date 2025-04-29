import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

const DATABASE_NAME = "spiders";
// 1. Otwieramy bazę
const expoDB = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDB);
