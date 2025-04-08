-- Trainer-related tables

CREATE TABLE IF NOT EXISTS trainer_clients (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trainer_id BIGINT NOT NULL,
  client_id BIGINT NOT NULL,
  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  remaining_sessions INT NOT NULL,
  FOREIGN KEY (trainer_id) REFERENCES users(id),
  FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS trainer_registration_requests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trainer_id BIGINT NOT NULL,
  client_id BIGINT NOT NULL,
  request_message TEXT,
  requested_meeting_date DATE NOT NULL,
  requested_meeting_time TIME NOT NULL,
  is_modified_by_trainer BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (trainer_id) REFERENCES users(id),
  FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS trainer_sessions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trainer_id BIGINT NOT NULL,
  client_id BIGINT NOT NULL,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  FOREIGN KEY (trainer_id) REFERENCES users(id),
  FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS trainer_settings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trainer_id BIGINT NOT NULL,
  bio TEXT,
  specialization TEXT,
  new_client_notifications BOOLEAN DEFAULT TRUE,
  progress_update_notifications BOOLEAN DEFAULT TRUE,
  mobile_notifications BOOLEAN DEFAULT TRUE,
  desktop_notifications BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (trainer_id) REFERENCES users(id)
);

-- Sample data for trainer_clients
INSERT INTO trainer_clients (trainer_id, client_id, registration_date, remaining_sessions) VALUES 
(2, 3, '2024-04-01 10:00:00', 10),
(2, 4, '2024-04-02 11:30:00', 5),
(2, 5, '2024-04-03 14:00:00', 8),
(6, 7, '2024-04-01 09:00:00', 12),
(6, 8, '2024-04-02 13:00:00', 6);

-- Sample data for trainer_registration_requests
INSERT INTO trainer_registration_requests (trainer_id, client_id, request_message, requested_meeting_date, requested_meeting_time, is_modified_by_trainer) VALUES 
(2, 9, 'I would like to start personal training focusing on weight loss.', '2024-04-20', '10:00:00', false),
(2, 10, 'Need help with strength training program.', '2024-04-22', '14:00:00', false),
(6, 11, 'Interested in yoga and flexibility training.', '2024-04-21', '09:30:00', true);

-- Sample data for trainer_sessions
INSERT INTO trainer_sessions (trainer_id, client_id, session_date, session_time) VALUES 
(2, 3, '2024-04-15', '10:00:00'),
(2, 4, '2024-04-15', '11:30:00'),
(2, 5, '2024-04-16', '14:00:00'),
(2, 3, '2024-04-17', '10:00:00'),
(6, 7, '2024-04-15', '09:00:00'),
(6, 8, '2024-04-16', '13:00:00');

-- Sample data for trainer_settings
INSERT INTO trainer_settings (trainer_id, bio, specialization, new_client_notifications, progress_update_notifications, mobile_notifications, desktop_notifications) VALUES 
(2, 'Certified personal trainer with 5 years of experience specializing in weight loss and strength training. Committed to helping clients achieve their fitness goals through personalized programs.', 'Weight Training, HIIT, Nutrition', true, true, true, true),
(6, 'Yoga instructor and flexibility coach with 8 years of experience. Focused on holistic approaches to fitness including mindfulness and proper form.', 'Yoga, Pilates, Flexibility Training', true, true, true, false);
