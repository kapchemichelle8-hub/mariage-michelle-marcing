CREATE TABLE `wedding_event_times` (
	`eventId` varchar(16) NOT NULL,
	`timeValue` varchar(5) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wedding_event_times_eventId` PRIMARY KEY(`eventId`)
);
--> statement-breakpoint
INSERT INTO `wedding_event_times` (`eventId`, `timeValue`) VALUES
  ('civil', '13:00'),
  ('church', '15:00'),
  ('party', '20:00');
