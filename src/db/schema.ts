import { sql } from "drizzle-orm";
import {
  AnySQLiteColumn, check, index, integer, real, sqliteTable, text, uniqueIndex,
} from "drizzle-orm/sqlite-core";

const createdAt = () =>
  integer({ mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`);

export const bloodPressureReadings = sqliteTable("blood_pressure_readings", {
  id: integer().primaryKey({ autoIncrement: true }),
  systolic: integer().notNull(),
  diastolic: integer().notNull(),
  pulse: integer(),
  readingAt: integer({ mode: "timestamp_ms" }).notNull(),
  createdAt: createdAt(),
}, (t) => [index("idx_bp_at").on(t.readingAt)]);

export const medications = sqliteTable("medications", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  color: text().notNull().default("#E8833A"),
  form: text({ enum: ["Tablet", "Capsule", "Patch", "Solution", "Inhaler", "Injection"] }).notNull(),
  route: text({ enum: ["Oral", "Sublingual", "Transdermal", "IV", "IM", "SC", "Inhaled", "Rectal"] }).notNull(),
  notes: text(),
  createdAt: createdAt(),
});

export const strengths = sqliteTable("strengths", {
  id: integer().primaryKey({ autoIncrement: true }),
  medicationId: integer().references(() => medications.id, { onDelete: "cascade" }).notNull(),
  unitInUse: text({ enum: ["tablet", "capsule", "ml", "patch", "actuation", "unit"] }).notNull().default("tablet"),
  position: integer().notNull().default(0),
  createdAt: createdAt(),
}, (t) => [index("idx_strengths_med").on(t.medicationId)]);

export const ingredients = sqliteTable("ingredients", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  notes: text(),
  molarMass: real(),
  parentIngredientId: integer().references((): AnySQLiteColumn => ingredients.id),
  maxPerDay: real(),
  therapeuticRangeMin: real(),
  therapeuticRangeMax: real(),
  toxicThreshold: real(),
  createdAt: createdAt(),
}, (t) => [
  uniqueIndex("idx_ingredients_name").on(t.name),
  check("ing_range", sql`${t.therapeuticRangeMin} IS NULL OR ${t.therapeuticRangeMax} IS NULL
    OR ${t.therapeuticRangeMin} <= ${t.therapeuticRangeMax}`),
]);

export const strengthIngredients = sqliteTable("strength_ingredients", {
  id: integer().primaryKey({ autoIncrement: true }),
  strengthId: integer().references(() => strengths.id, { onDelete: "cascade" }).notNull(),
  ingredientId: integer().references(() => ingredients.id).notNull(),
  amountBase: real().notNull(), // mg per unitInUse, free base
  displayAmount: real().notNull(),
  displayUnit: text().notNull(),
  saltFactor: real().notNull().default(1),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("idx_si_pair").on(t.strengthId, t.ingredientId)]);

export const dispositionModels = sqliteTable("disposition_models", {
  id: integer().primaryKey({ autoIncrement: true }),
  ingredientId: integer().references(() => ingredients.id, { onDelete: "cascade" }).notNull(),
  name: text(),
  source: text(),
  compartmentModel: text({ enum: ["one", "two", "three"] }).notNull().default("one"),
  parameterBasis: text({ enum: ["systemic", "apparent"] }).notNull().default("systemic"),
  fBasisPercent: integer(), // null = unknown (F cancels)
  v1: real().notNull(),
  v2: real(),
  v3: real(),
  cl: real().notNull(),
  q2: real(),
  q3: real(),
  isDefault: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
}, (t) => [
  index("idx_disp_ing").on(t.ingredientId),
  uniqueIndex("idx_disp_default").on(t.ingredientId).where(sql`${t.isDefault} = 1`),
  check("disp_shape", sql`
    (${t.compartmentModel} = 'one'   AND ${t.v2} IS NULL AND ${t.q2} IS NULL AND ${t.v3} IS NULL AND ${t.q3} IS NULL)
 OR (${t.compartmentModel} = 'two'   AND ${t.v2} IS NOT NULL AND ${t.q2} IS NOT NULL AND ${t.v3} IS NULL AND ${t.q3} IS NULL)
 OR (${t.compartmentModel} = 'three' AND ${t.v2} IS NOT NULL AND ${t.q2} IS NOT NULL AND ${t.v3} IS NOT NULL AND ${t.q3} IS NOT NULL)`),
  check("disp_fbasis", sql`${t.fBasisPercent} IS NULL OR (${t.fBasisPercent} > 0 AND ${t.fBasisPercent} <= 100)`),
]);

export const absorptionModels = sqliteTable("absorption_models", {
  id: integer().primaryKey({ autoIncrement: true }),
  strengthIngredientId: integer().references(() => strengthIngredients.id, { onDelete: "cascade" }).notNull(),
  name: text(),
  source: text(),
  fPercent: integer().notNull().default(100),
  isDefault: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
}, (t) => [
  index("idx_abs_si").on(t.strengthIngredientId),
  uniqueIndex("idx_abs_default").on(t.strengthIngredientId).where(sql`${t.isDefault} = 1`),
  check("abs_f", sql`${t.fPercent} > 0 AND ${t.fPercent} <= 100`),
]);

export const absorptionPhases = sqliteTable("absorption_phases", {
  id: integer().primaryKey({ autoIncrement: true }),
  absorptionModelId: integer().references(() => absorptionModels.id, { onDelete: "cascade" }).notNull(),
  position: integer().notNull(),
  kind: text({ enum: ["first_order", "zero_order"] }).notNull(),
  fractionPercent: integer().notNull().default(100), // sums to 100 per model
  kA: real(),
  tLag: real().notNull().default(0),
  inputDuration: real(),
  createdAt: createdAt(),
}, (t) => [
  uniqueIndex("idx_phase_pos").on(t.absorptionModelId, t.position),
  check("phase_fraction", sql`${t.fractionPercent} > 0 AND ${t.fractionPercent} <= 100`),
  check("phase_lag", sql`${t.tLag} >= 0`),
  check("phase_params", sql`
    (${t.kind} = 'first_order' AND ${t.kA} IS NOT NULL AND ${t.kA} > 0 AND ${t.inputDuration} IS NULL)
 OR (${t.kind} = 'zero_order' AND ${t.inputDuration} IS NOT NULL AND ${t.inputDuration} >= 0 AND ${t.kA} IS NULL)`),
]);

export const regimens = sqliteTable("regimens", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  notes: text(),
  timeZone: text().notNull().default("Europe/Vienna"),
  startDate: integer({ mode: "timestamp_ms" }).notNull(),
  endDate: integer({ mode: "timestamp_ms" }),
  createdAt: createdAt(),
});

export const regimenStrengths = sqliteTable("regimen_strengths", {
  id: integer().primaryKey({ autoIncrement: true }),
  regimenId: integer().references(() => regimens.id, { onDelete: "cascade" }).notNull(),
  strengthId: integer().references(() => strengths.id).notNull(),
  rrule: text().notNull(),
  dtstart: integer({ mode: "timestamp_ms" }).notNull(),
  timesOfDay: text({ mode: "json" }).$type<string[]>().notNull(),
  quantity: real().notNull(),
  startsOn: integer({ mode: "timestamp_ms" }).notNull(),
  endsOn: integer({ mode: "timestamp_ms" }),
  isPrn: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
}, (t) => [index("idx_rs_regimen").on(t.regimenId)]);

export const packs = sqliteTable("packs", {
  id: integer().primaryKey({ autoIncrement: true }),
  strengthId: integer().references(() => strengths.id).notNull(),
  quantity: real().notNull(),
  acquiredAt: integer({ mode: "timestamp_ms" }).notNull(),
  expiresAt: integer({ mode: "timestamp_ms" }),
  openedAt: integer({ mode: "timestamp_ms" }),
  createdAt: createdAt(),
}, (t) => [index("idx_packs_strength").on(t.strengthId)]);

export const doses = sqliteTable("doses", {
  id: integer().primaryKey({ autoIncrement: true }),
  strengthId: integer().references(() => strengths.id).notNull(),
  regimenStrengthId: integer().references(() => regimenStrengths.id, { onDelete: "set null" }),
  packId: integer().references(() => packs.id, { onDelete: "set null" }),
  quantity: real().notNull(),
  takenAt: integer({ mode: "timestamp_ms" }),
  scheduledFor: integer({ mode: "timestamp_ms" }),
  status: text({ enum: ["taken", "skipped", "missed"] }).notNull(),
  notes: text(),
  createdAt: createdAt(),
}, (t) => [
  index("idx_doses_taken").on(t.takenAt),
  uniqueIndex("idx_doses_sched").on(t.regimenStrengthId, t.scheduledFor),
  check("dose_taken", sql`${t.status} <> 'taken' OR ${t.takenAt} IS NOT NULL`),
]);

export const packAdjustments = sqliteTable("pack_adjustments", {
  id: integer().primaryKey({ autoIncrement: true }),
  packId: integer().references(() => packs.id, { onDelete: "cascade" }),
  quantity: real().notNull(),
  adjustmentAt: integer({ mode: "timestamp_ms" }).notNull(),
  reason: text(),
  createdAt: createdAt(),
}, (t) => [index("idx_adj_pack").on(t.packId)]);
