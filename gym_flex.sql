-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 08 Nis 2025, 23:16:26
-- Sunucu sürümü: 8.0.40
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `gym_flex`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `club_visits`
--

CREATE TABLE `club_visits` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `check_in_date` date NOT NULL,
  `check_in_time` time NOT NULL,
  `check_out_date` date DEFAULT NULL,
  `check_out_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `club_visits`
--

INSERT INTO `club_visits` (`id`, `user_id`, `check_in_date`, `check_in_time`, `check_out_date`, `check_out_time`) VALUES
(1, 13, '2025-04-08', '23:43:22', '2025-04-08', '23:43:31'),
(2, 13, '2025-04-08', '23:47:00', '2025-04-08', '23:47:02'),
(3, 13, '2025-04-08', '23:47:09', '2025-04-08', '23:47:10'),
(4, 13, '2025-04-08', '23:47:57', '2025-04-08', '23:48:08'),
(5, 13, '2025-04-08', '23:54:39', '2025-04-08', '23:54:39'),
(6, 13, '2025-04-08', '23:56:15', '2025-04-08', '23:56:15'),
(7, 13, '2025-04-08', '23:59:37', '2025-04-08', '23:59:38'),
(8, 13, '2025-04-08', '23:59:40', '2025-04-08', '23:59:40');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `contact_requests`
--

CREATE TABLE `contact_requests` (
  `id` bigint NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `subject` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `submission_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `employee_info`
--

CREATE TABLE `employee_info` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `weekly_hours` int NOT NULL,
  `shift_schedule_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `group_workouts`
--

CREATE TABLE `group_workouts` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `capacity` int NOT NULL,
  `duration` int NOT NULL,
  `level_id` int DEFAULT NULL,
  `trainer_id` bigint DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `group_workouts`
--

INSERT INTO `group_workouts` (`id`, `name`, `description`, `capacity`, `duration`, `level_id`, `trainer_id`, `category_id`, `image_path`) VALUES
(1, 'Morning Yoga Flow', 'Start your day with a calming yoga session.', 21, 60, 1, 3, 1, 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(2, 'Power HIIT', 'High intensity interval training for fat burning.', 15, 45, 2, 3, 2, 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(3, 'Pilates Core Strength', 'Build core strength with Pilates basics.', 18, 50, 1, 3, 3, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(4, 'Evening Cardio Blast', 'Boost your energy with fast-paced cardio.', 25, 40, 2, 3, 4, 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(5, 'Strength Bootcamp', 'Full-body strength training for endurance.', 12, 60, 3, 3, 5, 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(6, 'Zumba Dance Party', 'Dance and burn calories to upbeat music.', 30, 55, 1, 3, 6, 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(7, 'Advanced Yoga Flow', 'Challenging yoga poses for experienced practitioners.', 10, 75, 3, 3, 1, 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(8, 'Beginner Cardio Kickstart', 'Light cardio for beginners to get moving.', 20, 35, 1, 3, 4, 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(9, 'deneme', 'deneme', 18, 123, 1, 3, 1, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(14, 'denemeasd', 'asdf', 12, 123, 3, 3, 5, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `group_workouts_ratings`
--

CREATE TABLE `group_workouts_ratings` (
  `id` int NOT NULL,
  `member_id` bigint NOT NULL,
  `session_id` int NOT NULL,
  `rating` tinyint DEFAULT NULL,
  `comment` text COLLATE utf8mb4_general_ci
) ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `group_workout_categories`
--

CREATE TABLE `group_workout_categories` (
  `id` int NOT NULL,
  `category_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `group_workout_categories`
--

INSERT INTO `group_workout_categories` (`id`, `category_name`, `description`) VALUES
(1, 'Yoga', NULL),
(2, 'HIIT', NULL),
(3, 'Pilates', NULL),
(4, 'Cardio', NULL),
(5, 'Strength Training', NULL),
(6, 'Dance Fitness', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `group_workout_enrolls`
--

CREATE TABLE `group_workout_enrolls` (
  `id` int NOT NULL,
  `session_id` int DEFAULT NULL,
  `member_id` bigint DEFAULT NULL,
  `enrollment_date` datetime(6) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `group_workout_enrolls`
--

INSERT INTO `group_workout_enrolls` (`id`, `session_id`, `member_id`, `enrollment_date`, `status`) VALUES
(1, 1, 13, NULL, NULL),
(2, 2, 13, NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `group_workout_levels`
--

CREATE TABLE `group_workout_levels` (
  `id` int NOT NULL,
  `level_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `group_workout_levels`
--

INSERT INTO `group_workout_levels` (`id`, `level_name`, `description`) VALUES
(1, 'Beginner', NULL),
(2, 'Intermediate', NULL),
(3, 'Advanced', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `group_workout_sessions`
--

CREATE TABLE `group_workout_sessions` (
  `id` int NOT NULL,
  `group_workout_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `group_workout_sessions`
--

INSERT INTO `group_workout_sessions` (`id`, `group_workout_id`, `date`, `time`, `notes`) VALUES
(1, 1, '2025-04-23', '13:28:40', NULL),
(2, 1, '2025-04-25', '15:29:33', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `market_categories`
--

CREATE TABLE `market_categories` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `market_categories`
--

INSERT INTO `market_categories` (`id`, `name`) VALUES
(1, 'Supplement'),
(2, 'Equipment'),
(3, 'Clothing'),
(4, 'Accessories');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `market_products`
--

CREATE TABLE `market_products` (
  `id` bigint NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `category_id` bigint NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `market_products`
--

INSERT INTO `market_products` (`id`, `image_path`, `product_name`, `category_id`, `price`, `stock`, `description`) VALUES
(1, '/protein.png', 'Whey Protein Powder', 1, 599.99, 41, 'High-quality whey protein powder for muscle recovery - 2000g'),
(2, '/bcaa.png', 'BCAA Amino Acids', 1, 299.99, 60, 'Essential amino acids for muscle growth and recovery - 400g'),
(3, '/preworkout.png', 'Pre-Workout Energy', 1, 349.99, 38, 'Advanced pre-workout formula for maximum performance - 300g'),
(4, '/yoga-mat.png', 'Premium Yoga Mat', 2, 199.99, 25, 'Non-slip, eco-friendly yoga mat with alignment lines'),
(5, '/dumbbells.png', 'Adjustable Dumbbell Set', 2, 1499.99, 12, 'Space-saving adjustable dumbbells 2-24kg each'),
(6, '/bands.png', 'Resistance Bands Set', 2, 249.99, 30, 'Set of 5 resistance bands with different strength levels'),
(7, '/tshirt.png', 'Performance T-Shirt', 3, 149.99, 85, 'Moisture-wicking, breathable training t-shirt'),
(8, '/shorts.png', 'Training Shorts', 3, 179.99, 70, 'Flexible, quick-dry training shorts with pockets'),
(9, '/leggings.png', 'Compression Leggings', 3, 229.99, 55, 'High-waist compression leggings with phone pocket'),
(10, '/bottle.png', 'Sports Water Bottle', 4, 89.99, 120, 'BPA-free sports water bottle with time markings - 1L'),
(11, '/gym-bag.png', 'Gym Bag', 4, 259.99, 40, 'Spacious gym bag with wet compartment and shoe pocket'),
(12, '/gloves.png', 'Lifting Gloves', 4, 129.99, 65, 'Premium weightlifting gloves with wrist support'),
(20, '/uploads/images/15cec89f-7031-418c-995a-b44a188af64a.png', 'deneme', 2, 111.00, 10, '..');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `market_product_sales`
--

CREATE TABLE `market_product_sales` (
  `id` bigint NOT NULL,
  `invoice_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `market_product_sales`
--

INSERT INTO `market_product_sales` (`id`, `invoice_id`, `product_id`, `quantity`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 1, 1),
(4, 4, 20, 1),
(5, 5, 1, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `market_purchases`
--

CREATE TABLE `market_purchases` (
  `id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `total_paid` decimal(10,2) NOT NULL,
  `purchase_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `market_sales_invoices`
--

CREATE TABLE `market_sales_invoices` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `total_items` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `sale_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `market_sales_invoices`
--

INSERT INTO `market_sales_invoices` (`id`, `user_id`, `total_items`, `total_price`, `sale_date`) VALUES
(1, 2, 1, 509.99, '2025-03-16 21:57:11'),
(2, 16, 1, 509.99, '2025-03-16 22:53:19'),
(3, 13, 1, 539.99, '2025-04-05 20:22:06'),
(4, 13, 1, 99.90, '2025-04-05 20:22:42'),
(5, 13, 1, 539.99, '2025-04-08 19:05:35');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `memberships`
--

CREATE TABLE `memberships` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `plan_id` bigint NOT NULL,
  `discount_amount` decimal(38,2) DEFAULT NULL,
  `paid_amount` decimal(38,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_frozen` tinyint(1) DEFAULT '0',
  `freeze_start_date` date DEFAULT NULL,
  `freeze_end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `memberships`
--

INSERT INTO `memberships` (`id`, `user_id`, `plan_id`, `discount_amount`, `paid_amount`, `start_date`, `end_date`, `is_frozen`, `freeze_start_date`, `freeze_end_date`) VALUES
(9, 13, 2, 5148.00, 27352.00, '2025-03-16', '2027-04-16', 0, NULL, NULL),
(10, 14, 3, 2400.00, 9600.00, '2025-03-16', '2025-09-16', 0, NULL, NULL),
(11, 15, 3, 2400.00, 9600.00, '2025-03-16', '2025-09-16', 0, NULL, NULL),
(12, 16, 3, 2400.00, 9600.00, '2025-03-16', '2025-09-16', 0, NULL, NULL),
(13, 27, 1, 240.00, 2160.00, '2025-04-08', '2025-07-08', 0, NULL, NULL),
(14, 55, 1, 0.00, 800.00, '2025-04-08', '2025-05-08', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `membership_plans`
--

CREATE TABLE `membership_plans` (
  `id` bigint NOT NULL,
  `plan_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `plan_price` decimal(38,2) NOT NULL,
  `guest_pass_count` int NOT NULL,
  `monthly_pt_sessions` int NOT NULL,
  `group_class_count` int NOT NULL,
  `market_discount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `membership_plans`
--

INSERT INTO `membership_plans` (`id`, `plan_name`, `plan_price`, `guest_pass_count`, `monthly_pt_sessions`, `group_class_count`, `market_discount`) VALUES
(1, 'Basic Plan', 800.00, 2, 0, 0, 0),
(2, 'Premium Plan', 1300.00, 4, 1, -1, 10),
(3, 'Elite Plan', 2000.00, -1, 2, -1, 15);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `member_training_plans`
--

CREATE TABLE `member_training_plans` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `workout_id` bigint NOT NULL,
  `day_of_week` int NOT NULL
) ;

--
-- Tablo döküm verisi `member_training_plans`
--

INSERT INTO `member_training_plans` (`id`, `user_id`, `workout_id`, `day_of_week`) VALUES
(1, 13, 1, 1),
(10, 13, 6, 2),
(11, 13, 6, 3),
(12, 13, 1, 4),
(13, 13, 6, 5),
(14, 13, 6, 6),
(16, 13, 2, 7);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `payment_method`
--

CREATE TABLE `payment_method` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `card_holder_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `card_number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `expiry_date` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cvv` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `payment_method`
--

INSERT INTO `payment_method` (`id`, `user_id`, `card_holder_name`, `card_number`, `expiry_date`, `cvv`) VALUES
(1, 15, 'berkay arıkan', '4623', '12/25', 123),
(2, 16, 'berkay arıkan', '1243234561234123', '12/35', 123),
(3, 27, 'berkay arıkan', '1234567891234123', '11/28', 123),
(4, 55, 'berkay arıkan', '1243576124134124', '11/25', 123);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `personal_training_ratings`
--

CREATE TABLE `personal_training_ratings` (
  `id` int NOT NULL,
  `member_id` bigint NOT NULL,
  `session_id` bigint NOT NULL,
  `rating` tinyint DEFAULT NULL,
  `comment` text COLLATE utf8mb4_general_ci
) ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `salary_payments`
--

CREATE TABLE `salary_payments` (
  `id` bigint NOT NULL,
  `employee_id` bigint NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `services`
--

CREATE TABLE `services` (
  `id` bigint NOT NULL,
  `font_awesome_icon` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `feature_1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feature_2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feature_3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feature_4` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `working_hours` text COLLATE utf8mb4_general_ci,
  `favicon_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `youtube_link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instagram_link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `facebook_link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `slider_settings`
--

CREATE TABLE `slider_settings` (
  `id` bigint NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `display_order` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `trainer_clients`
--

CREATE TABLE `trainer_clients` (
  `id` bigint NOT NULL,
  `trainer_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `remaining_sessions` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `trainer_clients`
--

INSERT INTO `trainer_clients` (`id`, `trainer_id`, `client_id`, `registration_date`, `remaining_sessions`) VALUES
(1, 3, 2, '2025-03-15 21:10:10', 8),
(3, 3, 13, '2025-04-06 20:24:56', 10);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `trainer_registration_requests`
--

CREATE TABLE `trainer_registration_requests` (
  `id` bigint NOT NULL,
  `trainer_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `request_message` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `requested_meeting_date` date NOT NULL,
  `requested_meeting_time` time NOT NULL,
  `is_modified_by_trainer` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `trainer_registration_requests`
--

INSERT INTO `trainer_registration_requests` (`id`, `trainer_id`, `client_id`, `request_message`, `requested_meeting_date`, `requested_meeting_time`, `is_modified_by_trainer`) VALUES
(4, 3, 13, 'I\'d like to book a training session', '2025-04-09', '09:07:00', 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `trainer_sessions`
--

CREATE TABLE `trainer_sessions` (
  `id` bigint NOT NULL,
  `trainer_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `session_date` date NOT NULL,
  `session_time` time NOT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `session_type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `trainer_sessions`
--

INSERT INTO `trainer_sessions` (`id`, `trainer_id`, `client_id`, `session_date`, `session_time`, `notes`, `session_type`) VALUES
(1, 3, 2, '2025-03-25', '09:00:00', 'Focus on upper body strength', 'Personal Training'),
(2, 3, 2, '2025-03-26', '15:30:00', 'Beginner level', 'Yoga Session'),
(3, 3, 2, '2025-04-01', '11:00:00', 'Focus on leg day', 'Strength Training'),
(4, 3, 13, '2025-04-14', '11:27:00', 'Automatically created from registration request #3', 'Initial Consultation');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `trainer_settings`
--

CREATE TABLE `trainer_settings` (
  `id` bigint NOT NULL,
  `trainer_id` bigint NOT NULL,
  `bio` text COLLATE utf8mb4_general_ci,
  `specialization` text COLLATE utf8mb4_general_ci,
  `new_client_notifications` tinyint(1) DEFAULT '1',
  `progress_update_notifications` tinyint(1) DEFAULT '1',
  `mobile_notifications` tinyint(1) DEFAULT '1',
  `desktop_notifications` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `trainer_settings`
--

INSERT INTO `trainer_settings` (`id`, `trainer_id`, `bio`, `specialization`, `new_client_notifications`, `progress_update_notifications`, `mobile_notifications`, `desktop_notifications`) VALUES
(1, 3, 'Professional trainer with 5 years of experience in strength training and fitness coaching.', 'Strength Training, Weight Loss, Nutrition', 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `profile_photo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '/uploads/images/default-avatar.jpg',
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `profile_photo_path`, `email`, `phone_number`, `role`, `registration_date`, `password`) VALUES
(1, 'Admin', 'User', '	/uploads/images/default-avatar.jpg	', 'admin@gymflex.com', NULL, 'ADMIN', '2025-03-15 01:50:43', '$2a$10$iZe2uBOqAzOxwqsNL80SIe90LOhfnGyhQ70Ht3tzjh4wIk5RTNr/S'),
(2, 'Member', 'User', '	/uploads/images/default-avatar.jpg	', 'member@gymflex.com', NULL, 'MEMBER', '2025-03-15 01:50:43', '$2a$10$cUtC6MRZ9DT8DoOtCb.C6uPZS5XRO8WcaRuZ3b/ihEIkW8j.2Wkgi'),
(3, 'Trainer', 'User', '	/uploads/images/default-avatar.jpg	', 'trainer@gymflex.com', NULL, 'TRAINER', '2025-03-15 01:50:43', '$2a$10$a7vrShLBpgQ35TdWGI7i4uGKmI5AEMgcQMdPgi5fk3zbQhAS/sjfu'),
(13, 'berkay', 'arıkan', '	/uploads/images/default-avatar.jpg	', 'berkayyy5445@gmail.com', '05397837419', 'MEMBER', '2025-03-16 17:04:35', '$2a$10$3DE8aEsYovh4i5x3osK3.eFYt725cCGRUZzTFfcTGA/hqQUr2RDhu'),
(14, 'berkay', 'arıkan', '	/uploads/images/default-avatar.jpg	', 'berkay222@gmail.com', '05397837419', 'MEMBER', '2025-03-16 17:21:45', '$2a$10$wHy72hXdOg6nxTrDyceFSezZm17bqSfxcMA3/Pr.Er.atZ9zbipqO'),
(15, 'berkay', 'arıkan', '	/uploads/images/default-avatar.jpg	', 'berkay112233@gmail.com', '05397837419', 'MEMBER', '2025-03-16 17:24:37', '$2a$10$LIWsqpC/CqIIfqDmnFJUpuZvGbyvPPlU8hklt2JofubVYFrMX2ts.'),
(16, 'berkay', 'arıkan', '	/uploads/images/default-avatar.jpg	', 'berkay123123@gmail.com', '05397837419', 'MEMBER', '2025-03-16 17:26:01', '$2a$10$/Z7JudNXYosrwAR7J2w9rOBR5xXJ7B/jOsh9Us7oyBJo85MTP79ou'),
(27, 'berkay', 'arıkan', '/uploads/images/default-avatar.jpg', 'deneme@gmail.com', '05397837419', 'MEMBER', '2025-04-08 12:08:41', '$2a$10$fnhRBNHd9FkiEXs33JFvDOo9YWhwQrmEQXWjUnJy7PuB5C.1cSGg.'),
(55, 'deneme', 'deneme', '/uploads/images/default-avatar.jpg', 'denem123e@gmail.com', '05397837419', 'MEMBER', '2025-04-08 12:40:32', '$2a$10$BQmZZu5DAWhah8V5SGRucu18cwutvdbJYs8Rwtl3vQxnFQ5G3iD5i');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `why_choose_us`
--

CREATE TABLE `why_choose_us` (
  `id` bigint NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `display_order` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `workouts`
--

CREATE TABLE `workouts` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `is_trainer` tinyint(1) NOT NULL,
  `level_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  `duration` int NOT NULL,
  `calories` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `equipment` text COLLATE utf8mb4_general_ci,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `target_muscles` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `workouts`
--

INSERT INTO `workouts` (`id`, `user_id`, `is_trainer`, `level_id`, `category_id`, `duration`, `calories`, `description`, `equipment`, `name`, `target_muscles`) VALUES
(1, 3, 1, 1, 1, 60, 450, 'Complete full body workout focusing on major muscle groups', 'Dumbbells,Barbell,Resistance Bands', 'Full Body Strength', 'Chest,Back,Legs,Shoulders'),
(2, 3, 1, 3, 2, 45, 600, 'High-intensity interval training for maximum calorie burn', 'Kettlebell,Jump Rope,Yoga Mat', 'HIIT Cardio Blast', 'Core,Legs,Shoulders'),
(6, 13, 0, 2, 3, 45, 350, 'asdfg', 'Dumbbells', 'deneme', 'Chest');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `workout_categories`
--

CREATE TABLE `workout_categories` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `workout_categories`
--

INSERT INTO `workout_categories` (`id`, `name`) VALUES
(1, 'Strength Training'),
(2, 'Cardio'),
(3, 'HIIT'),
(4, 'Flexibility'),
(5, 'CrossFit');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `workout_exercises`
--

CREATE TABLE `workout_exercises` (
  `id` bigint NOT NULL,
  `workout_id` bigint NOT NULL,
  `exercise_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sets` int NOT NULL,
  `rep_range` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `workout_exercises`
--

INSERT INTO `workout_exercises` (`id`, `workout_id`, `exercise_name`, `sets`, `rep_range`) VALUES
(139, 6, 'Bench Press', 3, '8-12'),
(140, 6, 'deneme', 3, '8-12'),
(148, 2, 'Burpees', 5, '45 seconds'),
(149, 2, 'Mountain Climbers', 5, '45 seconds'),
(150, 2, 'Jump Rope', 5, '60 seconds'),
(154, 1, 'Barbell Squat', 4, '8-12 reps'),
(155, 1, 'Bench Press', 4, '8-12 reps'),
(156, 1, 'Deadlift', 3, '8-10 reps');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `workout_levels`
--

CREATE TABLE `workout_levels` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `workout_levels`
--

INSERT INTO `workout_levels` (`id`, `name`) VALUES
(1, 'Beginner'),
(2, 'Intermediate'),
(3, 'Advanced');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `club_visits`
--
ALTER TABLE `club_visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `contact_requests`
--
ALTER TABLE `contact_requests`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `employee_info`
--
ALTER TABLE `employee_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `group_workouts`
--
ALTER TABLE `group_workouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `level_id` (`level_id`),
  ADD KEY `trainer_id` (`trainer_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Tablo için indeksler `group_workouts_ratings`
--
ALTER TABLE `group_workouts_ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Tablo için indeksler `group_workout_categories`
--
ALTER TABLE `group_workout_categories`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `group_workout_enrolls`
--
ALTER TABLE `group_workout_enrolls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Tablo için indeksler `group_workout_levels`
--
ALTER TABLE `group_workout_levels`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `group_workout_sessions`
--
ALTER TABLE `group_workout_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_workout_id` (`group_workout_id`);

--
-- Tablo için indeksler `market_categories`
--
ALTER TABLE `market_categories`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `market_products`
--
ALTER TABLE `market_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Tablo için indeksler `market_product_sales`
--
ALTER TABLE `market_product_sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Tablo için indeksler `market_purchases`
--
ALTER TABLE `market_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Tablo için indeksler `market_sales_invoices`
--
ALTER TABLE `market_sales_invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `memberships`
--
ALTER TABLE `memberships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Tablo için indeksler `membership_plans`
--
ALTER TABLE `membership_plans`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `member_training_plans`
--
ALTER TABLE `member_training_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `workout_id` (`workout_id`);

--
-- Tablo için indeksler `payment_method`
--
ALTER TABLE `payment_method`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_payment_method` (`user_id`);

--
-- Tablo için indeksler `personal_training_ratings`
--
ALTER TABLE `personal_training_ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Tablo için indeksler `salary_payments`
--
ALTER TABLE `salary_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Tablo için indeksler `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `slider_settings`
--
ALTER TABLE `slider_settings`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `trainer_clients`
--
ALTER TABLE `trainer_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainer_id` (`trainer_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Tablo için indeksler `trainer_registration_requests`
--
ALTER TABLE `trainer_registration_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainer_id` (`trainer_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Tablo için indeksler `trainer_sessions`
--
ALTER TABLE `trainer_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainer_id` (`trainer_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Tablo için indeksler `trainer_settings`
--
ALTER TABLE `trainer_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainer_id` (`trainer_id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Tablo için indeksler `why_choose_us`
--
ALTER TABLE `why_choose_us`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `workouts`
--
ALTER TABLE `workouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `level_id` (`level_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Tablo için indeksler `workout_categories`
--
ALTER TABLE `workout_categories`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `workout_exercises`
--
ALTER TABLE `workout_exercises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workout_id` (`workout_id`);

--
-- Tablo için indeksler `workout_levels`
--
ALTER TABLE `workout_levels`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `club_visits`
--
ALTER TABLE `club_visits`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `contact_requests`
--
ALTER TABLE `contact_requests`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `employee_info`
--
ALTER TABLE `employee_info`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `group_workouts`
--
ALTER TABLE `group_workouts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `group_workouts_ratings`
--
ALTER TABLE `group_workouts_ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `group_workout_categories`
--
ALTER TABLE `group_workout_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `group_workout_enrolls`
--
ALTER TABLE `group_workout_enrolls`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `group_workout_levels`
--
ALTER TABLE `group_workout_levels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `group_workout_sessions`
--
ALTER TABLE `group_workout_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `market_categories`
--
ALTER TABLE `market_categories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `market_products`
--
ALTER TABLE `market_products`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Tablo için AUTO_INCREMENT değeri `market_product_sales`
--
ALTER TABLE `market_product_sales`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `market_purchases`
--
ALTER TABLE `market_purchases`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `market_sales_invoices`
--
ALTER TABLE `market_sales_invoices`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `memberships`
--
ALTER TABLE `memberships`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `membership_plans`
--
ALTER TABLE `membership_plans`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `member_training_plans`
--
ALTER TABLE `member_training_plans`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `payment_method`
--
ALTER TABLE `payment_method`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `personal_training_ratings`
--
ALTER TABLE `personal_training_ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `salary_payments`
--
ALTER TABLE `salary_payments`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `slider_settings`
--
ALTER TABLE `slider_settings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_clients`
--
ALTER TABLE `trainer_clients`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_registration_requests`
--
ALTER TABLE `trainer_registration_requests`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_sessions`
--
ALTER TABLE `trainer_sessions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_settings`
--
ALTER TABLE `trainer_settings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Tablo için AUTO_INCREMENT değeri `why_choose_us`
--
ALTER TABLE `why_choose_us`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `workouts`
--
ALTER TABLE `workouts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `workout_categories`
--
ALTER TABLE `workout_categories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `workout_exercises`
--
ALTER TABLE `workout_exercises`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- Tablo için AUTO_INCREMENT değeri `workout_levels`
--
ALTER TABLE `workout_levels`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `club_visits`
--
ALTER TABLE `club_visits`
  ADD CONSTRAINT `club_visits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `employee_info`
--
ALTER TABLE `employee_info`
  ADD CONSTRAINT `employee_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `group_workouts`
--
ALTER TABLE `group_workouts`
  ADD CONSTRAINT `group_workouts_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `group_workout_levels` (`id`),
  ADD CONSTRAINT `group_workouts_ibfk_2` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `group_workouts_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `group_workout_categories` (`id`);

--
-- Tablo kısıtlamaları `group_workouts_ratings`
--
ALTER TABLE `group_workouts_ratings`
  ADD CONSTRAINT `group_workouts_ratings_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `group_workouts_ratings_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `group_workout_sessions` (`id`);

--
-- Tablo kısıtlamaları `group_workout_enrolls`
--
ALTER TABLE `group_workout_enrolls`
  ADD CONSTRAINT `group_workout_enrolls_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `group_workout_sessions` (`id`),
  ADD CONSTRAINT `group_workout_enrolls_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `group_workout_sessions`
--
ALTER TABLE `group_workout_sessions`
  ADD CONSTRAINT `group_workout_sessions_ibfk_1` FOREIGN KEY (`group_workout_id`) REFERENCES `group_workouts` (`id`);

--
-- Tablo kısıtlamaları `market_products`
--
ALTER TABLE `market_products`
  ADD CONSTRAINT `market_products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `market_categories` (`id`);

--
-- Tablo kısıtlamaları `market_product_sales`
--
ALTER TABLE `market_product_sales`
  ADD CONSTRAINT `market_product_sales_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `market_sales_invoices` (`id`),
  ADD CONSTRAINT `market_product_sales_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `market_products` (`id`);

--
-- Tablo kısıtlamaları `market_purchases`
--
ALTER TABLE `market_purchases`
  ADD CONSTRAINT `market_purchases_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `market_products` (`id`);

--
-- Tablo kısıtlamaları `market_sales_invoices`
--
ALTER TABLE `market_sales_invoices`
  ADD CONSTRAINT `market_sales_invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `memberships`
--
ALTER TABLE `memberships`
  ADD CONSTRAINT `memberships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `memberships_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `membership_plans` (`id`);

--
-- Tablo kısıtlamaları `member_training_plans`
--
ALTER TABLE `member_training_plans`
  ADD CONSTRAINT `member_training_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `member_training_plans_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`);

--
-- Tablo kısıtlamaları `payment_method`
--
ALTER TABLE `payment_method`
  ADD CONSTRAINT `user_id_payment_method` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `personal_training_ratings`
--
ALTER TABLE `personal_training_ratings`
  ADD CONSTRAINT `personal_training_ratings_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `personal_training_ratings_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `trainer_sessions` (`id`);

--
-- Tablo kısıtlamaları `salary_payments`
--
ALTER TABLE `salary_payments`
  ADD CONSTRAINT `salary_payments_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee_info` (`id`);

--
-- Tablo kısıtlamaları `trainer_clients`
--
ALTER TABLE `trainer_clients`
  ADD CONSTRAINT `trainer_clients_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trainer_clients_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `trainer_registration_requests`
--
ALTER TABLE `trainer_registration_requests`
  ADD CONSTRAINT `trainer_registration_requests_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trainer_registration_requests_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `trainer_sessions`
--
ALTER TABLE `trainer_sessions`
  ADD CONSTRAINT `trainer_sessions_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trainer_sessions_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `trainer_settings`
--
ALTER TABLE `trainer_settings`
  ADD CONSTRAINT `trainer_settings_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `workouts`
--
ALTER TABLE `workouts`
  ADD CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `workouts_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `workout_levels` (`id`),
  ADD CONSTRAINT `workouts_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `workout_categories` (`id`);

--
-- Tablo kısıtlamaları `workout_exercises`
--
ALTER TABLE `workout_exercises`
  ADD CONSTRAINT `workout_exercises_ibfk_1` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
