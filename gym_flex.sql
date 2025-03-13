-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 13 Mar 2025, 15:01:21
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
-- Tablo için tablo yapısı `market_categories`
--

CREATE TABLE `market_categories` (
  `id` bigint NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `market_products`
--

CREATE TABLE `market_products` (
  `id` bigint NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `category_id` bigint NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `memberships`
--

CREATE TABLE `memberships` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `plan_id` bigint NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_frozen` tinyint(1) DEFAULT '0',
  `freeze_start_date` date DEFAULT NULL,
  `freeze_end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `membership_plans`
--

CREATE TABLE `membership_plans` (
  `id` bigint NOT NULL,
  `plan_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `plan_price` decimal(10,2) NOT NULL,
  `guest_pass_count` int NOT NULL,
  `monthly_pt_sessions` int NOT NULL,
  `group_class_count` int NOT NULL,
  `market_discount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `trainer_registration_requests`
--

CREATE TABLE `trainer_registration_requests` (
  `id` bigint NOT NULL,
  `trainer_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `request_message` text COLLATE utf8mb4_general_ci,
  `requested_meeting_date` date NOT NULL,
  `requested_meeting_time` time NOT NULL,
  `is_modified_by_trainer` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `trainer_sessions`
--

CREATE TABLE `trainer_sessions` (
  `id` bigint NOT NULL,
  `trainer_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  `session_date` date NOT NULL,
  `session_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `profile_photo_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `duration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `workout_categories`
--

CREATE TABLE `workout_categories` (
  `id` bigint NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `workout_exercises`
--

CREATE TABLE `workout_exercises` (
  `id` bigint NOT NULL,
  `workout_id` bigint NOT NULL,
  `exercise_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `sets` int NOT NULL,
  `rep_range` varchar(50) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `workout_levels`
--

CREATE TABLE `workout_levels` (
  `id` bigint NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD UNIQUE KEY `username` (`username`),
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
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

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
-- Tablo için AUTO_INCREMENT değeri `market_categories`
--
ALTER TABLE `market_categories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `market_products`
--
ALTER TABLE `market_products`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `market_product_sales`
--
ALTER TABLE `market_product_sales`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `market_purchases`
--
ALTER TABLE `market_purchases`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `market_sales_invoices`
--
ALTER TABLE `market_sales_invoices`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `memberships`
--
ALTER TABLE `memberships`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `membership_plans`
--
ALTER TABLE `membership_plans`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `member_training_plans`
--
ALTER TABLE `member_training_plans`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_registration_requests`
--
ALTER TABLE `trainer_registration_requests`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_sessions`
--
ALTER TABLE `trainer_sessions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `trainer_settings`
--
ALTER TABLE `trainer_settings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `why_choose_us`
--
ALTER TABLE `why_choose_us`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `workouts`
--
ALTER TABLE `workouts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `workout_categories`
--
ALTER TABLE `workout_categories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `workout_exercises`
--
ALTER TABLE `workout_exercises`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `workout_levels`
--
ALTER TABLE `workout_levels`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

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
