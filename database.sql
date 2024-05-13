/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE ciw;

USE ciw;

DROP TABLE IF EXISTS `feature`;
CREATE TABLE `feature` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tên` (`name`),
  UNIQUE KEY `UK_lqtnexxep9h8avuryfstf6eqk` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `meeting_room`;
CREATE TABLE `meeting_room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `location` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tên` (`name`),
  UNIQUE KEY `Vị trí` (`location`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `meeting_room_calendar`;
CREATE TABLE `meeting_room_calendar` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` datetime(6) NOT NULL,
  `note` varchar(200) NOT NULL,
  `shift_type` enum('DAY','NIGHT') NOT NULL,
  `created_by` bigint NOT NULL,
  `meeting_room_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Bảng ghi` (`date`,`shift_type`,`meeting_room_id`),
  KEY `FKdeqb0o88prispxlpqpqkesrxe` (`created_by`),
  KEY `FK867jace6e7lrtsxi7si51s9yc` (`meeting_room_id`),
  CONSTRAINT `FK867jace6e7lrtsxi7si51s9yc` FOREIGN KEY (`meeting_room_id`) REFERENCES `meeting_room` (`id`),
  CONSTRAINT `FKdeqb0o88prispxlpqpqkesrxe` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(200) NOT NULL,
  `seen` bit(1) NOT NULL,
  `title` varchar(100) NOT NULL,
  `from_user` bigint NOT NULL,
  `to_user` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm8pdp1mapclpr8iicppfa0olm` (`from_user`),
  KEY `FK2pgfwws64peg4hjubcwo8tvle` (`to_user`),
  CONSTRAINT `FK2pgfwws64peg4hjubcwo8tvle` FOREIGN KEY (`to_user`) REFERENCES `user` (`id`),
  CONSTRAINT `FKm8pdp1mapclpr8iicppfa0olm` FOREIGN KEY (`from_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `password_reset_token`;
CREATE TABLE `password_reset_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5lwtbncug84d4ero33v3cfxvl` (`user_id`),
  CONSTRAINT `FK5lwtbncug84d4ero33v3cfxvl` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `post_tag`;
CREATE TABLE `post_tag` (
  `post_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `FKac1wdchd2pnur3fl225obmlg0` (`tag_id`),
  CONSTRAINT `FKac1wdchd2pnur3fl225obmlg0` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`),
  CONSTRAINT `FKc2auetuvsec0k566l0eyvr9cs` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `request_for_leave`;
CREATE TABLE `request_for_leave` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `accepted_at` datetime(6) DEFAULT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `date` datetime(6) NOT NULL,
  `note` varchar(200) NOT NULL,
  `rejected_at` datetime(6) DEFAULT NULL,
  `shift_type` enum('DAY','NIGHT') NOT NULL,
  `accepted_by` bigint DEFAULT NULL,
  `approved_by` bigint DEFAULT NULL,
  `created_by` bigint NOT NULL,
  `rejected_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Bảng ghi` (`date`,`shift_type`,`created_by`),
  KEY `FK6at8o80gqpt66n82ycyvwyava` (`accepted_by`),
  KEY `FKax9mikh5a0tamgxad77qigt0y` (`approved_by`),
  KEY `FKd5qri6xr3psa9irxhwnh8m7r1` (`created_by`),
  KEY `FKqpo4jeeey8yeqglpk2lg1645j` (`rejected_by`),
  CONSTRAINT `FK6at8o80gqpt66n82ycyvwyava` FOREIGN KEY (`accepted_by`) REFERENCES `user` (`id`),
  CONSTRAINT `FKax9mikh5a0tamgxad77qigt0y` FOREIGN KEY (`approved_by`) REFERENCES `user` (`id`),
  CONSTRAINT `FKd5qri6xr3psa9irxhwnh8m7r1` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`),
  CONSTRAINT `FKqpo4jeeey8yeqglpk2lg1645j` FOREIGN KEY (`rejected_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tên` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `resource_calendar`;
CREATE TABLE `resource_calendar` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` datetime(6) NOT NULL,
  `note` varchar(200) NOT NULL,
  `shift_type` enum('DAY','NIGHT') NOT NULL,
  `created_by` bigint NOT NULL,
  `resource_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Bảng ghi` (`date`,`shift_type`,`resource_id`),
  KEY `FK3w2tce0nraigwsfqmpy5mh4oh` (`created_by`),
  KEY `FKc5l6bmo1iwg01gi0fydoglr1m` (`resource_id`),
  CONSTRAINT `FK3w2tce0nraigwsfqmpy5mh4oh` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`),
  CONSTRAINT `FKc5l6bmo1iwg01gi0fydoglr1m` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `number_post` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tên` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `manager_id` bigint DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `number_staffs` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tên` (`name`)
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

DROP TABLE IF EXISTS `unit_shift`;
CREATE TABLE `unit_shift` (
  `day_of_week` enum('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') NOT NULL,
  `unit_id` bigint NOT NULL,
  `is_has_day_shift` bit(1) NOT NULL,
  `is_has_night_shift` bit(1) NOT NULL,
  PRIMARY KEY (`day_of_week`,`unit_id`),
  KEY `FK7e5hh1c9w291ra9wn1yvyl0t0` (`unit_id`),
  CONSTRAINT `FK7e5hh1c9w291ra9wn1yvyl0t0` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `unit_shift_absent`;
CREATE TABLE `unit_shift_absent` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` datetime(6) NOT NULL,
  `shift_type` enum('DAY','NIGHT') NOT NULL,
  `created_by` bigint NOT NULL,
  `unit_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Bảng ghi` (`date`,`shift_type`,`unit_id`),
  KEY `FKtklb9k610i4qhtnn4lrtgqecp` (`created_by`),
  KEY `FKh8706pntarsvef1pgpdjgw9d2` (`unit_id`),
  CONSTRAINT `FKh8706pntarsvef1pgpdjgw9d2` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`),
  CONSTRAINT `FKtklb9k610i4qhtnn4lrtgqecp` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`)
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
  `user_identity` varchar(12) NOT NULL,
  `unit_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Email` (`email`),
  KEY `FKcjsdlph5v8ywnu5wqfkvk9mj8` (`unit_id`),
  CONSTRAINT `FKcjsdlph5v8ywnu5wqfkvk9mj8` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `feature` (`id`, `code`, `name`) VALUES
(1, 'ADMIN', 'Admin');
INSERT INTO `feature` (`id`, `code`, `name`) VALUES
(2, 'POST', 'Quản lý bài báo');
INSERT INTO `feature` (`id`, `code`, `name`) VALUES
(3, 'STAFF MANAGER', 'Quản lý nghỉ phép');

INSERT INTO `meeting_room` (`id`, `location`, `name`) VALUES
(1, 'A2.2', 'Phòng họp A2');
INSERT INTO `meeting_room` (`id`, `location`, `name`) VALUES
(3, 'B1.1', 'Phòng họp B1');
INSERT INTO `meeting_room` (`id`, `location`, `name`) VALUES
(4, 'A3.1', 'Phòng họp A3');

INSERT INTO `meeting_room_calendar` (`id`, `date`, `note`, `shift_type`, `created_by`, `meeting_room_id`) VALUES
(1, '2024-05-04 00:00:00.000000', '', 'DAY', 1, 1);
INSERT INTO `meeting_room_calendar` (`id`, `date`, `note`, `shift_type`, `created_by`, `meeting_room_id`) VALUES
(2, '2024-05-04 00:00:00.000000', '', 'NIGHT', 1, 1);
INSERT INTO `meeting_room_calendar` (`id`, `date`, `note`, `shift_type`, `created_by`, `meeting_room_id`) VALUES
(3, '2024-05-05 00:00:00.000000', '', 'DAY', 1, 1);
INSERT INTO `meeting_room_calendar` (`id`, `date`, `note`, `shift_type`, `created_by`, `meeting_room_id`) VALUES
(4, '2024-05-05 00:00:00.000000', '', 'NIGHT', 1, 1),
(5, '2024-05-02 00:00:00.000000', '', 'NIGHT', 1, 1),
(6, '2024-05-03 00:00:00.000000', '', 'DAY', 1, 1),
(7, '2024-05-05 00:00:00.000000', '', 'DAY', 1, 3),
(8, '2024-05-01 00:00:00.000000', '', 'DAY', 1, 4),
(9, '2024-05-01 00:00:00.000000', '', 'NIGHT', 1, 4),
(10, '2024-05-02 00:00:00.000000', '', 'DAY', 1, 4),
(11, '2024-05-02 00:00:00.000000', '', 'NIGHT', 1, 4),
(12, '2024-05-03 00:00:00.000000', '', 'DAY', 1, 4),
(13, '2024-05-03 00:00:00.000000', '', 'NIGHT', 1, 4),
(14, '2024-05-04 00:00:00.000000', '', 'DAY', 1, 4),
(15, '2024-05-04 00:00:00.000000', '', 'NIGHT', 1, 4),
(16, '2024-05-05 00:00:00.000000', '', 'DAY', 1, 4),
(17, '2024-05-05 00:00:00.000000', '', 'NIGHT', 1, 4),
(20, '2024-05-07 00:00:00.000000', '', 'DAY', 1, 4),
(21, '2024-05-07 00:00:00.000000', '', 'NIGHT', 1, 4),
(22, '2024-05-08 00:00:00.000000', '', 'DAY', 1, 4),
(26, '2024-05-07 00:00:00.000000', '', 'DAY', 3, 1),
(27, '2024-05-07 00:00:00.000000', '', 'NIGHT', 3, 1),
(28, '2024-05-08 00:00:00.000000', '', 'DAY', 3, 3),
(29, '2024-05-08 00:00:00.000000', '', 'NIGHT', 3, 3),
(30, '2024-05-09 00:00:00.000000', '', 'DAY', 3, 3),
(31, '2024-05-09 00:00:00.000000', '', 'NIGHT', 3, 3),
(32, '2024-05-10 00:00:00.000000', '', 'DAY', 3, 3),
(33, '2024-05-10 00:00:00.000000', '', 'NIGHT', 3, 3),
(41, '2024-05-14 00:00:00.000000', '', 'NIGHT', 3, 1),
(42, '2024-05-15 00:00:00.000000', '', 'DAY', 3, 1);

INSERT INTO `notification` (`id`, `created_at`, `description`, `seen`, `title`, `from_user`, `to_user`) VALUES
(1, '2024-05-04 06:43:07.510000', 'Bạn đã đặt phòng họp Phòng họp A2 thành công vào buổi sáng ngày 04/05/2024 tới hết buổi sáng ngày 04/05/2024.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 1, 'Phòng họp đã được đặt', 1, 1);
INSERT INTO `notification` (`id`, `created_at`, `description`, `seen`, `title`, `from_user`, `to_user`) VALUES
(2, '2024-05-04 06:43:25.157000', 'Bạn đã đặt phòng họp Phòng họp A2 thành công vào buổi chiều ngày 02/05/2024 tới hết buổi chiều ngày 02/05/2024.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 1, 'Phòng họp đã được đặt', 1, 1);
INSERT INTO `notification` (`id`, `created_at`, `description`, `seen`, `title`, `from_user`, `to_user`) VALUES
(3, '2024-05-04 06:43:45.310000', 'Bạn đã đặt phòng họp Phòng họp B1 thành công vào buổi sáng ngày 05/05/2024 tới hết buổi sáng ngày 05/05/2024.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 1, 'Phòng họp đã được đặt', 1, 1);
INSERT INTO `notification` (`id`, `created_at`, `description`, `seen`, `title`, `from_user`, `to_user`) VALUES
(4, '2024-05-04 06:43:57.575000', 'Bạn đã đặt phòng họp Phòng họp A3 thành công vào buổi sáng ngày 01/05/2024 tới hết buổi sáng ngày 01/05/2024.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 1, 'Phòng họp đã được đặt', 1, 1),
(5, '2024-05-04 06:44:56.391000', 'Bạn đã đặt phòng họp Phòng họp A2 thành công vào buổi sáng ngày 06/05/2024 tới hết buổi sáng ngày 06/05/2024.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 1, 'Phòng họp đã được đặt', 3, 3),
(6, '2024-05-04 06:45:02.807000', 'Bạn đã đặt phòng họp Phòng họp B1 thành công vào buổi sáng ngày 08/05/2024 tới hết buổi sáng ngày 08/05/2024.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 1, 'Phòng họp đã được đặt', 3, 3),
(7, '2024-05-04 06:45:30.923000', 'Lịch phòng họp Phòng họp A3 vào buổi chiều ngày 08/05/2024 đã bị xóa.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 1, 'Lịch phòng họp của bạn có sự thay đổi', 1, 1),
(8, '2024-05-04 08:01:17.247000', 'Lịch phòng ban admin hàng tuần đã bị thay đổi. Nếu có sự nhầm lẫn, xin hãy liên hệ lại với chúng tôi.', 1, 'Lịch phòng ban đã có sự thay đổi', 1, 1),
(9, '2024-05-04 08:01:30.800000', 'Lịch phòng ban nhân sự hàng tuần đã bị thay đổi. Nếu có sự nhầm lẫn, xin hãy liên hệ lại với chúng tôi.', 0, 'Lịch phòng ban đã có sự thay đổi', 1, 2),
(10, '2024-05-04 08:01:30.818000', 'Lịch phòng ban nhân sự hàng tuần đã bị thay đổi. Nếu có sự nhầm lẫn, xin hãy liên hệ lại với chúng tôi.', 1, 'Lịch phòng ban đã có sự thay đổi', 1, 3),
(11, '2024-05-05 12:21:33.974000', 'Lịch phòng ban Phòng ban mới hàng tuần đã bị thay đổi. Nếu có sự nhầm lẫn, xin hãy liên hệ lại với chúng tôi.', 0, 'Lịch phòng ban đã có sự thay đổi', 1, 10),
(12, '2024-05-05 12:22:53.611000', 'Lịch phòng ban admin hàng tuần đã bị thay đổi. Nếu có sự nhầm lẫn, xin hãy liên hệ lại với chúng tôi.', 1, 'Lịch phòng ban đã có sự thay đổi', 1, 1),
(17, '2024-05-05 12:58:17.924000', 'Lịch phòng họp Phòng họp A3 vào buổi chiều ngày 06/05/2024 đã bị xóa.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 0, 'Lịch phòng họp của bạn có sự thay đổi', 1, 1),
(18, '2024-05-05 12:58:32.086000', 'Lịch phòng họp Phòng họp A2 vào buổi chiều ngày 06/05/2024 đã bị xóa.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 1, 'Lịch phòng họp của bạn có sự thay đổi', 3, 3),
(19, '2024-05-05 12:58:48.512000', 'Bạn đã đặt phòng họp Phòng họp A2 thành công vào buổi chiều ngày 14/05/2024 tới hết buổi sáng ngày 15/05/2024.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.', 1, 'Phòng họp đã được đặt', 3, 3),
(20, '2024-05-05 13:02:39.705000', '123', 0, 'Thông báo mới', 3, 1),
(21, '2024-05-05 13:02:39.709000', '123', 0, 'Thông báo mới', 3, 2),
(22, '2024-05-05 13:02:39.713000', '123', 0, 'Thông báo mới', 3, 3);

INSERT INTO `password_reset_token` (`id`, `expiry_date`, `token`, `user_id`) VALUES
(1, '2024-05-04 06:14:06.338000', 'de833800-e9b5-413c-951d-8bd6fd910789', 3);


INSERT INTO `post` (`id`, `content`, `created_at`, `description`, `image`, `title`, `updated_at`, `created_by`) VALUES
(1, '{\"blocks\":[{\"id\":\"BdDZGjolZa\",\"type\":\"header\",\"data\":{\"text\":\"List trong Java\",\"level\":2},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"aQHrla4KDd\",\"type\":\"paragraph\",\"data\":{\"text\":\"List trong Java, hay interface <b>java.util.List</b> được mô tả như là một\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"VwEvvzkG5J\",\"type\":\"nestedchecklist\",\"data\":{\"style\":\"unordered\",\"items\":[{\"content\":\"Danh sách có thứ tự\",\"checked\":null,\"items\":[]},{\"content\":\"Có thể truy xuất phần tử ở một vị trí bất kỳ trong list\",\"checked\":null,\"items\":[]}]}},{\"id\":\"Fb6vbraeiW\",\"type\":\"paragraph\",\"data\":{\"text\":\"Có hai class phổ biến nhất implement List là <b>ArrayList</b> và <b>Linked list</b>\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"K2cCPYTSRf\",\"type\":\"header\",\"data\":{\"text\":\"ArrayList\",\"level\":2},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"JTR7leUWEI\",\"type\":\"paragraph\",\"data\":{\"text\":\"Ưu điểm của array là tiết kiệm bộ nhớ và tốc độ truy xuất ngẫu nhiên (tìm một phần tử ở vị trí bất kỳ) nhanh. Tuy nhiên, đổi lại thì array phải có độ dài cố định khi bạn khởi tạo. Nếu khai báo nhiều quá sẽ tốn bộ nhớ, ít quá thì không đủ để lưu trữ.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"OU2VfHWwoE\",\"type\":\"paragraph\",\"data\":{\"text\":\"Để thuận tiện cho cả việc sử dụng và tốc độ truy xuất, ArrayList ra đời để khắc phục các nhược điểm đó nhưng vẫn kế thừa ưu điểm trong việc truy xuất dữ liệu của array. ArrayList làm điều đó bằng cách sử dụng một dynamic array để lưu trữ các phần tử. Khi bạn thêm hoặc xóa phần tử, ArrayList sẽ tính toán để tạo một array mới có kích thước phù hợp và copy toàn bộ phần tử từ array cũ sang array mới.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"UngEYZJEAJ\",\"type\":\"paragraph\",\"data\":{\"text\":\"Khởi điểm array sẽ rỗng và có một biến integer cho biết kích thước thực của ArrayList, gọi là size, bằng 0.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"hvJ5yBxPas\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_d7ea775e-24c0-4dd0-9146-a4f216724a10.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"6pefcynLmI\",\"type\":\"paragraph\",\"data\":{\"text\":\"Array này là một static array rỗng và share cho tất cả các hàm khởi tạo ArrayList để giảm thiểu bộ nhớ sử dụng nếu bạn mới chỉ khởi tạo chứ chưa dùng.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"I8lEB3to7G\",\"type\":\"paragraph\",\"data\":{\"text\":\"Khi bắt đầu thêm mới một phần tử, elementData sẽ được gán bằng một mảng mới có độ dài thường là bằng 10.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"wo_6vBeFu7\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_3f5157a0-6b4a-412c-8920-d686d0d4eed0.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"Cac4jLBQ2k\",\"type\":\"paragraph\",\"data\":{\"text\":\"Khi tiếp tục thêm phần tử, elementData sẽ được lấp đầy\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"kyCYB3oZH4\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_2ff54fea-d274-45cb-9e87-dbf0e3cc59a4.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"SzUxj-UBiR\",\"type\":\"paragraph\",\"data\":{\"text\":\"Giả sử elementData đã được lấp đầy (10 phần tử)\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"x7rR6Z-fpE\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_e0869c7a-a933-4bd9-8875-97717b44bdd2.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"uRLCM7mnAJ\",\"type\":\"paragraph\",\"data\":{\"text\":\"Khi ta lại thêm phần tử, elementData sẽ lại được khởi tạo bằng một array mới có size tăng thêm 50% size gốc\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"P2cHhMNhS0\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_fda7bbe2-20d8-4405-b255-8e8a1fcf61fc.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"dWOp1_dRu2\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; Cách thức tăng của elementData là newSize = oldSize * 1.5\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"PnZIw-5i7C\",\"type\":\"paragraph\",\"data\":{\"text\":\"Tương tự:\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"DNIOGDiixs\",\"type\":\"paragraph\",\"data\":{\"text\":\"10 -&gt; 15\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"LHi4chkA61\",\"type\":\"paragraph\",\"data\":{\"text\":\"15 -&gt; 22\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"PC3AqZDRqe\",\"type\":\"paragraph\",\"data\":{\"text\":\"22 -&gt; 33\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"Fajj-sNY0t\",\"type\":\"paragraph\",\"data\":{\"text\":\"33 -&gt; 49\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"iqx5j5mQv0\",\"type\":\"paragraph\",\"data\":{\"text\":\"49 -&gt; 73&nbsp;&nbsp;\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"-82VtzpEwy\",\"type\":\"paragraph\",\"data\":{\"text\":\"Trong trường hợp delete, giả sử delete tại index 5, thực hiện:\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"nqBt1MV3AW\",\"type\":\"nestedchecklist\",\"data\":{\"style\":\"unordered\",\"items\":[{\"content\":\"Copy item từ vị trí 5 + 1 tới cuối và đè vào index 5\",\"checked\":null,\"items\":[]},{\"content\":\"Giá trị ở vị trí cuối sẽ bị thừa ra, đặt giá trị thành null\",\"checked\":null,\"items\":[]},{\"content\":\"Giảm size của list đi 1\",\"checked\":null,\"items\":[]}]}},{\"id\":\"1PQqmmoXGy\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_3793fa1e-57c8-49da-a58c-d1999a39080e.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"2aOhpSfd-t\",\"type\":\"paragraph\",\"data\":{\"text\":\"Giờ ta có một list chỉ còn 10 phần tử.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"3i5TtvirDO\",\"type\":\"header\",\"data\":{\"text\":\"Nhận xét\",\"level\":3},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"ITAfdqNRUI\",\"type\":\"nestedchecklist\",\"data\":{\"style\":\"unordered\",\"items\":[{\"content\":\"Với cách liên tục tạo mới array và copy array, ArrayList sẽ kém trong việc thêm mới hoặc xóa phần tử, sẽ ngày một tệ hơn khi số phần tử tăng lên.\",\"checked\":null,\"items\":[]},{\"content\":\"Truy xuất ngẫu nhiên trong ArrayList chính là truy xuất theo index trong array nên tốc độ rất nhanh.\",\"checked\":null,\"items\":[]},{\"content\":\"Cách delete của ArrayList sẽ hoạt động kém nếu bạn delete với những index nhỏ, tệ nhất sẽ là index = 0. Giả sử list của bạn có size = 100. Nếu bạn delete phần tử đầu tiên, ArrayList sẽ phải copy 99 phần tử.\",\"checked\":null,\"items\":[]},{\"content\":\"array trong ArrayList sẽ ngày một to ra khi bạn thêm phần tử, thêm mỗi lần 50% khi thiếu chỗ lưu và sẽ không giảm đi khi bạn delete.\",\"checked\":null,\"items\":[]}]}}],\"time\":1714775489090,\"version\":\"2.29.1\"}', '2024-05-04 05:32:12.977000', '', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/arraylist-linkedlist_0c76ef3c-e9cb-4c67-9563-5a6fbf059bfb.png?alt=media', 'ArrayList và LinkedList (P1)', '2024-05-04 05:32:12.977000', 1);
INSERT INTO `post` (`id`, `content`, `created_at`, `description`, `image`, `title`, `updated_at`, `created_by`) VALUES
(2, '{\"blocks\":[{\"id\":\"IPKFMkUQfe\",\"type\":\"paragraph\",\"data\":{\"text\":\"Căn cứ nội dung văn bản của <b>P.TC-HC</b>, <b>P.ĐTĐH</b> gửi thông báo đến Quý Thầy, Cô và Sinh viên lịch nghỉ lễ các ngày kỷ niệm nói&nbsp;trên.&nbsp;\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"zH2Kq9ubC2\",\"type\":\"paragraph\",\"data\":{\"text\":\"Các lớp học vào ngày <b>thứ Bảy 27/4/2024</b> <mark class=\\\"cdx-marker\\\">vẫn tiến hành dạy - học</mark> bình thường.&nbsp;\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"EJBMrGWY5S\",\"type\":\"paragraph\",\"data\":{\"text\":\"Thầy, Cô tự chủ động <mark class=\\\"cdx-marker\\\">sắp xếp dạy bù</mark> các lớp trong <b>ngày thứ Hai 29/4/2024</b> để đảm bảo chương trình và thời lượng&nbsp;học.&nbsp;Thầy, Cô có thể sắp xếp dạy bù theo hình thức online.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"2sQgiyVZu3\",\"type\":\"paragraph\",\"data\":{\"text\":\"Trân trọng.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"xNk5VipwzA\",\"type\":\"paragraph\",\"data\":{\"text\":\"----\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"kYaOc-px84\",\"type\":\"paragraph\",\"data\":{\"text\":\"<b>TBN</b>\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"iF1qIBZPVC\",\"type\":\"attaches\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/415_tb_dhcntt16_4_2024_a475426d-16ae-4503-bd10-a556ee07a23b.pdf?alt=media\",\"extension\":\"pdf\",\"name\":\"415_tb_dhcntt16_4_2024.pdf\",\"size\":294157},\"title\":\"415_tb_dhcntt16_4_2024.pdf\"}}],\"time\":1714775672262,\"version\":\"2.29.1\"}', '2024-05-04 05:35:33.515000', 'Thông báo nghỉ lễ ngày Chiến thắng 30/4 và Quốc tế Lao động 01/5 năm 2024. Nghỉ từ CN đến hết thứ tư.', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2FImage_not_available.png?alt=media', 'Thông báo nghỉ lễ ngày Chiến thắng 30/4 và Quốc tế Lao động 01/5 năm 2024', '2024-05-04 05:35:33.515000', 1);
INSERT INTO `post` (`id`, `content`, `created_at`, `description`, `image`, `title`, `updated_at`, `created_by`) VALUES
(3, '{\"blocks\":[{\"id\":\"wIOSqmaDe6\",\"type\":\"paragraph\",\"data\":{\"text\":\"<b>Tháng tư về, mênh mang trong một bản đồng ca giao mùa tuyệt đẹp. Và với người VTD, tháng 4 này thêm rạo rực hơn khi đánh dấu VTD tròn 20 tuổi. Chặng đường 20 năm đã qua là một chặng đường lịch sử đầy kỷ niệm và đáng tự hào. Ở đó có ý chí và đường hướng lãnh đạo của người đứng đầu, có sự miệt mài tận tụy không ngừng nghỉ của đội ngũ CBNV, có sự hợp tác hỗ trợ của khách hàng và đối tác. Tất cả đã cộng hưởng thành sức mạnh đưa VTD vượt qua những khó khăn, chinh phục những đỉnh cao và đạt đến thành công ngày hôm nay.</b>\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"2xRGsCWqrW\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_eb0b03ef-2053-4c06-afcb-6c19ebf747c1.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":true,\"withBackground\":false}},{\"id\":\"dGqn0IX2f2\",\"type\":\"paragraph\",\"data\":{\"text\":\"Nhân dịp kỷ niệm 20 năm thành lập Công ty VTD, kính chúc Ban lãnh đạo sẽ chèo lái con tàu VTD vững vàng vượt sóng, chinh phục thêm thật nhiều thành công mới và đạt được những mục tiêu đã đề ra! Kính chúc VTD ngày càng tăng trưởng lớn mạnh, phát triển bền vững, tạo ra nhiều giá trị cho cộng đồng, đóng góp vào sự phát triển kinh tế – xã hội của đất nước!\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"Isqg6bOTV9\",\"type\":\"paragraph\",\"data\":{\"text\":\"Xin được gửi tới Quý đối tác, khách hàng lời tri ân sâu sắc vì sự ủng hộ, đồng hành, hợp tác của Quý vị đã dành cho VTD trong suốt thời gian qua. VTD mong muốn sẽ tiếp tục được đồng hành cùng Quý vị trên hành trình phía trước!\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"ILBBOIMKwa\",\"type\":\"paragraph\",\"data\":{\"text\":\"Chúc mừng VTD với một hành trình 20 năm đầy nỗ lực, bền bỉ và với những dấu ấn thành công!!!\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}}],\"time\":1714775943708,\"version\":\"2.29.1\"}', '2024-05-04 05:39:16.746000', '', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2FImage_not_available.png?alt=media', 'CHÀO MỪNG KỶ NIỆM 20 NĂM THÀNH LẬP CÔNG TY', '2024-05-04 05:39:16.746000', 1);
INSERT INTO `post` (`id`, `content`, `created_at`, `description`, `image`, `title`, `updated_at`, `created_by`) VALUES
(4, '{\"blocks\":[{\"id\":\"AMNtHCun14\",\"type\":\"paragraph\",\"data\":{\"text\":\"Hướng đến kỷ niệm 95 năm Ngày thành lập Công đoàn Việt Nam (28/7/1929 - 28/7/2024), <b>kỷ niệm 30 năm</b> Ngày thành lập Đại học Quốc gia TP.Hồ Chí Minh, kỷ niệm 18 năm Ngày thành lập Trường Đại học Công nghệ Thông tin, Công đoàn Trường tổ chức hội thao dành cho toàn thể giảng viên, viên chức, người lao động. Hội thao là dịp để các Công đoàn viên Trường Đại học Công đoàn viên rèn luyện thể chất, tạo sân chơi vui khỏe, giàu kết nối, hưởng ứng tinh thần thể dục thể thao và góp phần nâng cao hiệu quả trong công tác cho tập thể Công đoàn viên toàn Trường đạt đến mục tiêu \\\"Khoẻ để dạy tốt và công tác tốt\\\"\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"B_-KCmpNwo\",\"type\":\"paragraph\",\"data\":{\"text\":\"Hội thao năm nay sẽ <b>diễn ra từ tháng 03 - 05/2024</b>, các đội thi sẽ bốc thăm và đấu loại trực tiếp để tìm ra đội chiến thắng tranh tài tiếp tục ở bán kết và chung kết. Năm nay, hội thao được tổ chức với <b>11 hạng mục thi đấu</b> chính: Bóng chuyền hơi, Bóng đá mini Nam, Bóng đá mini nữ, Bóng đá tình yêu, Nhảy dây, Chạy Việt dã, Chạy xe đạp chậm, Thi vẽ, Bóng bàn, Cầu lông, Kéo co.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"ScYLBH4SZC\",\"type\":\"paragraph\",\"data\":{\"text\":\"<b>8h00 ngày 28/3/2024</b> Khai mạc <b>Hội thao tại Sân Cờ cổng A</b>.<mark class=\\\"cdx-marker\\\">  08h30 cùng ngày thi đấu môn Nhảy dây và 09h00 thi đấu môn Chạy Việt dã</mark>.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"1HqQ2PsqF7\",\"type\":\"paragraph\",\"data\":{\"text\":\"Hội thao Công đoàn không chỉ là dịp để giúp các giảng viên, viên chức, người lao động rèn luyện sức khỏe, nâng cao tinh thần thể thao, mà còn góp phần chọn ra những tuyển thủ xuất sắc tham gia các giải đấu lớn các cấp sắp tới. Chúc cho các giảng viên, viên chức, người lao động sẽ có những khoảnh khắc thi đấu đầy thăng hoa và đạt thành tích cao nhất. Sự kiện này ngoài mang ý nghĩa gắn kết nội bộ, còn là dịp để chúng ta cùng nhau thấy những thầy, cô của mình ở một vai trò rất khác - họ đã thoát khỏi nhiều nguyên tắc ngày thường để khoác lên mình một diện mạo thật năng động, hòa mình vào sân chơi thể thao lớn nhất năm.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"ZGq_hR8P3Z\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_2ed9ae45-3372-407e-9765-727314782a48.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":true,\"withBackground\":false}}],\"time\":1714776159232,\"version\":\"2.29.1\"}', '2024-05-04 05:43:05.418000', '', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/hoithao_a751a789-3321-406a-bdd8-3e28657363c7.jpg?alt=media', 'Hội thao năm 2024', '2024-05-04 05:43:05.418000', 1),
(5, '{\"blocks\":[{\"id\":\"EL_PU8Cp-x\",\"type\":\"header\",\"data\":{\"text\":\"LinkedList\",\"level\":2},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"ALjn_osDf4\",\"type\":\"paragraph\",\"data\":{\"text\":\"<b>LinkedList</b> là một danh sách liên kết kép <b>(Doubly-linked list)</b>, thay vì dùng array để lưu dữ liệu như <b>ArrayList</b>, <b>LinkedList</b> lại dùng cấu trúc danh sách liên kết để lưu trữ. Cách thức hoạt động như sau: <b>LinkedList</b> bao gồm:\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"UD-oDCkoo1\",\"type\":\"nestedchecklist\",\"data\":{\"style\":\"unordered\",\"items\":[{\"content\":\"size để lưu dung lượng thực của list, giống <b>ArrayList</b> Node first để lưu phần tử đầu tiên của list.\",\"checked\":null,\"items\":[]},{\"content\":\"Ban đầu chưa có sẽ là null Node last để lưu phần tử cuối cùng của list.\",\"checked\":null,\"items\":[]},{\"content\":\"Ban đầu chưa có sẽ là null\",\"checked\":null,\"items\":[]},{\"content\":\"Mỗi node sẽ chứa data thực của node, gọi là item, một node kế tiếp của nó, gọi là next và một node đứng ngay trước nó, gọi là prev\",\"checked\":null,\"items\":[]}]}},{\"id\":\"bpBiiluWnw\",\"type\":\"paragraph\",\"data\":{\"text\":\"Khởi điểm, LinkedList sẽ bao gồm 2 node first và last đều mang giá trị null\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"LS5AzSYBla\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_a0c1f27d-b908-4cc5-9c3b-21c2ccd496ae.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"IaWHIlGX6l\",\"type\":\"paragraph\",\"data\":{\"text\":\"Khi thêm phần tử đầu tiên, thay thế node first bằng phần tử đó\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"a2hTNijk46\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_cc8315db-2b40-44ce-9102-0a7daafe68a9.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"jPr7wx8uH0\",\"type\":\"paragraph\",\"data\":{\"text\":\"Khi thêm phần tử tiếp theo, thay vào node last và liên kết giữa node first và node last. Nay list đã có tối thiểu 2 node\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"Zbll-UqmBp\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_04aec3a4-640b-405f-916a-125f2f16251e.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"a56XuxV9W9\",\"type\":\"paragraph\",\"data\":{\"text\":\"Cứ như vậy, khi tiếp tục insert, dù là ở cuối danh sách hay đầu danh sách, <b>LinkedList</b> chỉ việc liên kết các node lại với nhau\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"n7lM9sa1L8\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_ffc88787-b3d5-465a-ac19-1d4c7577d8d5.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"E68RaSCga0\",\"type\":\"paragraph\",\"data\":{\"text\":\"Tương tự khi thêm ở giữa list thì list cũng chỉ cần đơn giản là tạo ra node mới, thay đổi liên kết 2 node bên cạnh node mới thêm vào\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"sca4A6MHeS\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_3c4a4b77-85e2-40dc-82d0-116a884dd1bc.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"8DGqn1T9TJ\",\"type\":\"paragraph\",\"data\":{\"text\":\"Tương tự như vậy, khi cần delete, <b>LinkedList</b> cũng thay đổi liên kết 2 node bên cạnh node vừa bị xóa\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"KEDn5ZmIDQ\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_37771fc0-8067-485b-8baa-3aac5e0b717d.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"pusTBiFMia\",\"type\":\"paragraph\",\"data\":{\"text\":\"Khi cần lấy ra một phần tử ở index bất kỳ, không như&nbsp;<b>ArrayList</b>, <b>LinkedList</b> phải đi dần dần từng node một từ first hay last phụ thuộc vào index ở gần bên nào hơn.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"oscwrGKPu_\",\"type\":\"image\",\"data\":{\"file\":{\"url\":\"https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_b54ad8c9-a01c-40c3-a81b-c79151f64df2.png?alt=media\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":false,\"withBackground\":false}},{\"id\":\"9yoa7pCTU3\",\"type\":\"paragraph\",\"data\":{\"text\":\"Giả sử bạn có một list với 1000 phần tử. Khi bạn cần lấy ra phần tử có index = 500, <b>LinkedList</b> sẽ phải duyệt tới toàn bộ 500 phần tử để có thể lấy ra cái bạn muốn, điều đó là rất tệ.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"MEGEWY2BSq\",\"type\":\"header\",\"data\":{\"text\":\"Nhận xét\",\"level\":3},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"DObIQsk2ah\",\"type\":\"nestedchecklist\",\"data\":{\"style\":\"unordered\",\"items\":[{\"content\":\"Việc tìm phần tử ở vị trí ngẫu nhiên của <b>LinkedList</b> kém hơn <b>ArrayList</b>, đặc biệt với index ở trung tâm\",\"checked\":null,\"items\":[]},{\"content\":\"Việc thêm hoặc xóa node trong <b>LinkedList</b> rất dễ dàng nhưng sẽ tệ dần nếu bạn insert/delete càng về trung tâm của list.\",\"checked\":null,\"items\":[]}]}},{\"id\":\"cde9WlsEBA\",\"type\":\"header\",\"data\":{\"text\":\"ArrayList vs LinkedList\",\"level\":2},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"4ZbWdwvzPj\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; Từ những nhận xét ở trên, các bạn hoàn toàn có thể rút ra so sánh giữa <b>ArrayList</b> và <b>LinkedList</b>.Cá nhân mình, chưa bao giờ dùng <b>LinkedList</b>, vì các lý do sau:&nbsp;&nbsp;\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"HhLF6h8SlW\",\"type\":\"header\",\"data\":{\"text\":\"Chúng ta đều sử dụng những list có kích thước nhỏ.\",\"level\":3},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"odohML7wIe\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; Khi list có kích thước nhỏ thì tốc độ mở rộng của dynamic array không hề thua kém so với <b>LinkedList</b>.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"t_eTTRf6Gt\",\"type\":\"header\",\"data\":{\"text\":\"Chúng ta có xu hướng sử dụng list để duyệt và tìm kiếm nhiều hơn so với insert từng phần tử một.\",\"level\":3},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"suqw6Kayxk\",\"type\":\"paragraph\",\"data\":{\"text\":\"Việc duyệt bằng array chắc chắn là vượt trội hơn so với cách duyệt qua từng phần tử của <b>LinkedList</b>\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"4lK5W1pzrJ\",\"type\":\"header\",\"data\":{\"text\":\"Có nhiều cách để tạo ra 1 ArrayList chứa nhiều phần tử mà vẫn khắc phục được nhược điểm của ArrayList\",\"level\":3},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"m3X0c7tt6x\",\"type\":\"nestedchecklist\",\"data\":{\"style\":\"unordered\",\"items\":[{\"content\":\"Tạo <b>ArrayList</b> từ <b>Collection </b>khác: new <b>ArrayList</b>&lt;&gt;(<b>Collection</b>&lt;&gt; e)\",\"checked\":null,\"items\":[]},{\"content\":\"Thêm nhiều phần tử một lúc bằng list.addAll(<b>Collection</b>&lt;&gt; e)\",\"checked\":null,\"items\":[]},{\"content\":\"Định số phần tử trước khi insert: new <b>ArrayList</b>&lt;&gt;(int initialCapacity)\",\"checked\":null,\"items\":[]},{\"content\":\"Dùng Stream API. Stream API sử dụng list.addAll\",\"checked\":null,\"items\":[]}]}},{\"id\":\"0y_m3cot91\",\"type\":\"header\",\"data\":{\"text\":\"LinkedList tốn nhiều bộ nhớ để lưu trữ\",\"level\":3},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"eyfDIQ-EKR\",\"type\":\"paragraph\",\"data\":{\"text\":\"Một số trường hợp,&nbsp; <b>LinkedList</b> tốn dung lượng gấp đôi so với <b>ArrayList</b>. Ngoài ra array luôn thân thiện với Garbage Collection hơn so với các Node của <b>LinkedList</b>.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"diT3HcQnR2\",\"type\":\"header\",\"data\":{\"text\":\"LinkedList insert/delete tốt nhưng chưa chắc đã nhanh.\",\"level\":3},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"8NKJE19jsW\",\"type\":\"paragraph\",\"data\":{\"text\":\"Giả sử bạn cần insert hoặc delete ở giữa list. Trước khi có thể insert/delete, nó phải duyệt qua một nửa số phần tử của list, điều mà <b>LinkedList</b> làm tệ nhất\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}}],\"time\":1714776679761,\"version\":\"2.29.1\"}', '2024-05-04 05:51:39.952000', '', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/arraylist-linkedlist_7e94ab5b-8d08-4dcd-ad72-8e20c25bd30c.png?alt=media', 'ArrayList và LinkedList (P2)', '2024-05-04 05:51:39.952000', 1),
(6, '{\"blocks\":[{\"id\":\"KRLNBCh9vs\",\"type\":\"paragraph\",\"data\":{\"text\":\"<b>Giao lưu cùng chuyên gia và các bạn Đại sứ UIT: </b>\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"tmEpluBddz\",\"type\":\"nestedchecklist\",\"data\":{\"style\":\"unordered\",\"items\":[{\"content\":\"ThS. Đỗ Văn Tiến - Phó trưởng khoa Khoa học Máy tính \",\"checked\":null,\"items\":[]},{\"content\":\"TS. Lương Ngọc Hoàng - Giảng viên khoa Khoa học Máy tính - Đại sứ \",\"checked\":null,\"items\":[]},{\"content\":\"sinh viên Chu Minh Nhật Hạ - sinh viên năm 2, ngành Trí tuệ nhân tạo\",\"checked\":null,\"items\":[]}]}},{\"id\":\"cvGfbzVfv6\",\"type\":\"paragraph\",\"data\":{\"text\":\"<b>Nội dung xoay quanh:</b>\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"jLyNkyTSFh\",\"type\":\"paragraph\",\"data\":{\"text\":\"Khám phá thế giới nghề nghiệp của ngành Khoa học Máy tính &amp; Trí tuệ nhân tạo.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"vgYM49h53d\",\"type\":\"paragraph\",\"data\":{\"text\":\"Điều gì làm nên sức hút của ngành, điểm chuẩn đầu vào luôn giữ vị trí TỐP đầu Sinh viên thường xuyên dẫn đầu tại các cuộc thi cấp quốc gia và quốc tế.\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"H4GWx1hwTs\",\"type\":\"paragraph\",\"data\":{\"text\":\"Đâu là bí quyết? Giao lưu cùng Đại sứ sinh viên về môi trường học tập, cuộc sống sinh viên viên\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"Ds4CHjaN6e\",\"type\":\"paragraph\",\"data\":{\"text\":\"Tất cả sẽ được giải mã vào lúc 20h00 ngày 30/04/2024\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"Vzy3N1Aa8E\",\"type\":\"paragraph\",\"data\":{\"text\":\"Chương trình sẽ được phát sóng trên các nền tảng online của UIT: Facebook, YouTube, TikTok Kính mời quý phụ huynh &amp; học sinh đón xem\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"-C-idoB1VM\",\"type\":\"embed\",\"data\":{\"service\":\"youtube\",\"source\":\"https://www.youtube.com/watch?v=ly4bcvukAIo\",\"embed\":\"https://www.youtube.com/embed/ly4bcvukAIo\",\"width\":580,\"height\":320,\"caption\":\"\"}},{\"id\":\"xc7VApt1Tz\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; Mọi thông tin chi tiết xem tại:&nbsp;<a href=\\\"https://www.facebook.com/TuyenSinh.UIT/posts/pfbid0UcofBWi7dZYxeuFa7C4KPYibSUufn5u7xr8knVLkzbEo4nYwJqYTAyGwVLRmMcBUl\\\">https://www.facebook.com/TuyenSinh.UIT/posts/pfbid0UcofBWi7dZYxeuFa7C4KPYibSUufn5u7xr8knVLkzbEo4nYwJqYTAyGwVLRmMcBUl</a>\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"left\"}}},{\"id\":\"qplir7UPtx\",\"type\":\"paragraph\",\"data\":{\"text\":\"<i>Hạ Băng - Cộng tác viên Truyền thông Trường Đại học Công nghệ Thông tin</i>\"},\"tunes\":{\"anyTuneName\":{\"alignment\":\"right\"}}}],\"time\":1714776943995,\"version\":\"2.29.1\"}', '2024-05-04 05:56:23.907000', 'UIT kết nối 2024 sẽ tiếp tục số thứ 6 với chủ đề: “GIẢI MÃ SỨC HÚT ngành Khoa học Máy tính & Trí tuệ Nhân tạo”', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/438304630_725470793119469_6895488751716108445_n_1636faaa-7c4b-4dad-b4a5-74175fb2ce99.jpg?alt=media', 'UIT Kết nối 2014', '2024-05-04 05:56:23.907000', 1);

INSERT INTO `post_tag` (`post_id`, `tag_id`) VALUES
(1, 1);
INSERT INTO `post_tag` (`post_id`, `tag_id`) VALUES
(5, 1);
INSERT INTO `post_tag` (`post_id`, `tag_id`) VALUES
(2, 2);
INSERT INTO `post_tag` (`post_id`, `tag_id`) VALUES
(3, 2),
(6, 2),
(4, 4),
(3, 5),
(4, 6),
(6, 6);



INSERT INTO `resource` (`id`, `name`) VALUES
(1, 'Micro 1');
INSERT INTO `resource` (`id`, `name`) VALUES
(2, 'Micro 2');
INSERT INTO `resource` (`id`, `name`) VALUES
(3, 'Tài liệu 3');



INSERT INTO `tag` (`id`, `name`, `number_post`) VALUES
(1, 'Tri thức', 2);
INSERT INTO `tag` (`id`, `name`, `number_post`) VALUES
(2, 'Quan trọng', 2);
INSERT INTO `tag` (`id`, `name`, `number_post`) VALUES
(3, 'Chúc mừng sinh nhật', 0);
INSERT INTO `tag` (`id`, `name`, `number_post`) VALUES
(4, 'Thể thao', 1),
(5, 'Kỷ niệm', 0),
(6, 'Sự kiện', 2);

INSERT INTO `unit` (`id`, `manager_id`, `name`, `number_staffs`) VALUES
(1, 1, 'admin', 1);
INSERT INTO `unit` (`id`, `manager_id`, `name`, `number_staffs`) VALUES
(2, 3, 'nhân sự', 2);


INSERT INTO `unit_feature` (`feature_id`, `unit_id`) VALUES
(1, 1);
INSERT INTO `unit_feature` (`feature_id`, `unit_id`) VALUES
(1, 2);
INSERT INTO `unit_feature` (`feature_id`, `unit_id`) VALUES
(2, 2);

INSERT INTO `unit_shift` (`day_of_week`, `unit_id`, `is_has_day_shift`, `is_has_night_shift`) VALUES
('MONDAY', 1, 0, 0);
INSERT INTO `unit_shift` (`day_of_week`, `unit_id`, `is_has_day_shift`, `is_has_night_shift`) VALUES
('MONDAY', 2, 1, 1);
INSERT INTO `unit_shift` (`day_of_week`, `unit_id`, `is_has_day_shift`, `is_has_night_shift`) VALUES
('TUESDAY', 1, 0, 0);
INSERT INTO `unit_shift` (`day_of_week`, `unit_id`, `is_has_day_shift`, `is_has_night_shift`) VALUES
('TUESDAY', 2, 1, 1),
('WEDNESDAY', 1, 1, 0),
('WEDNESDAY', 2, 1, 1),
('THURSDAY', 1, 0, 1),
('THURSDAY', 2, 1, 1),
('FRIDAY', 1, 0, 0),
('FRIDAY', 2, 1, 1),
('SATURDAY', 1, 0, 0),
('SATURDAY', 2, 1, 0),
('SUNDAY', 1, 0, 0),
('SUNDAY', 2, 0, 0);



INSERT INTO `user` (`id`, `address`, `dob`, `email`, `image`, `is_deleted`, `male`, `name`, `password`, `phone`, `user_identity`, `unit_id`) VALUES
(1, 'TPHCM', '23/12/2000', 'admin@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 0, 1, 'Admin\'s name', '$2a$10$Hj6e38XWk3g/tEb6M4C7fO8WddInLsvLFypKE0bbhVQddMUnIAspa', '0123456789', '012345678901', 1);
INSERT INTO `user` (`id`, `address`, `dob`, `email`, `image`, `is_deleted`, `male`, `name`, `password`, `phone`, `user_identity`, `unit_id`) VALUES
(2, 'Thủ Đức', '22/01/2004', 'user@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 0, 0, 'User\'s name', '$2a$10$HaDXxAFsuseSQHdmCaShhOu90UOVYiyRHj6fyDMBG5xUXAKS3FCLe', '0123456789', '012345678901', 2);
INSERT INTO `user` (`id`, `address`, `dob`, `email`, `image`, `is_deleted`, `male`, `name`, `password`, `phone`, `user_identity`, `unit_id`) VALUES
(3, 'Hà Nội', '23/05/2006', '21520339@gm.uit.edu.vn', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 0, 0, 'Nguyễn Lê Ngọc Mai', '$2a$10$SSOCK5ehQgO5A/zWiLw3uuwpyWHPbmIfoBuRjP0jeGs.y5dHZ7DbK', '0123456789', '012345678901', 2);
INSERT INTO `user` (`id`, `address`, `dob`, `email`, `image`, `is_deleted`, `male`, `name`, `password`, `phone`, `user_identity`, `unit_id`) VALUES
(4, 'Hà Nội', '23/05/2006', 'deletedUser@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 1, 1, 'Tên nhân viên đã bị xóa', '$2a$10$HaDXxAFsuseSQHdmCaShhOu90UOVYiyRHj6fyDMBG5xUXAKS3FCLe', '0123456789', '012345678901', NULL),
(5, 'TPHCM', '02/12/2000', 'kimdong@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 1, 1, 'Kim Đồng', 'App123', '0585885214', '012345678901', NULL),
(7, 'TPHCM', '08/08/2020', 'kimdong123@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 1, 1, 'Nhân viên Kim Đồng', 'App123', '0585885212', '012345678901', NULL),
(8, 'Thủ Đức', '31/12/2000', 'nvm@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/cac-buoc-toi-uu-hinh-anh-chuan-seo_0a745096-344e-4fca-97d4-6947025a3342.jpg?alt=media', 1, 1, 'Nhân viên mới sửa', '$2a$10$BHFc7jdar.KaPgqQvFo6h.tp8QKSRbUDJIJNHn62pajaHDtv59Ea2', '0585885218', '012345678901', NULL),
(9, 'TPHCM', '02/02/2222', 'a@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 1, 1, 'Dạy nấu ăn 2', '$2a$10$BHFc7jdar.KaPgqQvFo6h.tp8QKSRbUDJIJNHn62pajaHDtv59Ea2', '0919676723', '012345678901', NULL),
(10, 'TPHCM', '01/01/2000', 'b@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media', 1, 1, 'đâsdsada', '$2a$10$oxUccLYefUpb2zcRmRpWC.uuLhM.ERs2kxenecXiLtLnz653uqmzC', '0585885214', '012345678901', NULL);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;