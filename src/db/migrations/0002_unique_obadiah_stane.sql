CREATE TABLE `medications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT 'red' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
