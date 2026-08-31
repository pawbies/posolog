ALTER TABLE `blood_pressure_readings` RENAME COLUMN "reading_at" TO "readingAt";--> statement-breakpoint
ALTER TABLE `blood_pressure_readings` RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
CREATE TABLE `absorption_models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`strengthIngredientId` integer NOT NULL,
	`name` text,
	`source` text,
	`fPercent` integer DEFAULT 100 NOT NULL,
	`isDefault` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`strengthIngredientId`) REFERENCES `strength_ingredients`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "abs_f" CHECK("absorption_models"."fPercent" > 0 AND "absorption_models"."fPercent" <= 100)
);
--> statement-breakpoint
CREATE INDEX `idx_abs_si` ON `absorption_models` (`strengthIngredientId`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_abs_default` ON `absorption_models` (`strengthIngredientId`) WHERE "absorption_models"."isDefault" = 1;--> statement-breakpoint
CREATE TABLE `absorption_phases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`absorptionModelId` integer NOT NULL,
	`position` integer NOT NULL,
	`kind` text NOT NULL,
	`fractionPercent` integer DEFAULT 100 NOT NULL,
	`kA` real,
	`tLag` real DEFAULT 0 NOT NULL,
	`inputDuration` real,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`absorptionModelId`) REFERENCES `absorption_models`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "phase_fraction" CHECK("absorption_phases"."fractionPercent" > 0 AND "absorption_phases"."fractionPercent" <= 100),
	CONSTRAINT "phase_lag" CHECK("absorption_phases"."tLag" >= 0),
	CONSTRAINT "phase_params" CHECK(
    ("absorption_phases"."kind" = 'first_order' AND "absorption_phases"."kA" IS NOT NULL AND "absorption_phases"."kA" > 0 AND "absorption_phases"."inputDuration" IS NULL)
 OR ("absorption_phases"."kind" = 'zero_order' AND "absorption_phases"."inputDuration" IS NOT NULL AND "absorption_phases"."inputDuration" >= 0 AND "absorption_phases"."kA" IS NULL))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_phase_pos` ON `absorption_phases` (`absorptionModelId`,`position`);--> statement-breakpoint
CREATE TABLE `disposition_models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ingredientId` integer NOT NULL,
	`name` text,
	`source` text,
	`compartmentModel` text DEFAULT 'one' NOT NULL,
	`parameterBasis` text DEFAULT 'systemic' NOT NULL,
	`fBasisPercent` integer,
	`v1` real NOT NULL,
	`v2` real,
	`v3` real,
	`cl` real NOT NULL,
	`q2` real,
	`q3` real,
	`isDefault` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "disp_shape" CHECK(
    ("disposition_models"."compartmentModel" = 'one'   AND "disposition_models"."v2" IS NULL AND "disposition_models"."q2" IS NULL AND "disposition_models"."v3" IS NULL AND "disposition_models"."q3" IS NULL)
 OR ("disposition_models"."compartmentModel" = 'two'   AND "disposition_models"."v2" IS NOT NULL AND "disposition_models"."q2" IS NOT NULL AND "disposition_models"."v3" IS NULL AND "disposition_models"."q3" IS NULL)
 OR ("disposition_models"."compartmentModel" = 'three' AND "disposition_models"."v2" IS NOT NULL AND "disposition_models"."q2" IS NOT NULL AND "disposition_models"."v3" IS NOT NULL AND "disposition_models"."q3" IS NOT NULL)),
	CONSTRAINT "disp_fbasis" CHECK("disposition_models"."fBasisPercent" IS NULL OR ("disposition_models"."fBasisPercent" > 0 AND "disposition_models"."fBasisPercent" <= 100))
);
--> statement-breakpoint
CREATE INDEX `idx_disp_ing` ON `disposition_models` (`ingredientId`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_disp_default` ON `disposition_models` (`ingredientId`) WHERE "disposition_models"."isDefault" = 1;--> statement-breakpoint
CREATE TABLE `doses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`strengthId` integer NOT NULL,
	`regimenStrengthId` integer,
	`packId` integer,
	`quantity` real NOT NULL,
	`takenAt` integer,
	`scheduledFor` integer,
	`status` text NOT NULL,
	`notes` text,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`strengthId`) REFERENCES `strengths`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`regimenStrengthId`) REFERENCES `regimen_strengths`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`packId`) REFERENCES `packs`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "dose_taken" CHECK("doses"."status" <> 'taken' OR "doses"."takenAt" IS NOT NULL)
);
--> statement-breakpoint
CREATE INDEX `idx_doses_taken` ON `doses` (`takenAt`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_doses_sched` ON `doses` (`regimenStrengthId`,`scheduledFor`);--> statement-breakpoint
CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`molarMass` real,
	`parentIngredientId` integer,
	`maxPerDay` real,
	`therapeuticRangeMin` real,
	`therapeuticRangeMax` real,
	`toxicThreshold` real,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`parentIngredientId`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "ing_range" CHECK("ingredients"."therapeuticRangeMin" IS NULL OR "ingredients"."therapeuticRangeMax" IS NULL
    OR "ingredients"."therapeuticRangeMin" <= "ingredients"."therapeuticRangeMax")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_ingredients_name` ON `ingredients` (`name`);--> statement-breakpoint
CREATE TABLE `pack_adjustments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`packId` integer,
	`quantity` real NOT NULL,
	`adjustmentAt` integer NOT NULL,
	`reason` text,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`packId`) REFERENCES `packs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_adj_pack` ON `pack_adjustments` (`packId`);--> statement-breakpoint
CREATE TABLE `packs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`strengthId` integer NOT NULL,
	`quantity` real NOT NULL,
	`acquiredAt` integer NOT NULL,
	`expiresAt` integer,
	`openedAt` integer,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`strengthId`) REFERENCES `strengths`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_packs_strength` ON `packs` (`strengthId`);--> statement-breakpoint
CREATE TABLE `regimen_strengths` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`regimenId` integer NOT NULL,
	`strengthId` integer NOT NULL,
	`rrule` text NOT NULL,
	`dtstart` integer NOT NULL,
	`timesOfDay` text NOT NULL,
	`quantity` real NOT NULL,
	`startsOn` integer NOT NULL,
	`endsOn` integer,
	`isPrn` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`regimenId`) REFERENCES `regimens`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`strengthId`) REFERENCES `strengths`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_rs_regimen` ON `regimen_strengths` (`regimenId`);--> statement-breakpoint
CREATE TABLE `regimens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`timeZone` text DEFAULT 'Europe/Vienna' NOT NULL,
	`startDate` integer NOT NULL,
	`endDate` integer,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `strength_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`strengthId` integer NOT NULL,
	`ingredientId` integer NOT NULL,
	`amountBase` real NOT NULL,
	`displayAmount` real NOT NULL,
	`displayUnit` text NOT NULL,
	`saltFactor` real DEFAULT 1 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`strengthId`) REFERENCES `strengths`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_si_pair` ON `strength_ingredients` (`strengthId`,`ingredientId`);--> statement-breakpoint
CREATE TABLE `strengths` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`medicationId` integer NOT NULL,
	`unitInUse` text DEFAULT 'tablet' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`medicationId`) REFERENCES `medications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_strengths_med` ON `strengths` (`medicationId`);--> statement-breakpoint
CREATE INDEX `idx_bp_at` ON `blood_pressure_readings` (`readingAt`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_medications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#E8833A' NOT NULL,
	`form` text NOT NULL,
	`route` text NOT NULL,
	`notes` text,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_medications`("id", "name", "color", "form", "route", "notes", "createdAt") SELECT "id", "name", "color", "form", "route", "notes", "createdAt" FROM `medications`;--> statement-breakpoint
DROP TABLE `medications`;--> statement-breakpoint
ALTER TABLE `__new_medications` RENAME TO `medications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;