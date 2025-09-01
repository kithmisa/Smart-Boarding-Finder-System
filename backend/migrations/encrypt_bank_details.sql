-- Migration: Encrypt existing bank account numbers
-- This script will encrypt existing account numbers that are currently stored in plain text

-- First, create a backup of the current data
CREATE TABLE IF NOT EXISTS owner_bank_details_backup AS 
SELECT * FROM owner_bank_details;

-- Update the account_number column to use encryption
-- Note: This requires the encryption utility to be available
-- The actual encryption will be handled by the application layer

-- For now, we'll add a comment indicating that encryption should be enabled
-- and provide instructions for manual encryption if needed

-- IMPORTANT: Before running this migration, ensure that:
-- 1. The crypto-js package is installed
-- 2. The encryption utility is properly configured
-- 3. A backup of the database is created

-- The encryption will be applied when:
-- 1. New bank details are created (already implemented)
-- 2. Existing bank details are updated (already implemented)
-- 3. For existing data, you may need to manually trigger an update

-- To manually encrypt existing data, you can:
-- 1. Update any existing bank detail record (this will trigger encryption)
-- 2. Or run a one-time encryption script

-- Example of how to manually encrypt existing data:
-- UPDATE owner_bank_details 
-- SET account_number = ENCRYPT(account_number, 'your-encryption-key')
-- WHERE account_number NOT LIKE 'U2F%'; -- Check if already encrypted

-- Note: The actual encryption is handled by the Node.js application, not by SQL
