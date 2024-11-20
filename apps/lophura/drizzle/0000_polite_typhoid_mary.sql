CREATE TABLE `monitoring` (
	`createdAt` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`diskUsage` integer NOT NULL,
	`memoryUsage` integer NOT NULL,
	`cpuUsage` integer NOT NULL
);
