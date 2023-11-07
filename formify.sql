# ************************************************************
# Sequel Ace SQL dump
# Version 20039
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: localhost (MySQL 8.0.30)
# Database: formify
# Generation Time: 2022-10-24 14:46:59 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table allowed_domains
# ------------------------------------------------------------

DROP TABLE IF EXISTS `allowed_domains`;

CREATE TABLE `allowed_domains` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `form_id` bigint unsigned NOT NULL,
  `domain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `allowed_domains_form_id_foreign` (`form_id`),
  CONSTRAINT `allowed_domains_form_id_foreign` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `allowed_domains` WRITE;
/*!40000 ALTER TABLE `allowed_domains` DISABLE KEYS */;

INSERT INTO `allowed_domains` (`id`, `form_id`, `domain`)
VALUES
	(1,1,'webtech.id');

/*!40000 ALTER TABLE `allowed_domains` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table answers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `answers`;

CREATE TABLE `answers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `response_id` bigint unsigned NOT NULL,
  `question_id` bigint unsigned NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `answers_response_id_foreign` (`response_id`),
  KEY `answers_question_id_foreign` (`question_id`),
  CONSTRAINT `answers_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `answers_response_id_foreign` FOREIGN KEY (`response_id`) REFERENCES `responses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;

INSERT INTO `answers` (`id`, `response_id`, `question_id`, `value`)
VALUES
	(1,1,1,'Budi Setiawan'),
	(2,1,2,'Jakarta, Indonesia'),
	(3,1,3,'2004-05-05'),
	(4,1,4,'Male');

/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table failed_jobs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `failed_jobs`;

CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table forms
# ------------------------------------------------------------

DROP TABLE IF EXISTS `forms`;

CREATE TABLE `forms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `limit_one_response` tinyint(1) NOT NULL DEFAULT '0',
  `creator_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `forms_slug_unique` (`slug`),
  KEY `forms_creator_id_foreign` (`creator_id`),
  CONSTRAINT `forms_creator_id_foreign` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `forms` WRITE;
/*!40000 ALTER TABLE `forms` DISABLE KEYS */;

INSERT INTO `forms` (`id`, `name`, `slug`, `description`, `limit_one_response`, `creator_id`)
VALUES
	(1,'Biodata - Web Tech Members','biodata','To save web tech members data',1,1),
	(2,'HTML and CSS Skills - Quiz','htmlcss-quiz','Fundamental web tests',1,1);

/*!40000 ALTER TABLE `forms` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table migrations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;

INSERT INTO `migrations` (`id`, `migration`, `batch`)
VALUES
	(1,'2014_10_12_000000_create_users_table',1),
	(2,'2014_10_12_100000_create_password_resets_table',1),
	(3,'2019_08_19_000000_create_failed_jobs_table',1),
	(4,'2019_12_14_000001_create_personal_access_tokens_table',1),
	(5,'2022_10_19_044534_create_forms_table',1),
	(6,'2022_10_19_044540_create_questions_table',1),
	(7,'2022_10_19_044554_create_allowed_domains_table',1),
	(8,'2022_10_19_044604_create_responses_table',1),
	(9,'2022_10_19_044610_create_answers_table',1);

/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table password_resets
# ------------------------------------------------------------

DROP TABLE IF EXISTS `password_resets`;

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table personal_access_tokens
# ------------------------------------------------------------

DROP TABLE IF EXISTS `personal_access_tokens`;

CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`)
VALUES
	(21,'App\\Models\\User',1,'API_TOKEN','3e9247e3fa5cf6faf445a37c59d24a77a30b8ec86432811e4302604ee58cfdc5','[\"*\"]',NULL,NULL,'2022-10-24 14:45:47','2022-10-24 14:45:47'),
	(22,'App\\Models\\User',1,'API_TOKEN','082afc559500dca9702305ddc9d3530d4c3f4f888e8fe675d6208a0e974373aa','[\"*\"]',NULL,NULL,'2022-10-24 14:45:47','2022-10-24 14:45:47'),
	(23,'App\\Models\\User',2,'API_TOKEN','d9659b3a81cc8f7068c4b04791e1ea417e35b9289d69916f00dc349f07a14384','[\"*\"]',NULL,NULL,'2022-10-24 14:45:47','2022-10-24 14:45:47');

/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table questions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `form_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `choice_type` enum('short answer','paragraph','date','time','multiple choice','dropdown','checkboxes') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'short answer',
  `choices` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'To save choices for multiple choices, dropdown, or checkboxes. Use | to separate choices.',
  `is_required` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `questions_form_id_foreign` (`form_id`),
  CONSTRAINT `questions_form_id_foreign` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;

INSERT INTO `questions` (`id`, `form_id`, `name`, `choice_type`, `choices`, `is_required`)
VALUES
	(1,1,'Name','short answer',NULL,1),
	(2,1,'Address','paragraph',NULL,0),
	(3,1,'Born Date','date',NULL,1),
	(4,1,'Sex','multiple choice','Male,Female',1),
	(5,2,'What does HTML stand for?','multiple choice','Hyper Text Markup Language,Home Tool Markup Language,Hyperlinks and Text Markup Language',1),
	(6,2,'Choose the correct HTML tag for the largest heading:','multiple choice','<heading>,<head>,<h6>,<h1>',1),
	(7,2,'What is the correct HTML element for inserting a line break?','multiple choice','<br>,<lb>,<break>',1),
	(8,2,'Which character is used to indicate an end tag?','multiple choice','^,*,<,/',1),
	(9,2,'Choose the correct typography HTML element','checkboxes','<p>,<h1>,<div>,<b>',1);

/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table responses
# ------------------------------------------------------------

DROP TABLE IF EXISTS `responses`;

CREATE TABLE `responses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `form_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `responses_form_id_foreign` (`form_id`),
  KEY `responses_user_id_foreign` (`user_id`),
  CONSTRAINT `responses_form_id_foreign` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `responses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `responses` WRITE;
/*!40000 ALTER TABLE `responses` DISABLE KEYS */;

INSERT INTO `responses` (`id`, `form_id`, `user_id`, `date`)
VALUES
	(1,1,1,'2022-10-24 14:45:42');

/*!40000 ALTER TABLE `responses` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`)
VALUES
	(1,'User 1','user1@webtech.id',NULL,'$2y$10$.8wbP.o/xN.bfDJIpAec0ucGnsqktQy48t2wAW3pdsn7RT6o/JnYe',NULL),
	(2,'User 2','user2@webtech.id',NULL,'$2y$10$vdiodsfLMzT57Kt/umss0Oou/42VITSjDMoE6EEcPcfh2krl1lQU2',NULL),
	(3,'User 3','user3@worldskills.org',NULL,'$2y$10$LW4eED626qUqH1VF2bVaCuDkROb/xx7JNgexWYVVwfAZyg7p.ZjEy',NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
