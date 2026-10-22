CREATE TABLE `guestbook_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invitationId` int NOT NULL,
	`authorName` varchar(160) NOT NULL,
	`message` text NOT NULL,
	`messageHash` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guestbook_messages_id` PRIMARY KEY(`id`),
	CONSTRAINT `guestbook_messages_invitation_hash_unique` UNIQUE(`invitationId`,`messageHash`)
);
--> statement-breakpoint
CREATE TABLE `invited_guests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(12) NOT NULL,
	`name` varchar(160) NOT NULL,
	`side` enum('bride','groom') NOT NULL,
	`sourceSheet` varchar(40) NOT NULL,
	`sourceRow` int NOT NULL,
	`sourceSerial` int NOT NULL,
	`tableNumber` varchar(12),
	`tableVirtue` varchar(160),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invited_guests_id` PRIMARY KEY(`id`),
	CONSTRAINT `invited_guests_code_unique` UNIQUE(`code`),
	CONSTRAINT `invited_guests_source_row_unique` UNIQUE(`sourceSheet`,`sourceRow`)
);
--> statement-breakpoint
CREATE TABLE `legacy_seat_plan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceRow` int NOT NULL,
	`tableNumber` varchar(12) NOT NULL,
	`tableVirtue` varchar(160) NOT NULL,
	`guestName` varchar(200) NOT NULL,
	CONSTRAINT `legacy_seat_plan_id` PRIMARY KEY(`id`),
	CONSTRAINT `legacy_seat_plan_sourceRow_unique` UNIQUE(`sourceRow`)
);
--> statement-breakpoint
CREATE TABLE `wedding_tables` (
	`tableNumber` varchar(12) NOT NULL,
	`tableVirtue` varchar(160) NOT NULL,
	CONSTRAINT `wedding_tables_tableNumber` PRIMARY KEY(`tableNumber`)
);
--> statement-breakpoint
ALTER TABLE `rsvps` ADD `invitationId` int;--> statement-breakpoint
ALTER TABLE `rsvps` ADD CONSTRAINT `rsvps_invitation_id_unique` UNIQUE(`invitationId`);--> statement-breakpoint
ALTER TABLE `guestbook_messages` ADD CONSTRAINT `guestbook_messages_invitationId_invited_guests_id_fk` FOREIGN KEY (`invitationId`) REFERENCES `invited_guests`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `guestbook_messages_created_at_idx` ON `guestbook_messages` (`createdAt`);--> statement-breakpoint
CREATE INDEX `invited_guests_side_idx` ON `invited_guests` (`side`);--> statement-breakpoint
CREATE INDEX `invited_guests_table_idx` ON `invited_guests` (`tableNumber`);--> statement-breakpoint
CREATE INDEX `legacy_seat_plan_guest_name_idx` ON `legacy_seat_plan` (`guestName`);--> statement-breakpoint
ALTER TABLE `rsvps` ADD CONSTRAINT `rsvps_invitationId_invited_guests_id_fk` FOREIGN KEY (`invitationId`) REFERENCES `invited_guests`(`id`) ON DELETE set null ON UPDATE no action;