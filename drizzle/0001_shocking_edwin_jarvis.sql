CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationType` varchar(64) NOT NULL,
	`organizationName` varchar(255) NOT NULL,
	`organizationSize` varchar(64) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`serviceInterest` text,
	`message` text,
	`status` enum('new','contacted','qualified','rejected') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
