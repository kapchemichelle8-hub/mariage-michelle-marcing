CREATE TABLE `legacy_guestbook_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceRsvpId` int NOT NULL,
	`authorName` varchar(160) NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL,
	CONSTRAINT `legacy_guestbook_messages_id` PRIMARY KEY(`id`),
	CONSTRAINT `legacy_guestbook_messages_sourceRsvpId_unique` UNIQUE(`sourceRsvpId`)
);
--> statement-breakpoint
CREATE INDEX `legacy_guestbook_messages_created_at_idx` ON `legacy_guestbook_messages` (`createdAt`);