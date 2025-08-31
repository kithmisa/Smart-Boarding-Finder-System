-- Migration script to set up contact_messages table for admin dashboard
-- Run this script to ensure the table exists with all required fields

-- Create contact_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  comments TEXT NOT NULL,
  reply TEXT,
  replied BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_replied (replied),
  INDEX idx_created_at (created_at)
);

-- Add missing fields if table exists but fields are missing
-- Add reply field if it doesn't exist
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS reply TEXT AFTER comments;

-- Add replied field if it doesn't exist
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS replied BOOLEAN DEFAULT FALSE AFTER reply;

-- Add replied_at field if it doesn't exist
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP NULL AFTER replied;

-- Add updated_at field if it doesn't exist
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER replied_at;

-- Update existing records to set replied = FALSE if NULL
UPDATE contact_messages SET replied = FALSE WHERE replied IS NULL;

-- Show table structure
DESCRIBE contact_messages;



