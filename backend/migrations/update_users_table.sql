-- Migration to update users table
-- Remove unique constraints and add email_verified field

-- Drop existing unique constraints
ALTER TABLE users DROP INDEX idx_email;
ALTER TABLE users DROP INDEX idx_username;

-- Add email_verified field if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Update default status to inactive for new users
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'inactive';

-- Recreate indexes without unique constraints
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email_verified ON users(email_verified);

-- Update existing users to have email_verified = TRUE (assuming they were created before this change)
UPDATE users SET email_verified = TRUE WHERE email_verified IS NULL;
UPDATE users SET status = 'active' WHERE status = 'inactive' AND email_verified = TRUE;

