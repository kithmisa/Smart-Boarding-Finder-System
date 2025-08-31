# 🎯 Setup Guide for Your Database Structure

This guide is specifically tailored to your existing database structure.

## 📊 Your Current Tables

### Houses Table
```sql
CREATE TABLE houses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  roomType VARCHAR(50) NOT NULL,
  genderAllowed VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  highlights TEXT,
  shortTerm BOOLEAN DEFAULT FALSE,
  pricePerNight DECIMAL(10,2) DEFAULT 0,
  description TEXT,
  features TEXT,
  shortFeatures TEXT,
  images TEXT, -- Comma separated filenames stored
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Owner Table
```sql
CREATE TABLE owner (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  nic VARCHAR(20) UNIQUE NOT NULL,
  contact VARCHAR(20) NOT NULL
);
```

## 🚀 Step-by-Step Setup

### Step 1: Run the Data Migration Script
First, run the script to add missing columns to your houses table:

```bash
mysql -u your_username -p your_database < backend/migrations/update_houses_with_owners.sql
```

### Step 2: Link Your Houses with Owners
You need to manually link your existing houses with owners. Run these queries in your MySQL client:

```sql
-- First, see what owners you have
SELECT * FROM owner;

-- Then, see what houses you have
SELECT * FROM houses;

-- Now link houses with owners (replace with your actual data)
-- Example:
UPDATE houses SET owner_id = 1 WHERE id = 1;  -- House 1 belongs to Owner 1
UPDATE houses SET owner_id = 1 WHERE id = 2;  -- House 2 belongs to Owner 1
UPDATE houses SET owner_id = 2 WHERE id = 3;  -- House 3 belongs to Owner 2

-- Check the result
SELECT h.id, h.title, h.owner_id, o.name as owner_name, o.contact as owner_phone
FROM houses h
LEFT JOIN owner o ON h.owner_id = o.id;
```

### Step 3: Create the New Tables
Now run the main migration to create reviews and visit requests tables:

```bash
mysql -u your_username -p your_database < backend/migrations/create_reviews_and_visits.sql
```

### Step 4: Add Foreign Key Constraint (Optional)
After all houses are linked with owners, you can add the foreign key constraint:

```sql
ALTER TABLE houses ADD CONSTRAINT fk_houses_owner FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE SET NULL;
```

## 🔧 Testing the Setup

### Test 1: Check Tables Created
```sql
SHOW TABLES LIKE 'reviews';
SHOW TABLES LIKE 'visit_requests';
```

### Test 2: Check Views Created
```sql
SHOW TABLES LIKE 'reviews_summary';
SHOW TABLES LIKE 'visit_requests_summary';
```

### Test 3: Test API Endpoints
```bash
# Test reviews endpoint
curl http://localhost:5000/api/reviews/boarding/1

# Test visit requests endpoint
curl http://localhost:5000/api/visit-requests/boarding/1
```

## 🚨 Important Notes for Your Setup

1. **Owner Linking Required**: You must link your existing houses with owners before the system will work properly
2. **No Automatic Owner Assignment**: The system can't automatically determine which house belongs to which owner
3. **Optional Foreign Key**: You can skip the foreign key constraint if you prefer flexibility
4. **Owner Information**: The system will display owner name and contact from your `owner` table

## 📝 Example Data Setup

If you want to test with sample data, first create some owners and houses:

```sql
-- Insert sample owners
INSERT INTO owner (name, email, nic, contact) VALUES 
('John Silva', 'john@email.com', '123456789V', '+94 71 234 5678'),
('Mary Perera', 'mary@email.com', '987654321V', '+94 77 123 4567');

-- Insert sample houses (if you don't have any)
INSERT INTO houses (title, roomType, genderAllowed, price, address, city, type, location, owner_id) VALUES 
('Cozy Room Near University', 'single', 'both', 25000.00, '123 University Road', 'Colombo', 'house', 'Borella', 1),
('Student-Friendly Apartment', 'shared', 'both', 20000.00, '456 Student Street', 'Colombo', 'apartment', 'Nugegoda', 2);

-- Now you can test the new features!
```

## 🎯 What This Enables

After setup, you'll have:
- ✅ Users can rate and review boarding places
- ✅ Users can request visits to properties
- ✅ Owners can manage visit requests
- ✅ Complete review system with detailed ratings
- ✅ Visit scheduling with owner confirmation

## 🔍 Troubleshooting

### Issue: "Unknown column 'h.owner_name'"
**Solution**: You need to link houses with owners first. Run the data migration script.

### Issue: Foreign key constraint fails
**Solution**: Make sure all houses have valid `owner_id` values before adding the constraint.

### Issue: Views don't work
**Solution**: Check that the `owner` table has data and houses are linked with owners.

---

**🎯 Follow these steps and your system will work perfectly with your existing database structure!**







