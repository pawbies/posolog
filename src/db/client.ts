import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

export const expoDb = openDatabaseSync("posolog.db", {
  enableChangeListener: true
});

expoDb.execSync("PRAGMA journal_mode = WAL;");

export const db = drizzle(expoDb, { schema });

export function enableForeignKeys() {
  expoDb.execSync("PRAGMA foreign_keys = ON;");
}