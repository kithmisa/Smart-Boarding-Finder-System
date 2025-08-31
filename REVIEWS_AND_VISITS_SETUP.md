# 🎯 Reviews & Visit Requests Setup Guide

This guide explains how to set up and use the new **Reviews & Ratings** and **Visit Request Scheduling** features for the Smart Boarding Finder System.

## ✨ New Features Added

### 1. **Reviews & Ratings System**
- Users can rate boarding places (1-5 stars)
- Detailed rating categories: Cleanliness, Location, Value, Amenities
- Review titles and comments
- One review per user per boarding place
- Average rating calculations

### 2. **Visit Request Scheduling**
- Users can request visits to boarding places
- Owners can confirm/reject visit requests
- Scheduled visit management
- No payment required for visits

## 🗄️ Database Setup

### Step 1: Run the Migration
Execute the SQL migration file to create the new tables:

```bash
# Option 1: Run directly in MySQL
mysql -u your_username -p your_database < backend/migrations/create_reviews_and_visits.sql

# Option 2: Copy and paste the SQL into your MySQL client
```

### Step 2: Verify Tables Created
Run these queries to confirm setup:

```sql
-- Check tables exist
SHOW TABLES LIKE 'reviews';
SHOW TABLES LIKE 'visit_requests';

-- Check table structure
DESCRIBE reviews;
DESCRIBE visit_requests;
```

## 🚀 Backend Setup

### Step 1: New Route Files
The following route files have been created:
- `backend/routes/reviewRoutes.js` - Handles all review operations
- `backend/routes/visitRequestRoutes.js` - Handles visit request operations

### Step 2: Server Configuration
The routes are already added to `server.js`:
```javascript
app.use('/api/reviews', reviewRoutes);
app.use('/api/visit-requests', visitRequestRoutes);
```

### Step 3: API Endpoints Available

#### Reviews API
```
GET    /api/reviews/boarding/:boardingId     - Get reviews for a boarding place
POST   /api/reviews                          - Submit a new review
PUT    /api/reviews/:reviewId                - Update a review
DELETE /api/reviews/:reviewId                - Delete a review
GET    /api/reviews/boarding/:boardingId/stats - Get review statistics
```

#### Visit Requests API
```
POST   /api/visit-requests                   - Submit visit request
GET    /api/visit-requests/boarding/:boardingId - Get requests for a boarding place
GET    /api/visit-requests/user/:userId      - Get user's visit requests
PUT    /api/visit-requests/:requestId/respond - Owner responds to request
PUT    /api/visit-requests/:requestId/cancel - User cancels request
GET    /api/visit-requests/boarding/:boardingId/stats - Get request statistics
GET    /api/visit-requests/boarding/:boardingId/upcoming - Get upcoming visits
```

## 🎨 Frontend Updates

### Step 1: Image Gallery Height Increased
- Main image height: `h-96` → `h-[500px]` (increased from 384px to 500px)
- Navbar gap: `pt-32` → `pt-40` (increased from 128px to 160px)

### Step 2: Visit Request System
- Updated visit booking to use new API endpoint
- Added helpful information about how visits work
- Better user experience with clear instructions

### Step 3: Reviews System
- Complete review submission modal
- Rating display with stars
- Review statistics and breakdowns
- User-friendly review management

## 🔧 How to Use

### For Users (Tenants)

#### Submitting a Review
1. Navigate to a boarding place detail page
2. Scroll to the "Reviews & Ratings" section
3. Click "Write a Review"
4. Rate the property (overall + detailed categories)
5. Add a title and comment
6. Submit the review

#### Requesting a Visit
1. On the boarding place detail page
2. Select your preferred visit date
3. Click "Request Visit"
4. Wait for owner confirmation
5. Receive email notification when confirmed

### For Owners

#### Managing Visit Requests
1. Login to owner dashboard
2. View pending visit requests
3. Confirm, reject, or suggest alternative times
4. Send responses to users

#### Viewing Reviews
1. Check your property's review section
2. Monitor ratings and feedback
3. Respond to reviews if needed

## 📊 Database Schema

### Reviews Table
```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  boarding_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  cleanliness INT NOT NULL CHECK (cleanliness >= 1 AND cleanliness <= 5),
  location INT NOT NULL CHECK (location >= 1 AND location <= 5),
  value INT NOT NULL CHECK (value >= 1 AND value <= 5),
  amenities INT NOT NULL CHECK (amenities >= 1 AND amenities <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Visit Requests Table
```sql
CREATE TABLE visit_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  boarding_id INT NOT NULL,
  user_id INT NOT NULL,
  requested_date DATE NOT NULL,
  requested_time TIME,
  message TEXT,
  status ENUM('pending', 'confirmed', 'rejected', 'cancelled') DEFAULT 'pending',
  owner_response TEXT,
  confirmed_date DATE,
  confirmed_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Test Review Submission
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "boardingId": 1,
    "userId": 1,
    "rating": 5,
    "title": "Great place!",
    "comment": "Excellent boarding place for students",
    "cleanliness": 5,
    "location": 5,
    "value": 4,
    "amenities": 5
  }'
```

### Test Visit Request
```bash
curl -X POST http://localhost:5000/api/visit-requests \
  -H "Content-Type: application/json" \
  -d '{
    "boardingId": 1,
    "userId": 1,
    "requestedDate": "2024-12-20",
    "message": "I would like to visit this property"
  }'
```

## 🚨 Important Notes

1. **User Authentication Required**: Users must be logged in to submit reviews or request visits
2. **One Review Per User**: Each user can only review a boarding place once
3. **Visit Request Validation**: Dates must be in the future
4. **Owner Confirmation**: Visit requests require owner approval
5. **Database Constraints**: Foreign key relationships ensure data integrity

## 🔍 Troubleshooting

### Common Issues

1. **Tables not created**: Ensure you have proper MySQL permissions
2. **Foreign key errors**: Make sure `houses` and `users` tables exist
3. **API errors**: Check that routes are properly registered in server.js
4. **Frontend issues**: Verify API endpoints match frontend calls

### Debug Commands
```sql
-- Check if tables exist
SHOW TABLES;

-- Check table structure
DESCRIBE reviews;
DESCRIBE visit_requests;

-- Check foreign key constraints
SHOW CREATE TABLE reviews;
SHOW CREATE TABLE visit_requests;
```

## 🎉 Success Indicators

✅ Tables created successfully  
✅ Routes accessible via API  
✅ Frontend displays reviews and visit requests  
✅ Users can submit reviews  
✅ Users can request visits  
✅ Owners can manage visit requests  

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify database connections
3. Test API endpoints individually
4. Check frontend network requests

---

**🎯 The Smart Boarding Finder System now has a complete review and visit scheduling system!**







