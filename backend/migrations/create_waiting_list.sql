-- Create waiting_list table
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

-- Add some sample data for testing (optional)
-- INSERT INTO waiting_list (house_id, user_id, name, email, phone, message) VALUES 
-- (1, 1, 'John Doe', 'john@example.com', '+1234567890', 'Interested in this property'),
-- (1, 2, 'Jane Smith', 'jane@example.com', '+0987654321', 'Please notify me when available');
