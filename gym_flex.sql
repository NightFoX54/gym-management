-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: gym_flex
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `club_visits`
--

DROP TABLE IF EXISTS `club_visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_visits` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `check_in_date` date NOT NULL,
  `check_in_time` time NOT NULL,
  `check_out_date` date DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `club_visits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_visits`
--

LOCK TABLES `club_visits` WRITE;
/*!40000 ALTER TABLE `club_visits` DISABLE KEYS */;
/*!40000 ALTER TABLE `club_visits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_requests`
--

DROP TABLE IF EXISTS `contact_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `subject` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `submission_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_requests`
--

LOCK TABLES `contact_requests` WRITE;
/*!40000 ALTER TABLE `contact_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_info`
--

DROP TABLE IF EXISTS `employee_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `weekly_hours` int NOT NULL,
  `shift_schedule_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `employee_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_info`
--

LOCK TABLES `employee_info` WRITE;
/*!40000 ALTER TABLE `employee_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_categories`
--

DROP TABLE IF EXISTS `market_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_categories`
--

LOCK TABLES `market_categories` WRITE;
/*!40000 ALTER TABLE `market_categories` DISABLE KEYS */;
INSERT INTO `market_categories` VALUES (1,'Supplement'),(2,'Equipment'),(3,'Clothing'),(4,'Accessories');
/*!40000 ALTER TABLE `market_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_product_sales`
--

DROP TABLE IF EXISTS `market_product_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_product_sales` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `market_product_sales_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `market_sales_invoices` (`id`),
  CONSTRAINT `market_product_sales_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `market_products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_product_sales`
--

LOCK TABLES `market_product_sales` WRITE;
/*!40000 ALTER TABLE `market_product_sales` DISABLE KEYS */;
INSERT INTO `market_product_sales` VALUES (1,1,1,1),(2,2,1,1);
/*!40000 ALTER TABLE `market_product_sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_products`
--

DROP TABLE IF EXISTS `market_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `category_id` bigint NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `market_products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `market_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_products`
--

LOCK TABLES `market_products` WRITE;
/*!40000 ALTER TABLE `market_products` DISABLE KEYS */;
INSERT INTO `market_products` VALUES (1,'/protein.png','Whey Protein Powder',1,599.99,43,'High-quality whey protein powder for muscle recovery - 2000g'),(2,'/bcaa.png','BCAA Amino Acids',1,299.99,60,'Essential amino acids for muscle growth and recovery - 400g'),(3,'/preworkout.png','Pre-Workout Energy',1,349.99,38,'Advanced pre-workout formula for maximum performance - 300g'),(4,'/yoga-mat.png','Premium Yoga Mat',2,199.99,25,'Non-slip, eco-friendly yoga mat with alignment lines'),(5,'/dumbbells.png','Adjustable Dumbbell Set',2,1499.99,12,'Space-saving adjustable dumbbells 2-24kg each'),(6,'/bands.png','Resistance Bands Set',2,249.99,30,'Set of 5 resistance bands with different strength levels'),(7,'/tshirt.png','Performance T-Shirt',3,149.99,85,'Moisture-wicking, breathable training t-shirt'),(8,'/shorts.png','Training Shorts',3,179.99,70,'Flexible, quick-dry training shorts with pockets'),(9,'/leggings.png','Compression Leggings',3,229.99,55,'High-waist compression leggings with phone pocket'),(10,'/bottle.png','Sports Water Bottle',4,89.99,120,'BPA-free sports water bottle with time markings - 1L'),(11,'/gym-bag.png','Gym Bag',4,259.99,40,'Spacious gym bag with wet compartment and shoe pocket'),(12,'/gloves.png','Lifting Gloves',4,129.99,65,'Premium weightlifting gloves with wrist support'),(20,'/uploads/images/15cec89f-7031-418c-995a-b44a188af64a.png','deneme',2,111.00,11,'..');
/*!40000 ALTER TABLE `market_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_purchases`
--

DROP TABLE IF EXISTS `market_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_purchases` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `total_paid` decimal(10,2) NOT NULL,
  `purchase_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `market_purchases_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `market_products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_purchases`
--

LOCK TABLES `market_purchases` WRITE;
/*!40000 ALTER TABLE `market_purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `market_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_sales_invoices`
--

DROP TABLE IF EXISTS `market_sales_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_sales_invoices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `total_items` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `sale_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `market_sales_invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_sales_invoices`
--

LOCK TABLES `market_sales_invoices` WRITE;
/*!40000 ALTER TABLE `market_sales_invoices` DISABLE KEYS */;
INSERT INTO `market_sales_invoices` VALUES (1,2,1,509.99,'2025-03-16 21:57:11'),(2,16,1,509.99,'2025-03-16 22:53:19');
/*!40000 ALTER TABLE `market_sales_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_training_plans`
--

DROP TABLE IF EXISTS `member_training_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_training_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `workout_id` bigint NOT NULL,
  `day_of_week` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `workout_id` (`workout_id`),
  CONSTRAINT `member_training_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `member_training_plans_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`),
  CONSTRAINT `member_training_plans_chk_1` CHECK ((`day_of_week` between 1 and 7))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_training_plans`
--

LOCK TABLES `member_training_plans` WRITE;
/*!40000 ALTER TABLE `member_training_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_training_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership_plans`
--

DROP TABLE IF EXISTS `membership_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `plan_price` decimal(38,2) NOT NULL,
  `guest_pass_count` int NOT NULL,
  `monthly_pt_sessions` int NOT NULL,
  `group_class_count` int NOT NULL,
  `market_discount` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership_plans`
--

LOCK TABLES `membership_plans` WRITE;
/*!40000 ALTER TABLE `membership_plans` DISABLE KEYS */;
INSERT INTO `membership_plans` VALUES (1,'Basic Plan',800.00,2,0,0,0),(2,'Premium Plan',1300.00,4,1,-1,10),(3,'Elite Plan',2000.00,-1,2,-1,15);
/*!40000 ALTER TABLE `membership_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memberships`
--

DROP TABLE IF EXISTS `memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memberships` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `plan_id` bigint NOT NULL,
  `discount_amount` decimal(38,2) DEFAULT NULL,
  `paid_amount` decimal(38,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_frozen` tinyint(1) DEFAULT '0',
  `freeze_start_date` date DEFAULT NULL,
  `freeze_end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `plan_id` (`plan_id`),
  CONSTRAINT `memberships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `memberships_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `membership_plans` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memberships`
--

LOCK TABLES `memberships` WRITE;
/*!40000 ALTER TABLE `memberships` DISABLE KEYS */;
INSERT INTO `memberships` VALUES (9,13,2,390.00,3510.00,'2025-03-16','2025-06-16',0,NULL,NULL),(10,14,3,2400.00,9600.00,'2025-03-16','2025-09-16',0,NULL,NULL),(11,15,3,2400.00,9600.00,'2025-03-16','2025-09-16',0,NULL,NULL),(12,16,3,2400.00,9600.00,'2025-03-16','2025-09-16',0,NULL,NULL);
/*!40000 ALTER TABLE `memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `card_holder_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `card_number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `expiry_date` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cvv` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_payment_method` (`user_id`),
  CONSTRAINT `user_id_payment_method` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
INSERT INTO `payment_method` VALUES (1,15,'berkay arıkan','4623','12/25',123),(2,16,'berkay arıkan','1243234561234123','12/35',123);
/*!40000 ALTER TABLE `payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_payments`
--

DROP TABLE IF EXISTS `salary_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary_payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `employee_id` bigint NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `salary_payments_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary_payments`
--

LOCK TABLES `salary_payments` WRITE;
/*!40000 ALTER TABLE `salary_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `salary_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `font_awesome_icon` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `feature_1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feature_2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feature_3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feature_4` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `working_hours` text COLLATE utf8mb4_general_ci,
  `favicon_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `youtube_link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instagram_link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `facebook_link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slider_settings`
--

DROP TABLE IF EXISTS `slider_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slider_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `display_order` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slider_settings`
--

LOCK TABLES `slider_settings` WRITE;
/*!40000 ALTER TABLE `slider_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `slider_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainer_clients`
--

DROP TABLE IF EXISTS `trainer_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainer_clients` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `trainer_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `remaining_sessions` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainer_id` (`trainer_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `trainer_clients_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `trainer_clients_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainer_clients`
--

LOCK TABLES `trainer_clients` WRITE;
/*!40000 ALTER TABLE `trainer_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `trainer_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainer_registration_requests`
--

DROP TABLE IF EXISTS `trainer_registration_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainer_registration_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `trainer_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `request_message` text COLLATE utf8mb4_general_ci,
  `requested_meeting_date` date NOT NULL,
  `requested_meeting_time` time NOT NULL,
  `is_modified_by_trainer` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `trainer_id` (`trainer_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `trainer_registration_requests_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `trainer_registration_requests_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainer_registration_requests`
--

LOCK TABLES `trainer_registration_requests` WRITE;
/*!40000 ALTER TABLE `trainer_registration_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `trainer_registration_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainer_sessions`
--

DROP TABLE IF EXISTS `trainer_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainer_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `trainer_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `session_date` date NOT NULL,
  `session_time` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainer_id` (`trainer_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `trainer_sessions_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `trainer_sessions_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainer_sessions`
--

LOCK TABLES `trainer_sessions` WRITE;
/*!40000 ALTER TABLE `trainer_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `trainer_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainer_settings`
--

DROP TABLE IF EXISTS `trainer_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainer_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `trainer_id` bigint NOT NULL,
  `bio` text COLLATE utf8mb4_general_ci,
  `specialization` text COLLATE utf8mb4_general_ci,
  `new_client_notifications` tinyint(1) DEFAULT '1',
  `progress_update_notifications` tinyint(1) DEFAULT '1',
  `mobile_notifications` tinyint(1) DEFAULT '1',
  `desktop_notifications` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `trainer_id` (`trainer_id`),
  CONSTRAINT `trainer_settings_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainer_settings`
--

LOCK TABLES `trainer_settings` WRITE;
/*!40000 ALTER TABLE `trainer_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `trainer_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `profile_photo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '/uploads/images/default-avatar.jpg',
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','User','	/uploads/images/default-avatar.jpg	','admin@gymflex.com',NULL,'ADMIN','2025-03-15 01:50:43','$2a$10$iZe2uBOqAzOxwqsNL80SIe90LOhfnGyhQ70Ht3tzjh4wIk5RTNr/S'),(2,'Member','User','	/uploads/images/default-avatar.jpg	','member@gymflex.com',NULL,'MEMBER','2025-03-15 01:50:43','$2a$10$cUtC6MRZ9DT8DoOtCb.C6uPZS5XRO8WcaRuZ3b/ihEIkW8j.2Wkgi'),(3,'Trainer','User','	/uploads/images/default-avatar.jpg	','trainer@gymflex.com',NULL,'TRAINER','2025-03-15 01:50:43','$2a$10$a7vrShLBpgQ35TdWGI7i4uGKmI5AEMgcQMdPgi5fk3zbQhAS/sjfu'),(13,'berkay','arıkan','	/uploads/images/default-avatar.jpg	','berkayyy5445@gmail.com','05397837419','MEMBER','2025-03-16 17:04:35','$2a$10$3DE8aEsYovh4i5x3osK3.eFYt725cCGRUZzTFfcTGA/hqQUr2RDhu'),(14,'berkay','arıkan','	/uploads/images/default-avatar.jpg	','berkay222@gmail.com','05397837419','MEMBER','2025-03-16 17:21:45','$2a$10$wHy72hXdOg6nxTrDyceFSezZm17bqSfxcMA3/Pr.Er.atZ9zbipqO'),(15,'berkay','arıkan','	/uploads/images/default-avatar.jpg	','berkay112233@gmail.com','05397837419','MEMBER','2025-03-16 17:24:37','$2a$10$LIWsqpC/CqIIfqDmnFJUpuZvGbyvPPlU8hklt2JofubVYFrMX2ts.'),(16,'berkay','arıkan','	/uploads/images/default-avatar.jpg	','berkay123123@gmail.com','05397837419','MEMBER','2025-03-16 17:26:01','$2a$10$/Z7JudNXYosrwAR7J2w9rOBR5xXJ7B/jOsh9Us7oyBJo85MTP79ou');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `why_choose_us`
--

DROP TABLE IF EXISTS `why_choose_us`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `why_choose_us` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `display_order` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `why_choose_us`
--

LOCK TABLES `why_choose_us` WRITE;
/*!40000 ALTER TABLE `why_choose_us` DISABLE KEYS */;
/*!40000 ALTER TABLE `why_choose_us` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout_categories`
--

DROP TABLE IF EXISTS `workout_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout_categories`
--

LOCK TABLES `workout_categories` WRITE;
/*!40000 ALTER TABLE `workout_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `workout_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout_exercises`
--

DROP TABLE IF EXISTS `workout_exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout_exercises` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `workout_id` bigint NOT NULL,
  `exercise_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `sets` int NOT NULL,
  `rep_range` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `workout_id` (`workout_id`),
  CONSTRAINT `workout_exercises_ibfk_1` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout_exercises`
--

LOCK TABLES `workout_exercises` WRITE;
/*!40000 ALTER TABLE `workout_exercises` DISABLE KEYS */;
/*!40000 ALTER TABLE `workout_exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout_levels`
--

DROP TABLE IF EXISTS `workout_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout_levels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout_levels`
--

LOCK TABLES `workout_levels` WRITE;
/*!40000 ALTER TABLE `workout_levels` DISABLE KEYS */;
/*!40000 ALTER TABLE `workout_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workouts`
--

DROP TABLE IF EXISTS `workouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workouts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `is_trainer` tinyint(1) NOT NULL,
  `level_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  `duration` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `level_id` (`level_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `workouts_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `workout_levels` (`id`),
  CONSTRAINT `workouts_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `workout_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workouts`
--

LOCK TABLES `workouts` WRITE;
/*!40000 ALTER TABLE `workouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `workouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'gym_flex'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-17  0:04:44
