ALTER TABLE `rsvps` ADD `nameKey` varchar(180);--> statement-breakpoint
ALTER TABLE `rsvps` ADD CONSTRAINT `rsvps_name_key_unique` UNIQUE(`nameKey`);