-- MySQL initialization script for game-shop-app
-- This file is mounted into the MySQL container by docker-compose.

CREATE DATABASE IF NOT EXISTS game_shop;
USE game_shop;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  profile_image VARCHAR(512) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  description TEXT,
  total_sales INT NOT NULL DEFAULT 0,
  release_date DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promo_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  max_uses INT NOT NULL DEFAULT 1,
  current_uses INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  final_price DECIMAL(12,2) NOT NULL,
  promo_code VARCHAR(100) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  game_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  purchased_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY user_game_unique (user_id, game_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_promo_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  promo_code_id INT NOT NULL,
  used_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY user_promo_unique (user_id, promo_code_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  order_id INT DEFAULT NULL,
  description VARCHAR(512) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Seed data for development
INSERT INTO users (username, email, password, role, wallet_balance, profile_image)
VALUES
  ('Alice Nguyen', 'alice@example.com', '$2b$10$7s9B3v8z9QK1bX5FudaCpe8frHUEfR7K7pXX7wN6r3OJPU3dP1CVa', 'user', 1000.00, NULL),
  ('Bob Smith', 'bob@example.com', '$2b$10$7s9B3v8z9QK1bX5FudaCpe8frHUEfR7K7pXX7wN6r3OJPU3dP1CVa', 'user', 500.00, NULL),
  ('Admin Master', 'admin@example.com', '$2b$10$7s9B3v8z9QK1bX5FudaCpe8frHUEfR7K7pXX7wN6r3OJPU3dP1CVa', 'admin', 0.00, NULL);

INSERT INTO games (name, price, genre, description, total_sales, release_date)
VALUES
  ('Cyber Sprint', 19.99, 'Action', 'A fast-paced cyberpunk runner game.', 24, '2024-08-10 00:00:00'),
  ('Mystic Farm', 14.99, 'Simulation', 'Build and manage your own magical farm.', 11, '2023-11-05 00:00:00'),
  ('Galaxy Chess', 9.99, 'Strategy', 'A futuristic chess experience with cosmic battles.', 8, '2024-01-22 00:00:00'),
  ('Shadow Shift', 24.99, 'Adventure', 'Explore ancient ruins and master shadow powers.', 15, '2024-03-18 00:00:00');

INSERT INTO promo_codes (code, discount_percent, max_uses, current_uses, is_active)
VALUES
  ('WELCOME10', 10.00, 100, 12, 1),
  ('SPRING25', 25.00, 25, 5, 1),
  ('OLDGAME5', 5.00, 50, 0, 1);

INSERT INTO transactions (user_id, type, amount, order_id, description)
VALUES
  (1, 'topup', 1000.00, NULL, 'Initial wallet top-up'),
  (2, 'topup', 500.00, NULL, 'Initial wallet top-up');

INSERT INTO user_games (user_id, game_id)
VALUES
  (1, 1),
  (1, 2),
  (2, 2);

INSERT INTO game_images (game_id, image_url, is_primary)
VALUES
  (1, 'https://example.com/images/cyber-sprint-1.jpg', 1),
  (1, 'https://example.com/images/cyber-sprint-2.jpg', 0),
  (2, 'https://example.com/images/mystic-farm-1.jpg', 1),
  (3, 'https://example.com/images/galaxy-chess-1.jpg', 1),
  (4, 'https://example.com/images/shadow-shift-1.jpg', 1);

CREATE OR REPLACE VIEW top_games AS
SELECT 
  g.id,
  g.name,
  g.price,
  g.genre,
  g.description,
  g.total_sales,
  g.release_date,
  g.created_at,
  g.updated_at
FROM games g
ORDER BY g.total_sales DESC
LIMIT 10;
