CREATE database smartbo;

USE smartbo;






CREATE TABLE  users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('user', 'owner', 'admin') DEFAULT 'user',
  status ENUM('active', 'inactive', 'banned') DEFAULT 'inactive',
  email_verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_reset_token (reset_token),
  INDEX idx_email_verified (email_verified)
);

CREATE TABLE owner (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nic VARCHAR(20) NOT NULL UNIQUE,
    contact VARCHAR(20) NOT NULL
);

ALTER TABLE owner MODIFY COLUMN nic VARCHAR(255) NOT NULL;

CREATE TABLE owner_bank_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    account_holder_name VARCHAR(100) NOT NULL,
    account_type ENUM('savings', 'current', 'fixed_deposit') NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    branch_name VARCHAR(100) NOT NULL,
    branch_code VARCHAR(10) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE CASCADE
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
INSERT INTO admins (username, password) VALUES ('admin1', 'admin123');

CREATE TABLE houses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    roomType VARCHAR(50) NOT NULL,
    genderAllowed VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    highlights TEXT,
    shortTerm TINYINT(1) DEFAULT 0,
    pricePerNight DECIMAL(10,2),
    description TEXT,
    features TEXT,
    shortFeatures TEXT,
    images TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    availabilityStatus VARCHAR(20) DEFAULT 'available',
    availableDate DATE,
    owner_id INT NOT NULL,
    bookingStatus VARCHAR(50) DEFAULT 'available',
    status VARCHAR(20) DEFAULT 'pending',
    confirmed TINYINT(1) DEFAULT 0,
    confirmed_at TIMESTAMP NULL,
    rejection_reason TEXT,
    approved_by INT,
    FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES admins(id) ON DELETE SET NULL
);


CREATE TABLE contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  comments TEXT NOT NULL,
  reply TEXT,
  replied BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE INDEX idx_houses_owner_id ON houses(owner_id);
CREATE INDEX idx_houses_status ON houses(status);
CREATE INDEX idx_houses_availability ON houses(availabilityStatus);
CREATE INDEX idx_houses_city ON houses(city);
CREATE INDEX idx_houses_room_type ON houses(roomType);
CREATE INDEX idx_owner_bank_details_owner_id ON owner_bank_details(owner_id);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_owner_email ON owner(email);
CREATE INDEX idx_owner_nic ON owner(nic);





CREATE TABLE reviews (
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

CREATE TABLE visit_requests (
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

CREATE INDEX idx_reviews_boarding_id ON reviews(boarding_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_visit_requests_boarding_id ON visit_requests(boarding_id);
CREATE INDEX idx_visit_requests_user_id ON visit_requests(user_id);
CREATE INDEX idx_visit_requests_status ON visit_requests(status);
CREATE INDEX idx_visit_requests_date ON visit_requests(requested_date);

CREATE OR REPLACE VIEW reviews_summary AS
SELECT 
  h.id as boarding_id,
  h.title as boarding_title,
  COUNT(r.id) as total_reviews,
  AVG(r.rating) as average_rating,
  AVG(r.cleanliness) as avg_cleanliness,
  AVG(r.location) as avg_location,
  AVG(r.value) as avg_value,
  AVG(r.amenities) as avg_amenities
FROM houses h
LEFT JOIN reviews r ON h.id = r.boarding_id
GROUP BY h.id, h.title
ORDER BY h.created_at DESC;

-- Visit requests summary view
CREATE OR REPLACE VIEW visit_requests_summary AS
SELECT 
  vr.*,
  h.title as boarding_title,
  h.address as boarding_address,
  h.owner_name,
  h.owner_phone,
  u.username as user_username,
  u.email as user_email
FROM visit_requests vr
JOIN houses h ON vr.boarding_id = h.id
JOIN users u ON vr.user_id = u.id
ORDER BY vr.created_at DESC;


-- Create notifications table
CREATE TABLE  notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  owner_id INT NOT NULL,
  boarding_id INT NOT NULL,
  visit_request_id INT NOT NULL,
  type ENUM('visit_request', 'visit_confirmed', 'visit_rejected', 'visit_cancelled') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE CASCADE,
  FOREIGN KEY (boarding_id) REFERENCES houses(id) ON DELETE CASCADE,
  FOREIGN KEY (visit_request_id) REFERENCES visit_requests(id) ON DELETE CASCADE,
  
  INDEX idx_user_id (user_id),
  INDEX idx_owner_id (owner_id),
  INDEX idx_boarding_id (boarding_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

SELECT h.id, h.title, h.owner_id, o.name as owner_name, o.email
FROM houses h
LEFT JOIN owner o ON h.owner_id = o.id;

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  house_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE,
  
  -- Ensure a user can only favorite a house once
  UNIQUE KEY unique_user_house (user_id, house_id),
  
  -- Indexes for better performance
  INDEX idx_user_id (user_id),
  INDEX idx_house_id (house_id),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS waiting_list (
  id INT AUTO_INCREMENT PRIMARY KEY,
  house_id INT NOT NULL,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified_at TIMESTAMP NULL,
  status ENUM('waiting', 'notified', 'removed') DEFAULT 'waiting',
  
  -- Foreign key constraints
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Indexes for better performance
  INDEX idx_house_id (house_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_joined_at (joined_at),
  
  -- Unique constraint to prevent duplicate entries
  UNIQUE KEY unique_house_user (house_id, user_id)
);

CREATE TABLE website_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL, -- NULL for anonymous ratings
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  ip_address VARCHAR(45), -- Store IP for anonymous ratings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at),
  INDEX idx_user_id (user_id)
);

select* from website_ratings_summary;
-- Create view for website rating summary
CREATE OR REPLACE VIEW website_ratings_summary AS
SELECT 
  COUNT(*) as total_ratings,
  AVG(rating) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
FROM website_ratings;

ALTER TABLE owner 
ADD COLUMN password VARCHAR(255) NOT NULL AFTER contact,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER password,
ADD COLUMN last_login TIMESTAMP NULL AFTER is_active,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER last_login,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

CREATE TABLE IF NOT EXISTS booking_stay (
  id INT AUTO_INCREMENT PRIMARY KEY,
  house_id INT NOT NULL,
  user_id INT NOT NULL,
  owner_id INT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  advance_payment DECIMAL(10,2) NOT NULL,
  service_charge DECIMAL(10,2) NOT NULL,
  total_payment DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'rejected', 'cancelled', 'completed') DEFAULT 'pending',
  check_in_time TIME NULL,
  check_out_time TIME NULL,
  rejection_reason TEXT NULL,
  payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  rejected_at TIMESTAMP NULL,
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE CASCADE,
  INDEX idx_house_id (house_id),
  INDEX idx_user_id (user_id),
  INDEX idx_owner_id (owner_id),
  INDEX idx_status (status)
);
ALTER TABLE booking_stay 
ADD COLUMN payment_method VARCHAR(50) NULL;

ALTER TABLE booking_stay
  ADD COLUMN owner_message TEXT NULL AFTER special_requests;

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
  status VARCHAR(32) NOT NULL,              -- e.g., 'completed'
  payment_method VARCHAR(32) NOT NULL,      -- e.g., 'manual'
  transaction_id VARCHAR(64) NULL,
  notes TEXT NULL,
  type VARCHAR(32) NOT NULL,                -- 'listing_fee' | 'booking'
  booking_id INT NULL,
  house_id INT NULL,
  owner_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE houses
  ADD COLUMN  googleMapsUrl VARCHAR(2048) NULL AFTER location;


