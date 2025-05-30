-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 30 Nis 2025, 19:16:45
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
-- Tablo için tablo yapısı `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int NOT NULL,
  `sender_id` bigint NOT NULL,
  `receiver_id` bigint NOT NULL,
  `chat_message` text COLLATE utf8mb4_general_ci NOT NULL,
  `replied_to` int DEFAULT NULL,
  `sent_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `is_read` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `sender_id`, `receiver_id`, `chat_message`, `replied_to`, `sent_at`, `isRead`, `is_read`) VALUES
(1, 13, 2, 'deneme', NULL, '2025-04-30 13:15:17', 0, 1),
(2, 13, 2, 'deneme', 1, '2025-04-30 13:17:12', 0, 1),
(3, 2, 13, 'deneme', NULL, '2025-04-30 13:22:54', 0, 1),
(4, 13, 2, 'deneme', NULL, '2025-04-30 13:25:43', 0, 1),
(5, 2, 13, 'deneme', NULL, '2025-04-30 13:39:17', 0, 1),
(6, 2, 13, 'deneme123', NULL, '2025-04-30 13:51:34', 0, 1);

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
(8, 13, '2025-04-08', '23:59:40', '2025-04-08', '23:59:40'),
(9, 13, '2025-04-09', '13:34:41', '2025-04-09', '13:34:41'),
(10, 13, '2025-04-09', '13:34:46', '2025-04-09', '13:34:46'),
(11, 13, '2025-04-10', '23:15:25', '2025-04-10', '23:15:26'),
(12, 13, '2025-04-11', '21:32:29', '2025-04-11', '21:32:31'),
(13, 13, '2025-04-14', '10:30:51', '2025-04-14', '10:30:52'),
(14, 13, '2025-04-14', '11:03:34', '2025-04-14', '11:03:35');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `contact_forms`
--

CREATE TABLE `contact_forms` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_general_ci,
  `is_read` tinyint(1) DEFAULT '0',
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `contact_forms`
--

INSERT INTO `contact_forms` (`id`, `name`, `email`, `subject`, `message`, `is_read`, `date_created`) VALUES
(3, 'deneme', 'deneme@gmail.com', 'deneme', 'deneme', 1, '2025-04-10 20:50:06'),
(4, 'berkay', 'berkay@gmail.com', 'message', 'message', 1, '2025-04-11 21:28:51');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `exercise_progress`
--

CREATE TABLE `exercise_progress` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `exercise_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `entry_date` date NOT NULL,
  `weight` double DEFAULT NULL,
  `reps` int DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `distance` double DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `entered_by` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `exercise_progress`
--

INSERT INTO `exercise_progress` (`id`, `user_id`, `exercise_name`, `entry_date`, `weight`, `reps`, `duration`, `distance`, `notes`, `entered_by`) VALUES
(5, 13, 'bench', '2025-04-28', 135, 3, NULL, NULL, 'deneme', 3),
(6, 2, 'deneme', '2025-04-28', 135, 2, NULL, NULL, 'asd', 3),
(7, 13, 'bench', '2025-04-28', 140, 2, NULL, NULL, '', 13);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `exercise_progress_goals`
--

CREATE TABLE `exercise_progress_goals` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `exercise_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `set_by` bigint NOT NULL,
  `goal_date` date NOT NULL,
  `target_weight` double DEFAULT NULL,
  `target_reps` int DEFAULT NULL,
  `target_duration` int DEFAULT NULL,
  `target_distance` double DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `achieved` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `exercise_progress_goals`
--

INSERT INTO `exercise_progress_goals` (`id`, `user_id`, `exercise_name`, `set_by`, `goal_date`, `target_weight`, `target_reps`, `target_duration`, `target_distance`, `notes`, `achieved`) VALUES
(4, 13, 'bench', 3, '2025-04-28', 150, 2, NULL, NULL, 'deneme\n', NULL),
(5, 2, 'deneme', 3, '2025-04-28', 150, 3, NULL, NULL, 'asd\n', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `expenses`
--

CREATE TABLE `expenses` (
  `id` int NOT NULL,
  `expenses_category_id` int NOT NULL,
  `amount` decimal(38,2) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `expenses`
--

INSERT INTO `expenses` (`id`, `expenses_category_id`, `amount`, `date`) VALUES
(2, 4, 12345.00, '2025-04-07'),
(5, 4, 33120.60, '2025-04-10');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `expenses_categories`
--

CREATE TABLE `expenses_categories` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `expenses_categories`
--

INSERT INTO `expenses_categories` (`id`, `name`) VALUES
(1, 'Market Purchases'),
(2, 'Utilities'),
(3, 'Equipment Maintenance'),
(4, 'Staff Salaries');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `forum_likes`
--

CREATE TABLE `forum_likes` (
  `id` int NOT NULL,
  `post_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `forum_likes`
--

INSERT INTO `forum_likes` (`id`, `post_id`, `user_id`, `created_at`) VALUES
(2, 8, 13, '2025-04-29 14:46:25'),
(3, 9, 2, '2025-04-30 13:30:06'),
(32, 8, 14, '2025-04-30 19:22:58');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `forum_posts`
--

CREATE TABLE `forum_posts` (
  `id` int NOT NULL,
  `thread_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `quoted_post_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `forum_posts`
--

INSERT INTO `forum_posts` (`id`, `thread_id`, `user_id`, `content`, `quoted_post_id`, `created_at`) VALUES
(3, 2, 13, 'deneme', NULL, '2025-04-29 14:38:54'),
(8, 1, 13, 'deneme3', NULL, '2025-04-29 14:42:41'),
(9, 1, 13, 'deneme4', 8, '2025-04-29 14:46:23'),
(10, 1, 14, 'deneme5', 9, '2025-04-30 19:26:29');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `forum_threads`
--

CREATE TABLE `forum_threads` (
  `id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `forum_threads`
--

INSERT INTO `forum_threads` (`id`, `user_id`, `title`, `description`, `created_at`) VALUES
(1, 13, 'deneme', 'deneme', '2025-04-29 14:26:11'),
(2, 13, 'deneme1', 'deneme2', '2025-04-29 14:32:22');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `free_pt_use`
--

CREATE TABLE `free_pt_use` (
  `id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `session_id` bigint DEFAULT NULL,
  `session_request_id` int DEFAULT NULL,
  `use_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `free_pt_use`
--

INSERT INTO `free_pt_use` (`id`, `member_id`, `session_id`, `session_request_id`, `use_time`) VALUES
(4, 13, NULL, 8, '2025-04-30 19:03:03');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `friends`
--

CREATE TABLE `friends` (
  `id` bigint NOT NULL,
  `user1_id` bigint NOT NULL,
  `user2_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `friend_requests`
--

CREATE TABLE `friend_requests` (
  `id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `receiver_id` bigint NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `friend_requests`
--

INSERT INTO `friend_requests` (`id`, `sender_id`, `receiver_id`, `date`) VALUES
(11, 13, 65, '2025-04-29 19:18:24');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `general_prices`
--

CREATE TABLE `general_prices` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `general_prices`
--

INSERT INTO `general_prices` (`id`, `name`, `price`) VALUES
(1, 'personal training', 201.00),
(2, 'group classes', 20.00);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `group_classes_sale`
--

CREATE TABLE `group_classes_sale` (
  `id` int NOT NULL,
  `enrollment_id` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `sale_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `group_classes_sale`
--

INSERT INTO `group_classes_sale` (`id`, `enrollment_id`, `price`, `sale_date`) VALUES
(2, 5, 20.00, '2025-04-10');

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
(23, 'deneme', '', 12, 123, 1, 3, 1, '/uploads/images/ebc8427b-9bc2-4915-bee3-55fc59fd5897.png');

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
(2, 2, 13, NULL, NULL),
(5, 2, 55, NULL, NULL);

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
(1, '/protein.png', 'Whey Protein Powder', 1, 599.99, 36, 'High-quality whey protein powder for muscle recovery - 2000g'),
(2, '/bcaa.png', 'BCAA Amino Acids', 1, 299.99, 52, 'Essential amino acids for muscle growth and recovery - 400g'),
(3, '/preworkout.png', 'Pre-Workout Energy', 1, 349.99, 36, 'Advanced pre-workout formula for maximum performance - 300g'),
(4, '/yoga-mat.png', 'Premium Yoga Mat', 2, 199.99, 25, 'Non-slip, eco-friendly yoga mat with alignment lines'),
(5, '/dumbbells.png', 'Adjustable Dumbbell Set', 2, 1499.99, 12, 'Space-saving adjustable dumbbells 2-24kg each'),
(6, '/bands.png', 'Resistance Bands Set', 2, 249.99, 30, 'Set of 5 resistance bands with different strength levels'),
(7, '/tshirt.png', 'Performance T-Shirt', 3, 149.99, 85, 'Moisture-wicking, breathable training t-shirt'),
(8, '/shorts.png', 'Training Shorts', 3, 179.99, 70, 'Flexible, quick-dry training shorts with pockets'),
(9, '/leggings.png', 'Compression Leggings', 3, 229.99, 55, 'High-waist compression leggings with phone pocket'),
(10, '/bottle.png', 'Sports Water Bottle', 4, 89.99, 120, 'BPA-free sports water bottle with time markings - 1L'),
(11, '/gym-bag.png', 'Gym Bag', 4, 259.99, 40, 'Spacious gym bag with wet compartment and shoe pocket'),
(12, '/gloves.png', 'Lifting Gloves', 4, 129.99, 65, 'Premium weightlifting gloves with wrist support'),
(20, '/uploads/images/c3b03e2c-fddc-45b4-844c-94bfbdc780cb.png', 'deneme', 2, 111.00, 0, '..');

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
(5, 5, 1, 1),
(6, 6, 1, 1),
(7, 7, 2, 1),
(8, 7, 3, 1),
(9, 8, 2, 1),
(10, 8, 1, 1),
(11, 9, 1, 1),
(12, 9, 2, 1),
(13, 10, 1, 1),
(14, 10, 2, 1),
(15, 11, 2, 3),
(16, 13, 1, 1),
(17, 13, 2, 1),
(18, 13, 3, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `market_sales_invoices`
--

CREATE TABLE `market_sales_invoices` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `total_items` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `sale_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `order_no` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `market_sales_invoices`
--

INSERT INTO `market_sales_invoices` (`id`, `user_id`, `total_items`, `total_price`, `sale_date`, `order_no`) VALUES
(1, 2, 1, 509.99, '2025-03-16 21:57:11', ''),
(2, 16, 1, 509.99, '2025-03-16 22:53:19', ''),
(3, 13, 1, 539.99, '2025-04-05 20:22:06', ''),
(4, 13, 1, 99.90, '2025-04-05 20:22:42', ''),
(5, 13, 1, 539.99, '2025-04-08 19:05:35', ''),
(6, 13, 1, 539.99, '2025-04-10 09:44:17', ''),
(7, 13, 2, 584.98, '2025-04-10 09:46:43', ''),
(8, 13, 2, 809.98, '2025-04-10 09:55:37', 'GYM-20250410-0001'),
(9, 13, 2, 809.98, '2025-04-10 09:55:57', 'GYM-20250410-0002'),
(10, 13, 2, 809.98, '2025-04-10 10:36:39', 'GYM-20250410-0003'),
(11, 13, 3, 809.97, '2025-04-10 10:36:54', 'GYM-20250410-0004'),
(13, 13, 3, 1124.97, '2025-04-11 21:35:13', 'GYM-20250411-0001');

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
(9, 13, 2, 390.00, 3510.00, '2025-03-16', '2025-09-16', 0, NULL, NULL),
(10, 14, 3, 2400.00, 9600.00, '2025-03-16', '2025-09-16', 0, NULL, NULL),
(11, 15, 3, 2400.00, 9600.00, '2025-03-16', '2025-09-16', 0, NULL, NULL),
(12, 16, 3, 2400.00, 9600.00, '2025-03-16', '2025-09-16', 0, NULL, NULL),
(13, 27, 1, 240.00, 2160.00, '2025-04-08', '2025-07-08', 0, NULL, NULL),
(14, 55, 1, 0.00, 800.00, '2025-04-08', '2025-05-08', 0, NULL, NULL),
(15, 60, 2, 390.30, 3512.70, '2025-04-10', '2025-07-10', 0, NULL, NULL),
(16, 61, 2, 0.00, 1301.00, '2025-04-10', '2025-05-10', 0, NULL, NULL),
(19, 64, 2, 390.30, 3512.70, '2025-04-11', '2025-07-11', 0, NULL, NULL),
(20, 65, 2, 390.30, 3512.70, '2025-04-11', '2025-07-11', 0, NULL, NULL),
(21, 66, 2, 0.00, 1301.00, '2025-04-26', '2025-05-26', 0, NULL, NULL);

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
(1, 'Basic Plan', 801.00, 2, 0, 0, 0),
(2, 'Premium Plan', 1301.00, 4, 1, -1, 10),
(3, 'Elite Plan', 2000.00, -1, 2, -1, 15);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `membership_renewals`
--

CREATE TABLE `membership_renewals` (
  `id` int NOT NULL,
  `membership_id` bigint NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `renewal_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `membership_renewals`
--

INSERT INTO `membership_renewals` (`id`, `membership_id`, `paid_amount`, `renewal_date`) VALUES
(2, 9, 3512.70, '2025-04-10');

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
(10, 13, 1, 2),
(11, 13, 6, 3),
(12, 13, 1, 4),
(13, 13, 6, 5),
(14, 13, 6, 6),
(16, 13, 2, 7);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `notification_type` enum('trainer_request','forum','friend_request') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `forum_thread_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `message` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `notification_type`, `forum_thread_id`, `created_at`, `message`) VALUES
(1, 14, 'trainer_request', NULL, '2025-04-30 16:01:07', 'Your personal training request to Trainer User has been rejected.'),
(20, 13, 'forum', 1, '2025-04-30 16:26:29', 'You have a new post in your forum thread.'),
(21, 13, 'friend_request', NULL, '2025-04-30 16:31:19', 'You have a new friend request from Berkay Arıkan'),
(23, 13, 'friend_request', NULL, '2025-04-30 16:31:45', 'You have a new friend request from Member User'),
(24, 14, 'friend_request', NULL, '2025-04-30 16:31:57', 'Your friend request to Berkay Arıkan has been accepted.'),
(26, 13, 'friend_request', NULL, '2025-04-30 16:32:27', 'You have been removed from Berkay Arıkan\'s friends list.'),
(28, 13, 'friend_request', NULL, '2025-04-30 16:33:44', 'Your friend request to Member User has been accepted.'),
(29, 13, 'friend_request', NULL, '2025-04-30 16:33:47', 'You have been removed from Member User\'s friends list.');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` bigint NOT NULL,
  `expiry_date` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(4, 55, 'berkay arıkan', '1243576124134124', '11/25', 123),
(5, 60, 'berkay arıkan', '1243574654252637', '11/28', 123),
(6, 61, 'berkay arıkan', '1241241234125123', '12/22', 123),
(9, 64, 'berkay arıkan', '1251356135214124', '11/27', 123),
(10, 65, 'Berkay Arıkan', '1245682341613413', '11/27', 123),
(11, 66, 'berkay arıkan', '1245124512541234', '11/27', 123);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `personal_training_ratings`
--

CREATE TABLE `personal_training_ratings` (
  `id` int NOT NULL,
  `member_id` bigint NOT NULL,
  `session_id` bigint NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text COLLATE utf8mb4_general_ci
) ;

--
-- Tablo döküm verisi `personal_training_ratings`
--

INSERT INTO `personal_training_ratings` (`id`, `member_id`, `session_id`, `rating`, `comment`) VALUES
(1, 13, 4, 2, ''),
(2, 13, 5, 4, 'deneme'),
(3, 13, 6, 2, '');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `pt_session_buy`
--

CREATE TABLE `pt_session_buy` (
  `id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `amount_of_sessions` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `purchase_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `pt_session_buy`
--

INSERT INTO `pt_session_buy` (`id`, `client_id`, `amount_of_sessions`, `total_price`, `purchase_date`) VALUES
(2, 3, 1, 200.00, '2025-04-10 12:41:59');

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
-- Tablo için tablo yapısı `trainer_employee_details`
--

CREATE TABLE `trainer_employee_details` (
  `id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `weekly_hours` int NOT NULL,
  `salary` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `trainer_employee_details`
--

INSERT INTO `trainer_employee_details` (`id`, `user_id`, `weekly_hours`, `salary`) VALUES
(1, 3, 40, 33000.00);

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
(10, 3, 14, 'I\'d like to book a training session', '2025-05-01', '10:03:00', 0);

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
(4, 3, 13, '2025-04-08', '11:28:00', 'Automatically created from registration request #3', 'Initial Consultation'),
(5, 3, 13, '2025-04-08', '11:28:00', 'Automatically created from registration request #3', 'Initial Consultation'),
(6, 3, 13, '2025-04-09', '05:42:00', '', 'Personal Training'),
(7, 3, 13, '2025-04-15', '05:43:00', '', 'Personal Training'),
(12, 3, 13, '2025-05-30', '16:40:00', '', 'Regular Session');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `trainer_session_requests`
--

CREATE TABLE `trainer_session_requests` (
  `id` int NOT NULL,
  `trainer_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `request_message` text COLLATE utf8mb4_general_ci,
  `requested_meeting_date` date DEFAULT NULL,
  `requested_meeting_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `trainer_session_requests`
--

INSERT INTO `trainer_session_requests` (`id`, `trainer_id`, `client_id`, `request_message`, `requested_meeting_date`, `requested_meeting_time`) VALUES
(7, 3, 13, '', '2025-05-01', '22:04:00'),
(8, 3, 13, '', '2025-05-10', '00:05:00');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `trainer_session_reschedule_request`
--

CREATE TABLE `trainer_session_reschedule_request` (
  `id` bigint NOT NULL,
  `session_id` bigint NOT NULL,
  `new_session_date` date NOT NULL,
  `new_session_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `trainer_session_reschedule_request`
--

INSERT INTO `trainer_session_reschedule_request` (`id`, `session_id`, `new_session_date`, `new_session_time`) VALUES
(7, 12, '2025-05-22', '18:41:00');

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
(1, 3, 'Professional trainer with 5 years of experience in strength training and fitness coaching.', 'Strength Training, Weight Loss, Nutrition', 1, 0, 1, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `training_sessions`
--

CREATE TABLE `training_sessions` (
  `id` bigint NOT NULL,
  `created_at` date NOT NULL,
  `date` date NOT NULL,
  `duration` int NOT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `client_id` bigint NOT NULL,
  `trainer_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(2, 'Member', 'User', '	/uploads/images/default-avatar.jpg	', 'member@gymflex.com', '0539 783 7419', 'MEMBER', '2025-03-15 01:50:43', '$2a$10$FHSXUOTmMFaSyrGfSZ.Gk.8ztEvcSWFMrE6iubSRm3x3hrlY55C0S'),
(3, 'Trainer', 'User', '	/uploads/images/default-avatar.jpg	', 'trainer@gymflex.com', '0555 444 3322', 'TRAINER', '2025-03-15 01:50:43', '$2a$10$lCA4owT8/KaSBzK02o5mYOXOYBmAzCekRRHdtiJMllCxt1fBA2mVu'),
(13, 'Berkay', 'Arıkan', '/uploads/e2145a25-9c1c-4316-8fef-c82042f649ed.jpeg', 'berkayyy5445@gmail.com', '0539 783 7419', 'MEMBER', '2025-03-16 17:04:35', '$2a$10$jy/b.Y3WgjB34MLw.my6le4mzZ5NIKrH7dx0ERwAS6iegYei8JyJO'),
(14, 'Berkay', 'Arıkan', '	/uploads/images/default-avatar.jpg	', 'berkay222@gmail.com', '0555 999 8877', 'MEMBER', '2025-03-16 17:21:45', '$2a$10$uUqtVHe7ER9sGPHfb/zwpuOTKzXEuJ2tCS.TPMwLqmuOcqj2BAJcG'),
(15, 'berkay', 'arıkan', '	/uploads/images/default-avatar.jpg	', 'berkay112233@gmail.com', '0555 888 7766', 'MEMBER', '2025-03-16 17:24:37', '$2a$10$n2PRSvHodVMZ0U/anqrMDe76V/Yai2fL/qdvv8xJhBKWCDUB7G12S'),
(16, 'berkay', 'arıkan', '	/uploads/images/default-avatar.jpg	', 'berkay123123@gmail.com', '0555 777 6655', 'MEMBER', '2025-03-16 17:26:01', '$2a$10$/Z7JudNXYosrwAR7J2w9rOBR5xXJ7B/jOsh9Us7oyBJo85MTP79ou'),
(27, 'berkay', 'arıkan', '/uploads/images/default-avatar.jpg', 'deneme@gmail.com', '0555 666 5544', 'MEMBER', '2025-04-08 12:08:41', '$2a$10$G9D3YfWSzKzQK2vnn.Eugug9hTa9ydWdoBwlKUqXIc9wI2GwKlsya'),
(55, 'deneme', 'deneme', '/uploads/images/default-avatar.jpg', 'denem123e@gmail.com', '0555 555 4433', 'MEMBER', '2025-04-08 12:40:32', '$2a$10$ybJPWvBZTHUTc3OPv9PyWeNq9S/SelsYuPZXrnG5WXsiJEg/juWtS'),
(60, 'berkay', 'arıkan', '/uploads/images/default-avatar.jpg', 'de1261neme@gmail.com', '0555 987 6543', 'MEMBER', '2025-04-10 20:06:28', '$2a$10$5EcpMlQ.MTvXnqTfoC4NXufCVHy5O.c9dJK.gMUMTvI6nDCfp18gq'),
(61, 'berkay', 'arıkan', '/uploads/images/default-avatar.jpg', 'denem123123e@gmail.com', '0555 876 5432', 'MEMBER', '2025-04-10 23:37:33', '$2a$10$vPNiXKzA2dOaICab2hwu2.MB2x0L.1b6p6NLoapsvR5Q6dGM4I552'),
(64, 'Berkay Mustafa', 'Arıkan', '/uploads/images/default-avatar.jpg', 'deneme123123@gmail.com', '0555 765 4321', 'MEMBER', '2025-04-11 16:35:03', '$2a$10$71TUBLBIkj/0YihfTL/JaeyJirs.dic0jMcQlbK6VotBkkbGNRXtO'),
(65, 'Berkay', 'Arıkan', '/uploads/images/default-avatar.jpg', 'berkay123@gmail.com', '0555 333 2211', 'MEMBER', '2025-04-11 21:31:06', '$2a$10$iSOqmpMzL8UdxG7a0RkM1OOE7i6eZRnyeT8qfN.TVa1Q8L9aGHEuq'),
(66, 'Berkay', 'Arıkan', '/uploads/images/default-avatar.jpg', 'berkaydeneme123@gmail.com', '0533 312 3456', 'MEMBER', '2025-04-26 17:44:04', '$2a$10$XIs0hFvWRy4WQqXBe6RMEOmdS988YtotmZ0KHYljt3Bty3wIrecFy');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `user_progress_goals`
--

CREATE TABLE `user_progress_goals` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `set_by` bigint NOT NULL,
  `goal_date` date NOT NULL,
  `target_weight` double DEFAULT NULL,
  `target_body_fat` double DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `user_progress_goals`
--

INSERT INTO `user_progress_goals` (`id`, `user_id`, `set_by`, `goal_date`, `target_weight`, `target_body_fat`, `notes`) VALUES
(3, 13, 13, '2025-04-28', 85, 17, '');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `user_statistics`
--

CREATE TABLE `user_statistics` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `entered_by` bigint NOT NULL,
  `entry_date` date NOT NULL,
  `weight` double DEFAULT NULL,
  `body_fat` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `user_statistics`
--

INSERT INTO `user_statistics` (`id`, `user_id`, `entered_by`, `entry_date`, `weight`, `body_fat`, `height`, `notes`) VALUES
(6, 13, 3, '2025-04-28', 120, 25, 190, ''),
(7, 13, 3, '2025-04-28', 110, 22, 190, ''),
(8, 13, 13, '2025-04-28', 100, 20, 190, 'asdd');

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
  `target_muscles` text COLLATE utf8mb4_general_ci,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `workouts`
--

INSERT INTO `workouts` (`id`, `user_id`, `is_trainer`, `level_id`, `category_id`, `duration`, `calories`, `description`, `equipment`, `name`, `target_muscles`, `image_path`) VALUES
(1, 3, 1, 1, 1, 60, 450, 'Complete full body workout focusing on major muscle groups', 'Dumbbells,Barbell,Resistance Bands', 'Full Body Strength', 'Chest,Back,Legs,Shoulders', '/uploads/images/12c11445-5fbd-48e7-b925-abe6311a03f1.jpeg'),
(2, 3, 1, 3, 2, 45, 600, 'High-intensity interval training for maximum calorie burn', 'Kettlebell,Jump Rope,Yoga Mat', 'HIIT Cardio Blast', 'Core,Legs,Shoulders', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
(6, 13, 0, 2, 3, 45, 350, 'asdfg', 'Dumbbells', 'deneme', 'Chest', '/uploads/images/adc246d3-353c-4d80-8c35-5958380603a5.jpeg');

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
(148, 2, 'Burpees', 5, '45 seconds'),
(149, 2, 'Mountain Climbers', 5, '45 seconds'),
(150, 2, 'Jump Rope', 5, '60 seconds'),
(177, 6, 'Bench Press', 3, '8-12'),
(178, 6, 'deneme', 3, '8-12'),
(179, 6, 'deneme', 3, '8-12'),
(180, 1, 'Barbell Squat', 4, '8-12 reps'),
(181, 1, 'Bench Press', 4, '8-12 reps'),
(182, 1, 'Deadlift', 3, '8-10 reps');

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
-- Tablo için indeksler `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `replied_to` (`replied_to`);

--
-- Tablo için indeksler `club_visits`
--
ALTER TABLE `club_visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `contact_forms`
--
ALTER TABLE `contact_forms`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `exercise_progress`
--
ALTER TABLE `exercise_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `entered_by` (`entered_by`);

--
-- Tablo için indeksler `exercise_progress_goals`
--
ALTER TABLE `exercise_progress_goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `set_by` (`set_by`);

--
-- Tablo için indeksler `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_category_id` (`expenses_category_id`);

--
-- Tablo için indeksler `expenses_categories`
--
ALTER TABLE `expenses_categories`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `forum_likes`
--
ALTER TABLE `forum_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_id` (`post_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thread_id` (`thread_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `quoted_post_id` (`quoted_post_id`);

--
-- Tablo için indeksler `forum_threads`
--
ALTER TABLE `forum_threads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `free_pt_use`
--
ALTER TABLE `free_pt_use`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `session_request_id` (`session_request_id`);

--
-- Tablo için indeksler `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user1_id` (`user1_id`),
  ADD KEY `user2_id` (`user2_id`);

--
-- Tablo için indeksler `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Tablo için indeksler `general_prices`
--
ALTER TABLE `general_prices`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `group_classes_sale`
--
ALTER TABLE `group_classes_sale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enrollment_id` (`enrollment_id`);

--
-- Tablo için indeksler `group_workouts`
--
ALTER TABLE `group_workouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `level_id` (`level_id`),
  ADD KEY `trainer_id` (`trainer_id`),
  ADD KEY `category_id` (`category_id`);

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
-- Tablo için indeksler `membership_renewals`
--
ALTER TABLE `membership_renewals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `membership_id` (`membership_id`);

--
-- Tablo için indeksler `member_training_plans`
--
ALTER TABLE `member_training_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `workout_id` (`workout_id`);

--
-- Tablo için indeksler `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notifications_user` (`user_id`),
  ADD KEY `fk_notifications_forum_thread` (`forum_thread_id`);

--
-- Tablo için indeksler `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
-- Tablo için indeksler `pt_session_buy`
--
ALTER TABLE `pt_session_buy`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Tablo için indeksler `trainer_clients`
--
ALTER TABLE `trainer_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainer_id` (`trainer_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Tablo için indeksler `trainer_employee_details`
--
ALTER TABLE `trainer_employee_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainer_employee_details_ibfk_1` (`user_id`);

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
-- Tablo için indeksler `trainer_session_requests`
--
ALTER TABLE `trainer_session_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainer_id` (`trainer_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Tablo için indeksler `trainer_session_reschedule_request`
--
ALTER TABLE `trainer_session_reschedule_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Tablo için indeksler `trainer_settings`
--
ALTER TABLE `trainer_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainer_settings_ibfk_1` (`trainer_id`);

--
-- Tablo için indeksler `training_sessions`
--
ALTER TABLE `training_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKp4xjk0kbwk8va2rk54p0iu58j` (`client_id`),
  ADD KEY `FKaa4sw1ln6wc10nb0ba4rxjeei` (`trainer_id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Tablo için indeksler `user_progress_goals`
--
ALTER TABLE `user_progress_goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `set_by` (`set_by`);

--
-- Tablo için indeksler `user_statistics`
--
ALTER TABLE `user_statistics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `entered_by` (`entered_by`);

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
-- Tablo için AUTO_INCREMENT değeri `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `club_visits`
--
ALTER TABLE `club_visits`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `contact_forms`
--
ALTER TABLE `contact_forms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `exercise_progress`
--
ALTER TABLE `exercise_progress`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `exercise_progress_goals`
--
ALTER TABLE `exercise_progress_goals`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `expenses_categories`
--
ALTER TABLE `expenses_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `forum_likes`
--
ALTER TABLE `forum_likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Tablo için AUTO_INCREMENT değeri `forum_posts`
--
ALTER TABLE `forum_posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Tablo için AUTO_INCREMENT değeri `forum_threads`
--
ALTER TABLE `forum_threads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `free_pt_use`
--
ALTER TABLE `free_pt_use`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `friends`
--
ALTER TABLE `friends`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `friend_requests`
--
ALTER TABLE `friend_requests`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Tablo için AUTO_INCREMENT değeri `general_prices`
--
ALTER TABLE `general_prices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `group_classes_sale`
--
ALTER TABLE `group_classes_sale`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `group_workouts`
--
ALTER TABLE `group_workouts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Tablo için AUTO_INCREMENT değeri `group_workout_categories`
--
ALTER TABLE `group_workout_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `group_workout_enrolls`
--
ALTER TABLE `group_workout_enrolls`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `group_workout_levels`
--
ALTER TABLE `group_workout_levels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `group_workout_sessions`
--
ALTER TABLE `group_workout_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `market_categories`
--
ALTER TABLE `market_categories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `market_products`
--
ALTER TABLE `market_products`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Tablo için AUTO_INCREMENT değeri `market_product_sales`
--
ALTER TABLE `market_product_sales`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Tablo için AUTO_INCREMENT değeri `market_sales_invoices`
--
ALTER TABLE `market_sales_invoices`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Tablo için AUTO_INCREMENT değeri `memberships`
--
ALTER TABLE `memberships`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Tablo için AUTO_INCREMENT değeri `membership_plans`
--
ALTER TABLE `membership_plans`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `membership_renewals`
--
ALTER TABLE `membership_renewals`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `member_training_plans`
--
ALTER TABLE `member_training_plans`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Tablo için AUTO_INCREMENT değeri `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Tablo için AUTO_INCREMENT değeri `payment_method`
--
ALTER TABLE `payment_method`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Tablo için AUTO_INCREMENT değeri `personal_training_ratings`
--
ALTER TABLE `personal_training_ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `pt_session_buy`
--
ALTER TABLE `pt_session_buy`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_clients`
--
ALTER TABLE `trainer_clients`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_employee_details`
--
ALTER TABLE `trainer_employee_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_registration_requests`
--
ALTER TABLE `trainer_registration_requests`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_sessions`
--
ALTER TABLE `trainer_sessions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_session_requests`
--
ALTER TABLE `trainer_session_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_session_reschedule_request`
--
ALTER TABLE `trainer_session_reschedule_request`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_settings`
--
ALTER TABLE `trainer_settings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `training_sessions`
--
ALTER TABLE `training_sessions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- Tablo için AUTO_INCREMENT değeri `user_progress_goals`
--
ALTER TABLE `user_progress_goals`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `user_statistics`
--
ALTER TABLE `user_statistics`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `workouts`
--
ALTER TABLE `workouts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Tablo için AUTO_INCREMENT değeri `workout_categories`
--
ALTER TABLE `workout_categories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `workout_exercises`
--
ALTER TABLE `workout_exercises`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- Tablo için AUTO_INCREMENT değeri `workout_levels`
--
ALTER TABLE `workout_levels`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_3` FOREIGN KEY (`replied_to`) REFERENCES `chat_messages` (`id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `club_visits`
--
ALTER TABLE `club_visits`
  ADD CONSTRAINT `club_visits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `exercise_progress`
--
ALTER TABLE `exercise_progress`
  ADD CONSTRAINT `exercise_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `exercise_progress_ibfk_2` FOREIGN KEY (`entered_by`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `exercise_progress_goals`
--
ALTER TABLE `exercise_progress_goals`
  ADD CONSTRAINT `exercise_progress_goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `exercise_progress_goals_ibfk_2` FOREIGN KEY (`set_by`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`expenses_category_id`) REFERENCES `expenses_categories` (`id`);

--
-- Tablo kısıtlamaları `forum_likes`
--
ALTER TABLE `forum_likes`
  ADD CONSTRAINT `forum_likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `forum_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `forum_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD CONSTRAINT `forum_posts_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `forum_posts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `forum_posts_ibfk_3` FOREIGN KEY (`quoted_post_id`) REFERENCES `forum_posts` (`id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `forum_threads`
--
ALTER TABLE `forum_threads`
  ADD CONSTRAINT `forum_threads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `free_pt_use`
--
ALTER TABLE `free_pt_use`
  ADD CONSTRAINT `free_pt_use_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `free_pt_use_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `trainer_sessions` (`id`),
  ADD CONSTRAINT `free_pt_use_ibfk_3` FOREIGN KEY (`session_request_id`) REFERENCES `trainer_session_requests` (`id`);

--
-- Tablo kısıtlamaları `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD CONSTRAINT `friend_requests_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friend_requests_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `group_classes_sale`
--
ALTER TABLE `group_classes_sale`
  ADD CONSTRAINT `group_classes_sale_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `group_workout_enrolls` (`id`);

--
-- Tablo kısıtlamaları `group_workouts`
--
ALTER TABLE `group_workouts`
  ADD CONSTRAINT `group_workouts_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `group_workout_levels` (`id`),
  ADD CONSTRAINT `group_workouts_ibfk_2` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `group_workouts_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `group_workout_categories` (`id`);

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
-- Tablo kısıtlamaları `membership_renewals`
--
ALTER TABLE `membership_renewals`
  ADD CONSTRAINT `membership_renewals_ibfk_1` FOREIGN KEY (`membership_id`) REFERENCES `memberships` (`id`);

--
-- Tablo kısıtlamaları `member_training_plans`
--
ALTER TABLE `member_training_plans`
  ADD CONSTRAINT `member_training_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `member_training_plans_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`);

--
-- Tablo kısıtlamaları `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_forum_thread` FOREIGN KEY (`forum_thread_id`) REFERENCES `forum_threads` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

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
-- Tablo kısıtlamaları `pt_session_buy`
--
ALTER TABLE `pt_session_buy`
  ADD CONSTRAINT `pt_session_buy_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `trainer_clients` (`id`);

--
-- Tablo kısıtlamaları `trainer_clients`
--
ALTER TABLE `trainer_clients`
  ADD CONSTRAINT `trainer_clients_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trainer_clients_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `trainer_employee_details`
--
ALTER TABLE `trainer_employee_details`
  ADD CONSTRAINT `trainer_employee_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

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
-- Tablo kısıtlamaları `trainer_session_requests`
--
ALTER TABLE `trainer_session_requests`
  ADD CONSTRAINT `trainer_session_requests_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trainer_session_requests_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `trainer_session_reschedule_request`
--
ALTER TABLE `trainer_session_reschedule_request`
  ADD CONSTRAINT `trainer_session_reschedule_request_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `trainer_sessions` (`id`);

--
-- Tablo kısıtlamaları `trainer_settings`
--
ALTER TABLE `trainer_settings`
  ADD CONSTRAINT `trainer_settings_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Tablo kısıtlamaları `training_sessions`
--
ALTER TABLE `training_sessions`
  ADD CONSTRAINT `FKaa4sw1ln6wc10nb0ba4rxjeei` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKp4xjk0kbwk8va2rk54p0iu58j` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `user_progress_goals`
--
ALTER TABLE `user_progress_goals`
  ADD CONSTRAINT `user_progress_goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_progress_goals_ibfk_2` FOREIGN KEY (`set_by`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `user_statistics`
--
ALTER TABLE `user_statistics`
  ADD CONSTRAINT `user_statistics_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_statistics_ibfk_2` FOREIGN KEY (`entered_by`) REFERENCES `users` (`id`);

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
