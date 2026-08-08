CREATE TABLE `blood_pressure_readings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`systolic` integer NOT NULL,
	`diastolic` integer NOT NULL,
	`pulse` integer,
	`reading_time` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
