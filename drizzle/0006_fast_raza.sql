CREATE INDEX `guestbook_messages_invitation_id_idx` ON `guestbook_messages` (`invitationId`);--> statement-breakpoint
ALTER TABLE `guestbook_messages` DROP INDEX `guestbook_messages_invitation_hash_unique`;
