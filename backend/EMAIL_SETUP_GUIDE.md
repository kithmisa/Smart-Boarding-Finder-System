# 🚨 Email Notification Setup Guide

## ❌ **Why Emails Aren't Working**

The visit request email notifications are failing because:

1. **Missing `.env` file** - Database connection fails
2. **Empty `owner_id` fields** - Houses table doesn't know which owner to notify
3. **Missing database credentials** - Can't connect to database

## 🔧 **Step-by-Step Fix**

### **Step 1: Create .env file**

Create a file named `.env` (exactly that, with the dot) in your `backend/` folder:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=smart_boarding_finder
DB_PORT=3306

# Email Configuration (for Gmail)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_here

# Server Configuration
PORT=5000
```

**Replace the values with your actual:**
- `your_mysql_password_here` → Your MySQL root password
- `your_gmail_address@gmail.com` → Your Gmail address
- `your_gmail_app_password_here` → Your Gmail app password (not regular password)

### **Step 2: Link Houses with Owners**

The houses table has an `owner_id` field, but it's empty. You need to populate it:

```sql
-- First, check what owners you have
SELECT * FROM owner;

-- Check what houses you have
SELECT id, title, owner_id FROM houses;

-- Link houses with owners (replace with your actual data)
UPDATE houses SET owner_id = 1 WHERE id = 1;  -- House 1 → Owner 1
UPDATE houses SET owner_id = 1 WHERE id = 2;  -- House 2 → Owner 1
UPDATE houses SET owner_id = 2 WHERE id = 3;  -- House 3 → Owner 2

-- Verify the linking
SELECT h.id, h.title, h.owner_id, o.name as owner_name, o.email
FROM houses h
LEFT JOIN owner o ON h.owner_id = o.id;
```

### **Step 3: Test the Setup**

1. **Restart your backend server** after creating the .env file
2. **Submit a visit request** from the frontend
3. **Check the backend console** for detailed logs
4. **Check your email** for the notification

## 📧 **How Email Notifications Work**

### **When User Submits Visit Request:**
1. System finds the house by `boardingId`
2. System gets the `owner_id` from the house
3. System finds the owner's email from the `owner` table
4. System sends email to owner using `sendVisitRequestNotification`

### **When Owner Confirms/Rejects:**
1. System finds the user's email from the `users` table
2. System sends email to user using `sendVisitResponseNotification`

## 🔍 **Debugging Commands**

### **Check Database Connection:**
```bash
cd backend
node test_db_connection.js
```

### **Check Owners and Houses:**
```bash
cd backend
node check_owners_and_houses.js
```

### **Check Email Service:**
The email service will now log detailed information when you submit visit requests.

## ✅ **Expected Results**

After fixing:

1. **Visit Request Submission:**
   - Owner gets email with student details, requested date/time
   - Owner gets notification in their dashboard

2. **Owner Response:**
   - User gets email with confirmation/rejection details
   - User gets notification in their profile

## 🚨 **Common Issues**

### **"Access denied for user 'root'@'localhost'"**
- Check your MySQL password in .env file
- Make sure MySQL is running

### **"No owner found with ID: null"**
- The `owner_id` field in houses table is empty
- Run the SQL commands to link houses with owners

### **"Email sent successfully: false"**
- Check your Gmail credentials in .env file
- Make sure you're using an app password, not your regular password

## 📞 **Need Help?**

If you still have issues after following this guide:

1. Check the backend console for error messages
2. Verify your .env file has correct credentials
3. Make sure all houses have valid `owner_id` values
4. Test the database connection first







