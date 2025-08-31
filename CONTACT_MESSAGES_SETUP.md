# Contact Messages Setup for Admin Dashboard

This document explains how to set up the contact messages functionality in the admin dashboard, allowing admins to view and reply to user inquiries from the contact form.

## Features Added

1. **Contact Messages Display**: Admin dashboard now shows all contact form submissions
2. **Email Reply System**: Admins can reply to users and send emails automatically
3. **Enhanced UI**: Better display of message details and reply status

## Database Setup

### 1. Run the Migration Script

Execute the SQL migration script to ensure the `contact_messages` table has all required fields:

```bash
# Navigate to backend directory
cd backend

# Run the migration (you'll need to execute this in your MySQL client)
mysql -u your_username -p your_database_name < migrations/contact_messages_setup.sql
```

### 2. Table Structure

The `contact_messages` table will have the following structure:

```sql
CREATE TABLE contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  comments TEXT NOT NULL,
  reply TEXT,
  replied BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

Ensure these environment variables are set in your `.env` file:

```env
# Email configuration for sending replies
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password

# Database configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306
```

### Gmail App Password Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this app password in your `EMAIL_PASS` environment variable

## How It Works

### 1. User Submits Contact Form
- User fills out the contact form on `/contact` page
- Form data is saved to `contact_messages` table

### 2. Admin Views Messages
- Admin navigates to "Comments & Replies" section in dashboard
- All contact messages are displayed with user details
- Messages show: name, email, subject, message content, and timestamp

### 3. Admin Replies
- Admin clicks "Reply" button on any message
- Reply modal opens showing original message details
- Admin types reply and clicks "Send Reply & Email"
- Reply is saved to database and email is sent to user

### 4. Email Notification
- User receives a professional email with:
  - Original message content
  - Admin's reply
  - Smart Boarding Finder branding
  - Contact information

## API Endpoints

### Get All Contact Messages
```
GET /api/admin/comments
```

### Reply to Contact Message
```
POST /api/admin/comments/:id/reply
Body: { "reply": "Your reply message" }
```

### Delete Contact Message
```
DELETE /api/admin/comments/:id
```

## Frontend Components

### AdminDashboard.js
- Enhanced `renderComments()` function to display contact messages
- Improved `ReplyModal` with detailed message information
- Better UI for message status and reply actions

### Contact.js
- Contact form that submits to `/api/contact/submit`
- Form fields: name, email, title, comments

## Backend Controllers

### adminController.js
- `getAllComments()`: Fetch all contact messages
- `replyToComment()`: Reply to message and send email
- `deleteComment()`: Delete contact message

### contactController.js
- `submitContactForm()`: Handle contact form submissions

## Testing the Setup

1. **Submit a test contact form**:
   - Go to `/contact` page
   - Fill out and submit the form
   - Check database for new record

2. **Test admin dashboard**:
   - Login to admin dashboard
   - Go to "Comments & Replies" section
   - Verify message appears with correct details

3. **Test reply functionality**:
   - Click "Reply" on a message
   - Type a reply and send
   - Check email delivery
   - Verify database update

## Troubleshooting

### Email Not Sending
- Check Gmail app password is correct
- Verify `EMAIL_USER` and `EMAIL_PASS` environment variables
- Check console logs for email errors

### Messages Not Displaying
- Verify `contact_messages` table exists
- Check database connection
- Ensure admin routes are properly configured

### Reply Not Saving
- Check database permissions
- Verify table structure has all required fields
- Check console logs for database errors

## Security Considerations

1. **Input Validation**: All form inputs are validated on both frontend and backend
2. **Email Sanitization**: Email addresses are validated before sending
3. **Admin Authentication**: Only authenticated admins can access messages
4. **SQL Injection Protection**: Using parameterized queries

## Future Enhancements

- Message categorization (inquiry, complaint, feedback)
- Bulk reply functionality
- Message templates for common responses
- Email tracking and delivery confirmation
- Message archiving and search functionality



