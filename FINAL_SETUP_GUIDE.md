# 🏠 Smart Boarding Finder System - Complete Setup Guide

## 🎯 What's New

This update adds comprehensive functionality for:
- **Owner Dashboard**: Manage properties, visit requests, and notifications
- **User Profile**: View visit requests and notifications
- **Email Notifications**: Automatic emails for visit request updates
- **Enhanced Visit Scheduling**: Owner confirmation/rejection with messaging
- **Notification System**: Real-time updates for both users and owners

## 🗄️ Database Setup

### 1. Run the Complete Database Schema
```sql
-- Execute this file to set up all tables and views
source backend/migrations/create_reviews_and_visits.sql
```

### 2. Update Existing Houses Table
```sql
-- Add new columns to existing houses table
source backend/migrations/update_houses_with_owners.sql
```

### 3. Link Houses with Owners
```sql
-- Manually link existing houses to owners
UPDATE houses SET owner_id = 1 WHERE id = 1; -- Replace with actual IDs
UPDATE houses SET owner_id = 2 WHERE id = 2;
-- Continue for all houses...
```

## 🚀 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Email (Optional)
Copy `email-config.example` to `.env` and configure:
```bash
# For Gmail:
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in .env

### 3. Start Backend Server
```bash
npm start
```

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
npm install lucide-react
```

### 2. New Components Added
- `src/components/OwnerDashboard.jsx` - Owner management interface
- `src/components/UserProfile.jsx` - User visit requests & notifications

### 3. Updated Components
- `src/components/HouseDetails.jsx` - Integrated owner dashboard
- `src/components/BoardingDetail.js` - Enhanced with reviews & visit scheduling

## 🔧 API Endpoints

### Visit Requests
- `POST /api/visit-requests` - Submit visit request
- `GET /api/visit-requests/user/:userId` - Get user's requests
- `GET /api/visit-requests/owner/:ownerId` - Get owner's requests
- `PUT /api/visit-requests/:id/respond` - Owner responds to request
- `PUT /api/visit-requests/:id/cancel` - Cancel request

### Reviews
- `GET /api/reviews/boarding/:boardingId` - Get reviews for property
- `POST /api/reviews` - Submit review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Notifications
- `GET /api/notifications/user/:userId` - Get user notifications
- `GET /api/notifications/owner/:ownerId` - Get owner notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Houses
- `GET /api/houses/owner/:ownerId` - Get owner's properties
- `POST /api/houses` - Add new property
- `PUT /api/houses/:id` - Update property
- `DELETE /api/houses/:id` - Delete property

## 🎭 How It Works

### 1. Visit Request Flow
1. **User** submits visit request with date/time and message
2. **System** creates notification for owner
3. **Owner** receives email notification
4. **Owner** responds (confirm/reject) with message
5. **User** receives email notification and in-app update

### 2. Owner Dashboard
- **My Listings**: Add, edit, delete properties
- **Visit Requests**: Respond to pending requests
- **Notifications**: View all system notifications

### 3. User Profile
- **Visit Requests**: Track all requests and responses
- **Notifications**: View owner responses and updates

## 🧪 Testing

### 1. Test Visit Request
```bash
# Submit visit request
curl -X POST http://localhost:5000/api/visit-requests \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "boardingId": 1,
    "requestedDate": "2024-01-15",
    "requestedTime": "14:00",
    "message": "I would like to visit this property"
  }'
```

### 2. Test Owner Response
```bash
# Owner responds to request
curl -X PUT http://localhost:5000/api/visit-requests/1/respond \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "ownerResponse": "Great! See you at 2 PM",
    "confirmedDate": "2024-01-15",
    "confirmedTime": "14:00"
  }'
```

## 🐛 Troubleshooting

### Common Issues

1. **"Unknown column 'owner_id'"**
   - Run the database migration scripts
   - Ensure houses table has owner_id column

2. **Email not sending**
   - Check .env configuration
   - Verify Gmail App Password
   - Check console for email errors

3. **Owner dashboard not showing**
   - Verify owner_id is set in navigation state
   - Check browser console for errors

4. **Visit requests not loading**
   - Ensure database tables exist
   - Check API endpoint responses

### Debug Commands
```bash
# Check database tables
SHOW TABLES;

# Verify houses structure
DESCRIBE houses;

# Check visit requests
SELECT * FROM visit_requests;

# Check notifications
SELECT * FROM notifications;
```

## 📱 Frontend Features

### Owner Dashboard
- **Property Management**: CRUD operations for listings
- **Visit Requests**: Respond to student requests
- **Real-time Updates**: Live notification counts
- **Responsive Design**: Works on all devices

### User Profile
- **Request Tracking**: View all visit requests
- **Status Updates**: Real-time status changes
- **Owner Messages**: View detailed responses
- **Easy Cancellation**: Cancel pending requests

## 🔐 Security Features

- **Owner Verification**: Only property owners can manage listings
- **User Authorization**: Users can only see their own requests
- **Input Validation**: All forms validated server-side
- **SQL Injection Protection**: Parameterized queries

## 🚀 Next Steps

1. **Test all functionality** with sample data
2. **Configure email settings** for production
3. **Customize UI/UX** as needed
4. **Add more features** like:
   - Property image uploads
   - Advanced search filters
   - Payment integration
   - Chat system

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify database connections
3. Test API endpoints individually
4. Review this setup guide

---

**🎉 Congratulations!** Your Smart Boarding Finder System now has a complete owner-user interaction system with email notifications!







