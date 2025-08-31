# Authentication System Setup Guide

This guide will help you set up the complete authentication system with email verification (OTP) for the Smart Boarding Finder System.

## 🚀 Quick Start

### 1. Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the `backend` folder with:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=smart_boarding_finder
   DB_PORT=3306

   # Email Configuration (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

3. **Set up database:**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE smart_boarding_finder;
   USE smart_boarding_finder;
   
   # Run the schema
   source database_schema.sql;
   ```

4. **Run database migration:**
   ```bash
   node setup_database.js
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. **Install dependencies:**
   ```bash
   cd ../
   npm install
   ```

2. **Start the frontend:**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this password in your `.env` file

### Database Setup

The system now supports:
- ✅ Email verification required before login
- ✅ No unique constraints on username/email (allows duplicates)
- ✅ OTP-based verification system
- ✅ Secure password hashing with bcrypt

## 🧪 Testing

### Test OTP Flow

1. **Start the backend server**
2. **Run the test script:**
   ```bash
   cd backend
   node test_otp.js
   ```

### Manual Testing

1. Open the frontend in your browser
2. Try to create a new account
3. Check your email for the OTP
4. Enter the OTP to verify your account
5. Try logging in

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to load resource: 400 Bad Request"**
   - Check that the backend server is running
   - Verify the OTP was sent successfully
   - Check the backend console for error logs

2. **"No OTP found"**
   - The OTP might have expired (10 minutes)
   - Try requesting a new OTP
   - Check the debug endpoint: `GET /api/auth/debug-otp`

3. **Database connection errors**
   - Verify MySQL is running
   - Check your `.env` file credentials
   - Ensure the database exists

4. **Email not sending**
   - Check Gmail app password
   - Verify EMAIL_USER and EMAIL_PASS in `.env`
   - Check Gmail security settings

### Debug Endpoints

- `GET /api/auth/debug-otp` - View current OTP storage state
- Check backend console for detailed logging

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### OTP Verification
- `POST /api/auth/send-otp` - Send verification OTP
- `POST /api/auth/verify-otp` - Verify OTP code

## 🔒 Security Features

- **Email Verification Required**: Users cannot login without verifying their email
- **OTP Expiration**: OTPs expire after 10 minutes
- **Attempt Limiting**: Maximum 3 failed OTP attempts
- **Secure Password Storage**: Passwords are hashed using bcrypt
- **No Unique Constraints**: Allows multiple accounts with same email/username

## 📝 Notes

- The system uses in-memory OTP storage (not persistent across server restarts)
- For production, consider using Redis or database for OTP storage
- Remove debug endpoints before deploying to production
- The `email_verified` field is automatically set to `TRUE` when OTP is verified

## 🚀 Next Steps

1. Test the complete flow
2. Customize email templates if needed
3. Add additional security features (rate limiting, etc.)
4. Deploy to production environment
