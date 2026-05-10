-- Traveloop Database Schema
-- MySQL Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS traveloop;
USE traveloop;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Trips table
CREATE TABLE trips (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    trip_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_image VARCHAR(255) DEFAULT NULL,
    visibility ENUM('private', 'public') DEFAULT 'private',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_visibility (visibility)
);

-- Trip stops (cities/destinations)
CREATE TABLE trip_stops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    arrival_date DATE,
    departure_date DATE,
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_trip_id (trip_id)
);

-- Activities master list
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    category ENUM('sightseeing', 'food', 'adventure', 'nightlife', 'shopping', 'culture', 'nature', 'other') DEFAULT 'other',
    avg_cost DECIMAL(10, 2) DEFAULT 0.00,
    duration INT DEFAULT 60, -- in minutes
    description TEXT,
    image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);

-- Trip activities (activities added to specific trip stops)
CREATE TABLE trip_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_stop_id INT NOT NULL,
    activity_id INT NOT NULL,
    selected_date DATE,
    selected_time TIME,
    custom_cost DECIMAL(10, 2) DEFAULT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    INDEX idx_trip_stop_id (trip_stop_id)
);

-- Packing checklist items
CREATE TABLE checklist_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    category ENUM('clothing', 'electronics', 'documents', 'essentials', 'toiletries', 'other') DEFAULT 'other',
    is_packed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_trip_id (trip_id)
);

-- Trip notes/journal
CREATE TABLE notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    note TEXT NOT NULL,
    note_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_trip_id (trip_id)
);

-- Budget tracking
CREATE TABLE budget_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    category ENUM('transport', 'accommodation', 'food', 'activities', 'shopping', 'other') NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
    actual_cost DECIMAL(10, 2) DEFAULT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_trip_id (trip_id)
);

-- Insert sample activities
INSERT INTO activities (name, category, avg_cost, duration, description) VALUES
('Eiffel Tower Visit', 'sightseeing', 25.00, 120, 'Visit the iconic Eiffel Tower in Paris'),
('Local Food Tour', 'food', 50.00, 180, 'Explore local cuisine with a guided food tour'),
('Hiking Adventure', 'adventure', 30.00, 240, 'Guided hiking through scenic trails'),
('City Night Tour', 'nightlife', 40.00, 150, 'Experience the city nightlife'),
('Museum Visit', 'culture', 15.00, 90, 'Explore local history and culture'),
('Beach Day', 'nature', 0.00, 300, 'Relax at the beach'),
('Shopping District Tour', 'shopping', 20.00, 120, 'Visit popular shopping areas'),
('Cooking Class', 'food', 60.00, 180, 'Learn to cook local dishes'),
('Scuba Diving', 'adventure', 100.00, 240, 'Underwater diving experience'),
('Wine Tasting', 'food', 45.00, 120, 'Sample local wines');
