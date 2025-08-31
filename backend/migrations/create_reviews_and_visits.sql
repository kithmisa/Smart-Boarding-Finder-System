-- Migration: Create Reviews and Visit Requests Tables
-- Run this file to add the new functionality to your database

-- ========================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- ========================================

-- Add owner_id column to houses table if it doesn't exist
ALTER TABLE houses ADD COLUMN IF NOT EXISTS owner_id INT;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available';
ALTER TABLE houses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add foreign key constraint for owner_id (uncomment after linking houses with owners)
-- ALTER TABLE houses ADD CONSTRAINT fk_houses_owner FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE SET NULL;

-- ========================================
-- REVIEWS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  boarding_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  cleanliness INT NOT NULL CHECK (cleanliness >= 1 AND cleanliness <= 5),
  location INT NOT NULL CHECK (location >= 1 AND location <= 5),
  value INT NOT NULL CHECK (value >= 1 AND value <= 5),
  amenities INT NOT NULL CHECK (amenities >= 1 AND amenities <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (boarding_id) REFERENCES houses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_boarding (user_id, boarding_id),
  INDEX idx_boarding_id (boarding_id),
  INDEX idx_user_id (user_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
);

-- ========================================
-- VISIT REQUESTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS visit_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  boarding_id INT NOT NULL,
  user_id INT NOT NULL,
  requested_date DATE NOT NULL,
  requested_time TIME,
  message TEXT,
  status ENUM('pending', 'confirmed', 'rejected', 'cancelled') DEFAULT 'pending',
  owner_response TEXT,
  confirmed_date DATE,
  confirmed_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (boarding_id) REFERENCES houses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_boarding_id (boarding_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_requested_date (requested_date),
  INDEX idx_created_at (created_at)
);

-- ========================================
-- ADDITIONAL INDEXES FOR BETTER PERFORMANCE
-- ========================================
CREATE INDEX idx_reviews_boarding_id ON reviews(boarding_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_visit_requests_boarding_id ON visit_requests(boarding_id);
CREATE INDEX idx_visit_requests_user_id ON visit_requests(user_id);
CREATE INDEX idx_visit_requests_status ON visit_requests(status);
CREATE INDEX idx_visit_requests_date ON visit_requests(requested_date);

-- ========================================
-- SAMPLE DATA FOR TESTING
-- ========================================

-- Insert sample review (uncomment if you have users and houses in your database)
-- INSERT INTO reviews (boarding_id, user_id, rating, title, comment, cleanliness, location, value, amenities) VALUES (
--   1,
--   1,
--   5,
--   'Excellent boarding place!',
--   'Great location, clean rooms, and very friendly owner. Highly recommended for students!',
--   5,
--   5,
--   4,
--   5
-- );

-- Insert sample visit request (uncomment if you have users and houses in your database)
-- INSERT INTO visit_requests (boarding_id, user_id, requested_date, requested_time, message, status) VALUES (
--   1,
--   1,
--   '2024-12-15',
--   '14:00:00',
--   'I would like to visit the property to see the room and discuss the terms.',
--   'pending'
-- );

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- Reviews summary view
CREATE OR REPLACE VIEW reviews_summary AS
SELECT 
  h.id as boarding_id,
  h.title as boarding_title,
  o.name as owner_name,
  COUNT(r.id) as total_reviews,
  AVG(r.rating) as average_rating,
  AVG(r.cleanliness) as avg_cleanliness,
  AVG(r.location) as avg_location,
  AVG(r.value) as avg_value,
  AVG(r.amenities) as avg_amenities
FROM houses h
LEFT JOIN owner o ON h.owner_id = o.id
LEFT JOIN reviews r ON h.id = r.boarding_id
GROUP BY h.id, h.title, o.name
ORDER BY h.created_at DESC;

-- Visit requests summary view
CREATE OR REPLACE VIEW visit_requests_summary AS
SELECT 
  vr.*,
  h.title as boarding_title,
  h.address as boarding_address,
  o.name as owner_name,
  o.contact as owner_phone,
  u.username as user_username,
  u.email as user_email
FROM visit_requests vr
JOIN houses h ON vr.boarding_id = h.id
JOIN owner o ON h.owner_id = o.id
JOIN users u ON vr.user_id = u.id
ORDER BY vr.created_at DESC;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these queries to verify the tables were created successfully

-- Check if tables exist
SHOW TABLES LIKE 'reviews';
SHOW TABLES LIKE 'visit_requests';

-- Check table structure
DESCRIBE reviews;
DESCRIBE visit_requests;

-- Check if views were created
SHOW TABLES LIKE 'reviews_summary';
SHOW TABLES LIKE 'visit_requests_summary';

-- Check indexes
SHOW INDEX FROM reviews;
SHOW INDEX FROM visit_requests;

PRINT '✅ Migration completed successfully!';
PRINT '✅ Reviews and Visit Requests tables created';
PRINT '✅ Indexes and views created';
PRINT '✅ Ready to use the new review and visit request functionality';
