CREATE TABLE `rsvps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320),
	`attendance` enum('yes','no') NOT NULL,
	`guestsCount` int NOT NULL DEFAULT 1,
	`message` text,
	`ticketCode` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rsvps_id` PRIMARY KEY(`id`),
	CONSTRAINT `rsvps_ticketCode_unique` UNIQUE(`ticketCode`)
);
