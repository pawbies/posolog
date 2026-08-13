import { sql } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const bloodPressureReadings = sqliteTable("blood_pressure_readings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  systolic: integer("systolic").notNull(),
  diastolic: integer("diastolic").notNull(),
  pulse: integer("pulse"),
  readingAt: integer("reading_at", { mode: "timestamp" }).notNull(),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql `(unixepoch() * 1000)`)
});