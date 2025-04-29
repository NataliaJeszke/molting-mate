CREATE TABLE `feeding_history` (
	`id` integer PRIMARY KEY NOT NULL,
	`spider_id` integer NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`spider_id`) REFERENCES `spiders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `molting_history` (
	`id` integer PRIMARY KEY NOT NULL,
	`spider_id` integer NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`spider_id`) REFERENCES `spiders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_spiders` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`species` text NOT NULL,
	`individual_type` text NOT NULL,
	`last_fed` text NOT NULL,
	`feeding_frequency` text NOT NULL,
	`last_molt` text NOT NULL,
	`image_uri` text,
	`is_favourite` integer DEFAULT false,
	`status` text,
	`next_feeding_date` text
);
--> statement-breakpoint
INSERT INTO `__new_spiders`("id", "name", "age", "species", "individual_type", "last_fed", "feeding_frequency", "last_molt", "image_uri", "is_favourite", "status", "next_feeding_date") SELECT "id", "name", "age", "species", "individual_type", "last_fed", "feeding_frequency", "last_molt", "image_uri", "is_favourite", "status", "next_feeding_date" FROM `spiders`;--> statement-breakpoint
DROP TABLE `spiders`;--> statement-breakpoint
ALTER TABLE `__new_spiders` RENAME TO `spiders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;