ALTER TABLE `invited_guests` ADD `partnerInvitationId` int;
--> statement-breakpoint
-- The 45 validated couples are linked symmetrically. MM210/MM211 remain individual invitations.
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM004' AND `partner`.`code` = 'MM005' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM005' AND `partner`.`code` = 'MM004' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM009' AND `partner`.`code` = 'MM010' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM010' AND `partner`.`code` = 'MM009' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM012' AND `partner`.`code` = 'MM013' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM013' AND `partner`.`code` = 'MM012' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM014' AND `partner`.`code` = 'MM015' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM015' AND `partner`.`code` = 'MM014' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM030' AND `partner`.`code` = 'MM031' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM031' AND `partner`.`code` = 'MM030' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM032' AND `partner`.`code` = 'MM033' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM033' AND `partner`.`code` = 'MM032' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM034' AND `partner`.`code` = 'MM035' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM035' AND `partner`.`code` = 'MM034' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM036' AND `partner`.`code` = 'MM037' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM037' AND `partner`.`code` = 'MM036' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM039' AND `partner`.`code` = 'MM040' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM040' AND `partner`.`code` = 'MM039' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM052' AND `partner`.`code` = 'MM053' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM053' AND `partner`.`code` = 'MM052' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM054' AND `partner`.`code` = 'MM055' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM055' AND `partner`.`code` = 'MM054' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM056' AND `partner`.`code` = 'MM057' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM057' AND `partner`.`code` = 'MM056' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM062' AND `partner`.`code` = 'MM063' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM063' AND `partner`.`code` = 'MM062' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM074' AND `partner`.`code` = 'MM075' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM075' AND `partner`.`code` = 'MM074' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM079' AND `partner`.`code` = 'MM080' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM080' AND `partner`.`code` = 'MM079' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM087' AND `partner`.`code` = 'MM088' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM088' AND `partner`.`code` = 'MM087' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM093' AND `partner`.`code` = 'MM094' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM094' AND `partner`.`code` = 'MM093' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM103' AND `partner`.`code` = 'MM104' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM104' AND `partner`.`code` = 'MM103' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM114' AND `partner`.`code` = 'MM115' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM115' AND `partner`.`code` = 'MM114' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM116' AND `partner`.`code` = 'MM117' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM117' AND `partner`.`code` = 'MM116' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM120' AND `partner`.`code` = 'MM121' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM121' AND `partner`.`code` = 'MM120' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM122' AND `partner`.`code` = 'MM123' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM123' AND `partner`.`code` = 'MM122' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM124' AND `partner`.`code` = 'MM125' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM125' AND `partner`.`code` = 'MM124' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM126' AND `partner`.`code` = 'MM127' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM127' AND `partner`.`code` = 'MM126' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM128' AND `partner`.`code` = 'MM129' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM129' AND `partner`.`code` = 'MM128' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM130' AND `partner`.`code` = 'MM131' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM131' AND `partner`.`code` = 'MM130' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM133' AND `partner`.`code` = 'MM134' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM134' AND `partner`.`code` = 'MM133' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM135' AND `partner`.`code` = 'MM136' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM136' AND `partner`.`code` = 'MM135' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM137' AND `partner`.`code` = 'MM138' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM138' AND `partner`.`code` = 'MM137' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM139' AND `partner`.`code` = 'MM140' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM140' AND `partner`.`code` = 'MM139' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM161' AND `partner`.`code` = 'MM162' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM162' AND `partner`.`code` = 'MM161' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM163' AND `partner`.`code` = 'MM164' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM164' AND `partner`.`code` = 'MM163' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM165' AND `partner`.`code` = 'MM166' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM166' AND `partner`.`code` = 'MM165' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM167' AND `partner`.`code` = 'MM168' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM168' AND `partner`.`code` = 'MM167' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM169' AND `partner`.`code` = 'MM170' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM170' AND `partner`.`code` = 'MM169' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM172' AND `partner`.`code` = 'MM173' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM173' AND `partner`.`code` = 'MM172' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM174' AND `partner`.`code` = 'MM175' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM175' AND `partner`.`code` = 'MM174' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM176' AND `partner`.`code` = 'MM177' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM177' AND `partner`.`code` = 'MM176' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM178' AND `partner`.`code` = 'MM179' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM179' AND `partner`.`code` = 'MM178' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM181' AND `partner`.`code` = 'MM182' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM182' AND `partner`.`code` = 'MM181' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM183' AND `partner`.`code` = 'MM184' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM184' AND `partner`.`code` = 'MM183' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM185' AND `partner`.`code` = 'MM186' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM186' AND `partner`.`code` = 'MM185' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM187' AND `partner`.`code` = 'MM188' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM188' AND `partner`.`code` = 'MM187' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM194' AND `partner`.`code` = 'MM195' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM195' AND `partner`.`code` = 'MM194' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM202' AND `partner`.`code` = 'MM203' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
UPDATE `invited_guests` AS `current` JOIN `invited_guests` AS `partner` ON `current`.`code` = 'MM203' AND `partner`.`code` = 'MM202' SET `current`.`partnerInvitationId` = `partner`.`id`;
--> statement-breakpoint
CREATE UNIQUE INDEX `invited_guests_partner_invitation_unique` ON `invited_guests` (`partnerInvitationId`);
