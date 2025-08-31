-- ========================================
-- NOTIFICATIONS TABLE FOR VISIT REQUESTS
-- ========================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
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

-- ========================================
-- SAMPLE NOTIFICATIONS (UNCOMMENT TO INSERT)
-- ========================================

-- Sample notification for visit request
/*
INSERT INTO notifications (user_id, owner_id, boarding_id, visit_request_id, type, title, message) VALUES 
(1, 1, 1, 1, 'visit_request', 'New Visit Request', 'Student Kamal Perera has requested to visit your property "Cozy Room Near University" on 2024-12-20 at 14:00.');
*/







