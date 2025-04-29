CREATE TABLE `spiders` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`species` text NOT NULL,
	`individual_type` text,
	`last_fed` text NOT NULL,
	`feeding_frequency` text NOT NULL,
	`last_molt` text NOT NULL,
	`image_uri` text,
	`is_favourite` integer DEFAULT false,
	`status` text,
	`next_feeding_date` text
);
