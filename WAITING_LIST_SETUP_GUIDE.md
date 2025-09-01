# 🚀 Waiting List Feature Setup Guide

## ✨ **Feature Overview**
The waiting list feature allows users to join a queue for unavailable properties and get notified when they become available. This gives users priority access and helps property owners manage demand.

## 🗄️ **Database Setup**

### 1. Create the waiting_list table
Run the SQL migration file:
```sql
-- Run this in your MySQL database
source backend/migrations/create_waiting_list.sql
```

### 2. Table Structure
The `waiting_list` table includes:
- `id`: Unique identifier
- `house_id`: Reference to the property
- `user_id`: Reference to the user
- `name`: User's full name
- `email`: User's email address
- `phone`: User's phone number (optional)
- `message`: Additional message (optional)
- `joined_at`: When they joined the list
- `notified_at`: When they were notified
- `status`: Current status (waiting/notified/removed)

## 🔧 **Backend Setup**

### 1. New Routes Added
- `POST /api/waiting-list/join` - Join waiting list
- `POST /api/waiting-list/leave` - Leave waiting list
- `GET /api/waiting-list/check/:houseId` - Check if user is on list
- `GET /api/waiting-list/house/:houseId` - Get waiting list for a house

### 2. Automatic Notifications
When a property becomes available:
- All users on the waiting list are automatically notified
- Their status is updated to "notified"
- Console logs show notification details
- Future enhancement: Email notifications

### 3. Files Modified
- `backend/routes/waitingListRoutes.js` - New waiting list routes
- `backend/routes/houseRoutes.js` - Added notification logic
- `backend/server.js` - Registered waiting list routes

## 🎨 **Frontend Features**

### 1. Enhanced Availability Display
- **Prominent red banner** for unavailable properties
- **Availability date** clearly shown
- **Waiting list count** displayed
- **Join/Leave waiting list** buttons

### 2. Waiting List Form
- **Pre-filled user information** (if logged in)
- **Required fields**: Name, Email
- **Optional fields**: Phone, Message
- **Form validation** and error handling

### 3. User Experience
- **Real-time status updates**
- **Clear feedback messages**
- **Responsive design**
- **Accessibility features**

## 🚀 **How to Test**

### 1. Setup Database
```bash
# Run the migration
mysql -u root -p smartbo < backend/migrations/create_waiting_list.sql

# Test the setup
node backend/test_waiting_list.js
```

### 2. Test the Feature
1. **Set a property to unavailable** in HouseDetails
2. **Visit the property details page**
3. **Click "Join Waiting List" button**
4. **Fill out the form and submit**
5. **Verify user is added to list**
6. **Set property back to available**
7. **Check console for notifications**

### 3. Test Scenarios
- ✅ Join waiting list as logged-in user
- ✅ Join waiting list as guest (should prompt login)
- ✅ Leave waiting list
- ✅ Multiple users joining same property
- ✅ Property becoming available triggers notifications
- ✅ Duplicate join prevention

## 🔍 **API Endpoints Reference**

### Join Waiting List
```http
POST /api/waiting-list/join
Content-Type: application/json

{
  "houseId": 123,
  "userId": 456,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Interested in this property"
}
```

### Leave Waiting List
```http
POST /api/waiting-list/leave
Content-Type: application/json

{
  "houseId": 123,
  "userId": 456
}
```

### Check Status
```http
GET /api/waiting-list/check/123?userId=456
```

### Get House Waiting List
```http
GET /api/waiting-list/house/123
```

## 🎯 **Future Enhancements**

### 1. Email Notifications
- Send emails when properties become available
- Include property details and booking links
- Customizable email templates

### 2. SMS Notifications
- Text message alerts for urgent availability
- Phone number verification
- Opt-in/opt-out preferences

### 3. Priority System
- First-come-first-served queue
- VIP user priority
- Owner preference settings

### 4. Analytics Dashboard
- Waiting list statistics
- Popular properties
- User engagement metrics

## 🐛 **Troubleshooting**

### Common Issues

#### 1. Table Not Found
```bash
# Solution: Run the migration
mysql -u root -p smartbo < backend/migrations/create_waiting_list.sql
```

#### 2. Foreign Key Errors
```bash
# Check if houses and users tables exist
SHOW TABLES;
DESCRIBE houses;
DESCRIBE users;
```

#### 3. Route Not Found
```bash
# Check if routes are registered in server.js
# Verify waitingListRoutes is imported and used
```

#### 4. Form Not Submitting
```bash
# Check browser console for errors
# Verify API endpoint is accessible
# Check database connection
```

### Debug Commands
```bash
# Test database connection
node backend/test_waiting_list.js

# Check server logs
tail -f backend/server.log

# Test API endpoints
curl -X POST http://localhost:5000/api/waiting-list/join \
  -H "Content-Type: application/json" \
  -d '{"houseId":1,"userId":1,"name":"Test","email":"test@test.com"}'
```

## 📱 **User Interface Screenshots**

### Unavailable Property View
- Red banner with "Property Currently Unavailable"
- Availability date prominently displayed
- "Join Waiting List" button
- Current waiting list count

### Waiting List Form
- Clean modal design
- Pre-filled user information
- Form validation
- Success/error feedback

### User Status
- "You're on the waiting list!" confirmation
- "Leave List" button option
- Real-time status updates

## 🎉 **Success Indicators**

✅ **Database**: `waiting_list` table created successfully  
✅ **Backend**: All API endpoints responding  
✅ **Frontend**: Waiting list UI displaying correctly  
✅ **Functionality**: Users can join/leave lists  
✅ **Notifications**: Automatic alerts working  
✅ **User Experience**: Smooth, intuitive interface  

---

**🎯 The waiting list feature is now fully integrated and ready to enhance user engagement for unavailable properties!**
