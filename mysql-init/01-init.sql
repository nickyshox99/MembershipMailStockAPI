-- Create membership database if not exists
CREATE DATABASE IF NOT EXISTS membership CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the membership database
USE membership;

-- Create a sample table for testing
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT IGNORE INTO users (username, email, password) VALUES 
('admin', 'admin@example.com', '$2b$10$example_hash_here'),
('testuser', 'test@example.com', '$2b$10$example_hash_here');
