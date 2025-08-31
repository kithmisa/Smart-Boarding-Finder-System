-- Update Houses Table with Owner Information
-- This script will help you link existing houses with owners

-- ========================================
-- STEP 1: Add missing columns to houses table
-- ========================================

-- Add owner_id column if it doesn't exist
ALTER TABLE houses ADD COLUMN IF NOT EXISTS owner_id INT;

-- Add status column if it doesn't exist
ALTER TABLE houses ADD COLUMN IF NOT EXISTS status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available';

-- Add updated_at column if it doesn't exist
ALTER TABLE houses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- ========================================
-- STEP 2: Link houses with owners (you need to do this manually)
-- ========================================

-- Example: If you know which house belongs to which owner, run these:
-- UPDATE houses SET owner_id = 1 WHERE id = 1;  -- House 1 belongs to Owner 1
-- UPDATE houses SET owner_id = 1 WHERE id = 2;  -- House 2 belongs to Owner 1
-- UPDATE houses SET owner_id = 2 WHERE id = 3;  -- House 3 belongs to Owner 2

-- ========================================
-- STEP 3: Add foreign key constraint
-- ========================================

-- Add foreign key constraint for owner_id
-- Note: This will fail if you have houses without valid owner_id values
-- Make sure all houses have valid owner_id values before running this

-- First, check if there are any houses without owner_id
SELECT id, title FROM houses WHERE owner_id IS NULL;

-- If all houses have owner_id, then add the constraint:
-- ALTER TABLE houses ADD CONSTRAINT fk_houses_owner FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE SET NULL;

-- ========================================
-- STEP 4: Verify the changes
-- ========================================

-- Check the updated table structure
DESCRIBE houses;

-- Check houses with owner information
SELECT h.id, h.title, h.owner_id, o.name as owner_name, o.contact as owner_phone
FROM houses h
LEFT JOIN owner o ON h.owner_id = o.id;

-- ========================================
-- IMPORTANT NOTES:
-- ========================================
-- 1. You need to manually assign owner_id values to your existing houses
-- 2. Make sure the owner_id values exist in your owner table
-- 3. Only add the foreign key constraint after all houses have valid owner_id values
-- 4. If you don't have owner information for some houses, you can leave owner_id as NULL

-- Example manual updates (replace with your actual data):
-- UPDATE houses SET owner_id = 1 WHERE id IN (1, 2, 3);
-- UPDATE houses SET owner_id = 2 WHERE id IN (4, 5);







