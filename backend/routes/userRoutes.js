const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserActivity, deleteUserAccount } = require('../controllers/userController');
const db = require('../db');

// Get user profile details
router.get('/profile/:userId', getUserProfile);

// Update user profile
router.put('/profile/:userId', updateUserProfile);

// Get user activity
router.get('/activity/:userId', getUserActivity);

// Delete user account
router.delete('/profile/:userId', deleteUserAccount);

// Get user's visit requests
router.get('/visit-requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [requests] = await db.execute(`
      SELECT vr.*, h.title as boarding_title, h.address as boarding_address, 
             o.name as owner_name, o.contact as owner_phone
      FROM visit_requests vr
      JOIN houses h ON vr.boarding_id = h.id
      JOIN owner o ON h.owner_id = o.id
      WHERE vr.user_id = ?
      ORDER BY vr.created_at DESC
    `, [userId]);
    
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching user visit requests:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch visit requests' 
    });
  }
});

// Get user's notifications
router.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [notifications] = await db.execute(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);
    
    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch notifications' 
    });
  }
});

// Mark notification as read
router.put('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await db.execute(`
      UPDATE notifications 
      SET is_read = 1 
      WHERE id = ?
    `, [notificationId]);
    
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark notification as read' 
    });
  }
});

// Cancel visit request
router.put('/visit-requests/:requestId/cancel', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { userId } = req.body;
    
    // Verify the request belongs to the user
    const [requests] = await db.execute(`
      SELECT * FROM visit_requests WHERE id = ? AND user_id = ?
    `, [requestId, userId]);
    
    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Visit request not found or unauthorized'
      });
    }
    
    await db.execute(`
      UPDATE visit_requests 
      SET status = 'cancelled' 
      WHERE id = ?
    `, [requestId]);
    
    res.json({ success: true, message: 'Visit request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling visit request:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to cancel visit request' 
    });
  }
});

// Check if email already exists
router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email parameter is required' 
      });
    }
    
    const [users] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    res.json({ 
      success: true, 
      exists: users.length > 0,
      userId: users.length > 0 ? users[0].id : null
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check email' 
    });
  }
});

// Debug endpoint to check user data
router.get('/debug/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [users] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found',
        searchedId: userId
      });
    }
    
    res.json({ 
      success: true, 
      user: users[0],
      searchedId: userId
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to debug user data',
      message: error.message
    });
  }
});

// Check database structure
router.get('/check-db', async (req, res) => {
  try {
    // Check if users table exists and get its structure
    const [tables] = await db.execute('SHOW TABLES LIKE "users"');
    
    if (tables.length === 0) {
      return res.json({ 
        success: false, 
        error: 'Users table does not exist'
      });
    }
    
    // Get table structure
    const [columns] = await db.execute('DESCRIBE users');
    
    // Get sample data
    const [users] = await db.execute('SELECT * FROM users LIMIT 3');
    
    res.json({ 
      success: true, 
      tableExists: true,
      columns: columns,
      sampleUsers: users,
      totalUsers: users.length
    });
  } catch (error) {
    console.error('Error checking database:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check database',
      message: error.message
    });
  }
});

module.exports = router;
