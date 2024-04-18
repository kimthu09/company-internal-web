/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE ciw

USE ciw


DROP TABLE IF EXISTS `feature`;
CREATE TABLE `feature` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `password_reset_token`;
CREATE TABLE `password_reset_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5lwtbncug84d4ero33v3cfxvl` (`user_id`),
  CONSTRAINT `FK5lwtbncug84d4ero33v3cfxvl` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attachments` text,
  `content` text,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(200) NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK93o2xaw90541rp5xaf29hsgd2` (`created_by`),
  CONSTRAINT `FK93o2xaw90541rp5xaf29hsgd2` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `post_tag`;
CREATE TABLE `post_tag` (
  `post_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `FKac1wdchd2pnur3fl225obmlg0` (`tag_id`),
  CONSTRAINT `FKac1wdchd2pnur3fl225obmlg0` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`),
  CONSTRAINT `FKc2auetuvsec0k566l0eyvr9cs` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `number_post` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tên` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `number_staffs` int NOT NULL,
  `manager_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tên` (`name`),
  UNIQUE KEY `UK_i7a5kg72yn6qgcegnvvtsm4gn` (`manager_id`),
  CONSTRAINT `FKcp3cavab0dkipglpra72qhqbu` FOREIGN KEY (`manager_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `unit_feature`;
CREATE TABLE `unit_feature` (
  `feature_id` bigint NOT NULL,
  `unit_id` bigint NOT NULL,
  PRIMARY KEY (`feature_id`,`unit_id`),
  KEY `FKac15ueqe5cs7j0ctbeeil0vi2` (`unit_id`),
  CONSTRAINT `FKac15ueqe5cs7j0ctbeeil0vi2` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`),
  CONSTRAINT `FKf1096uh5hkuiv8956vbfmd5ff` FOREIGN KEY (`feature_id`) REFERENCES `feature` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(50) NOT NULL,
  `dob` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `image` text NOT NULL,
  `is_deleted` bit(1) NOT NULL,
  `male` bit(1) NOT NULL,
  `name` varchar(200) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `unit_id` bigint,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Email` (`email`),
  KEY `FKcjsdlph5v8ywnu5wqfkvk9mj8` (`unit_id`),
  CONSTRAINT `FKcjsdlph5v8ywnu5wqfkvk9mj8` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `feature` (`id`, `name`, `code`) VALUES
(1, 'Admin', 'ADMIN');
INSERT INTO `feature` (`id`, `name`, `code`) VALUES
(2, 'Quản lý bài báo', 'POST');










INSERT INTO `unit` (`id`, `name`, `number_staffs`, `manager_id`) VALUES
(1, 'admin', 1, 1);
INSERT INTO `unit` (`id`, `name`, `number_staffs`, `manager_id`) VALUES
(2, 'nhân sự', 1, 3);


INSERT INTO `unit_feature` (`feature_id`, `unit_id`) VALUES
(1, 1);
INSERT INTO `unit_feature` (`feature_id`, `unit_id`) VALUES
(1, 2);
INSERT INTO `unit_feature` (`feature_id`, `unit_id`) VALUES
(2, 2);

INSERT INTO `user` (`id`, `address`, `dob`, `email`, `image`, `is_deleted`, `male`, `name`, `password`, `phone`, `unit_id`) VALUES
(1, 'TPHCM', '23/12/2000', 'admin@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 0, 1, 'Admin\'s name', '$2a$10$HaDXxAFsuseSQHdmCaShhOu90UOVYiyRHj6fyDMBG5xUXAKS3FCLe', '0123456789', 1);
INSERT INTO `user` (`id`, `address`, `dob`, `email`, `image`, `is_deleted`, `male`, `name`, `password`, `phone`, `unit_id`) VALUES
(2, 'Thủ Đức', '22/1/2004', 'user@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 0, 0, 'User\'s name', '$2a$10$HaDXxAFsuseSQHdmCaShhOu90UOVYiyRHj6fyDMBG5xUXAKS3FCLe', '0123456789', 2);
INSERT INTO `user` (`id`, `address`, `dob`, `email`, `image`, `is_deleted`, `male`, `name`, `password`, `phone`, `unit_id`) VALUES
(3, 'Hà Nội', '23/5/2006', '21520339@gm.uit.edu.vn', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 0, 0, 'Nguyễn Lê Ngọc Mai', '$2a$10$HaDXxAFsuseSQHdmCaShhOu90UOVYiyRHj6fyDMBG5xUXAKS3FCLe', '0123456789', 2);
INSERT INTO `user` (`id`, `address`, `dob`, `email`, `image`, `is_deleted`, `male`, `name`, `password`, `phone`, `unit_id`) VALUES
(4, 'Hà Nội', '23/5/2006', 'deletedUser@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 1, 1, 'Tên nhân viên đã bị xóa', '$2a$10$HaDXxAFsuseSQHdmCaShhOu90UOVYiyRHj6fyDMBG5xUXAKS3FCLe', '0123456789', NULL);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;