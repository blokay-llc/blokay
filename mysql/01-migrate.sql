
SET NAMES utf8mb4;

-- Create syntax for TABLE '_query_executions'
CREATE TABLE `_query_executions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `datasourceId` int(11) unsigned DEFAULT NULL,
  `sql` text,
  `ms` int(10) unsigned DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=405 DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'businesses'
CREATE TABLE `businesses` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `ownerId` int(11) unsigned DEFAULT NULL,
  `coreToken` varchar(255) DEFAULT NULL,
  `paymentProviderToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `coreToken` (`coreToken`),
  KEY `ownerId` (`ownerId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'datasources'
CREATE TABLE `datasources` (
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
  PRIMARY KEY (`id`),
  KEY `businessId` (`businessId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'neuron_executions'
CREATE TABLE `neuron_executions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `timeMs` int(11) unsigned DEFAULT NULL,
  `neuronId` int(11) unsigned DEFAULT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  `businessId` int(11) unsigned DEFAULT NULL,
  `dataSourceId` int(11) unsigned DEFAULT NULL,
  `data` text,
  `error` varchar(255) DEFAULT NULL,
  `finishAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `businessId` (`businessId`),
  KEY `dataSourceId` (`dataSourceId`),
  KEY `userId` (`userId`),
  KEY `neuronId` (`neuronId`)
) ENGINE=InnoDB AUTO_INCREMENT=9500 DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'neuron_groups'
CREATE TABLE `neuron_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'neuron_logs'
CREATE TABLE `neuron_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `neuronId` int(11) unsigned DEFAULT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  `businessId` int(11) unsigned DEFAULT NULL,
  `synapse` text,
  `filters` text,
  `createdAt` date DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `businessId` (`businessId`,`userId`),
  KEY `neuronId` (`neuronId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'neurons'
CREATE TABLE `neurons` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cron` varchar(255) DEFAULT NULL,
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
  `type` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `businessId` (`businessId`),
  KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=1000115 DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'user_permissions'
CREATE TABLE `user_permissions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `viewId` int(11) unsigned DEFAULT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `viewId` (`viewId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=1204 DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'users'
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `cellphone` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `mfa` text,
  `businessId` int(11) unsigned DEFAULT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `currentViewId` int(11) DEFAULT NULL,
  `lastActionAt` datetime DEFAULT NULL,
  `blockedAt` datetime DEFAULT NULL,
  `extra1` varchar(255) DEFAULT NULL,
  `extra2` varchar(255) DEFAULT NULL,
  `extra3` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `businessId` (`businessId`),
  KEY `currentViewId` (`currentViewId`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'view_groups'
CREATE TABLE `view_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `businessId` int(11) unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `businessId` (`businessId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'view_items'
CREATE TABLE `view_items` (
  `id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `viewId` int(11) unsigned DEFAULT NULL,
  `neuronId` int(11) unsigned DEFAULT NULL,
  `w` int(11) unsigned DEFAULT NULL,
  `h` int(11) unsigned DEFAULT NULL,
  `options` text,
  `x` int(11) unsigned DEFAULT NULL,
  `y` int(11) unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `viewId` (`viewId`),
  KEY `neuronId` (`neuronId`),
  KEY `createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'views'
CREATE TABLE `views` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `businessId` int(11) unsigned DEFAULT NULL,
  `viewGroupId` int(11) unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `viewGroupId` (`viewGroupId`),
  KEY `businessId` (`businessId`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=latin1;