
SET NAMES utf8mb4;


CREATE TABLE IF NOT EXISTS `_query_executions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sql` text,
  `ms` int(10) unsigned DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS⁠ businesses ⁠ (
  ⁠ id ⁠ int(11) unsigned NOT NULL AUTO_INCREMENT,
  ⁠ name ⁠ varchar(100) DEFAULT NULL,
  ⁠ website ⁠ varchar(100) DEFAULT NULL,
  ⁠ logo ⁠ varchar(255) DEFAULT NULL,
  ⁠ ownerId ⁠ int(11) unsigned DEFAULT NULL,
  ⁠ coreToken ⁠ varchar(255) DEFAULT NULL,
  ⁠ createdAt ⁠ datetime DEFAULT NULL,
  ⁠ updatedAt ⁠ datetime DEFAULT NULL,
  ⁠ deletedAt ⁠ datetime DEFAULT NULL,
  PRIMARY KEY (⁠ id ⁠)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `datasources` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `businessId` int(11) unsigned DEFAULT NULL,
  `config` text,
  `structure` longtext,
  `lastUseAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `neuron_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `neurons` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `parentId` int(11) unsigned DEFAULT NULL,
  `executions` int(11) unsigned DEFAULT '0',
  `timeMs` int(20) unsigned DEFAULT '0',
  `key` varchar(100) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `rolPrivilegeId` int(11) unsigned DEFAULT NULL,
  `filters` text,
  `synapse` text,
  `executable` text,
  `history` longtext,
  `businessId` int(11) unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `withExpiration` tinyint(4) DEFAULT '1',
  `userId` int(10) unsigned DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `ipAddress` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `lastActivity` datetime DEFAULT NULL,
  `deviceId` char(36) DEFAULT NULL,
  `geoAccuracy` decimal(10,6) unsigned DEFAULT NULL,
  `geoLat` decimal(10,8) DEFAULT NULL,
  `geoLon` decimal(11,8) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `user_permissions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `viewId` int(11) unsigned DEFAULT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `cellphone` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `mfa` text,
  `businessId` int(11) unsigned DEFAULT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `blockedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `view_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `businessId` int(11) unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `views` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `icon` varchar(100) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `layout` text,
  `businessId` int(11) unsigned DEFAULT NULL,
  `viewGroupId` int(11) unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `neuron_executions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `timeMs` int(11) unsigned DEFAULT NULL,
  `neuronId` int(11) unsigned DEFAULT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  `businessId` int(11) unsigned DEFAULT NULL,
  `dataSourceId` int(11) unsigned DEFAULT NULL,
  `data` text,
  `finishAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;