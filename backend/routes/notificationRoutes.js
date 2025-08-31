const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all notifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [notifications] = await db.execute(`
      SELECT n.*, h.title as boarding_title, h.address, o.name as owner_name
      FROM notifications n
      JOIN houses h ON n.boarding_id = h.id
      JOIN owner o ON n.owner_id = o.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `, [userId]);
    
    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch notifications' 
    });
  }
});

// Get all notifications for an owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    console.log('=== FETCHING OWNER NOTIFICATIONS DEBUG ===');
    console.log('Owner ID:', ownerId);
    
    // First check if owner exists
    const [ownerCheck] = await db.execute(
      'SELECT id FROM owner WHERE id = ?',
      [ownerId]
    );
    
    if (ownerCheck.length === 0) {
      console.log('❌ Owner not found:', ownerId);
      return res.status(404).json({ error: 'Owner not found' });
    }
    
    console.log('✅ Owner exists:', ownerCheck[0]);
    
    // Check if there are any notifications for this owner
    const [notificationCount] = await db.execute(`
      SELECT COUNT(*) as count
      FROM notifications 
      WHERE owner_id = ?
    `, [ownerId]);
    
    console.log('📊 Total notifications for owner:', notificationCount[0].count);
    
    // Get notifications with joins
    const [notifications] = await db.execute(`
      SELECT n.*, h.title as boarding_title, h.address, u.username, u.first_name, u.last_name, u.email
      FROM notifications n
      JOIN houses h ON n.boarding_id = h.id
      JOIN users u ON n.user_id = u.id
      WHERE n.owner_id = ?
      ORDER BY n.created_at DESC
    `, [ownerId]);
    
    console.log('✅ Fetched notifications:', notifications);
    
    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('❌ Error fetching owner notifications:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch notifications',
      details: error.message
    });
  }
});

// Mark notification as read
router.put('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await db.execute(`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = ?
    `, [notificationId]);
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark notification as read' 
    });
  }
});

// Mark all notifications as read for a user
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await db.execute(`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE user_id = ?
    `, [userId]);
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark notifications as read' 
    });
  }
});

// Mark all notifications as read for an owner
router.put('/owner/:ownerId/read-all', async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    await db.execute(`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE owner_id = ?
    `, [ownerId]);
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark notifications as read' 
    });
  }
});

// Get unread notification count for a user
router.get('/user/:userId/unread-count', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [result] = await db.execute(`
      SELECT COUNT(*) as unread_count
      FROM notifications 
      WHERE user_id = ? AND is_read = FALSE
    `, [userId]);
    
    res.json({
      success: true,
      unreadCount: result[0].unread_count
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch unread count' 
    });
  }
});

// Get unread notification count for an owner
router.get('/owner/:ownerId/unread-count', async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const [result] = await db.execute(`
      SELECT COUNT(*) as unread_count
      FROM notifications 
      WHERE owner_id = ? AND is_read = FALSE
    `, [ownerId]);
    
    res.json({
      success: true,
      unreadCount: result[0].unread_count
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch unread count' 
    });
  }
});

// ✅ NEW: Test notification endpoint for debugging
router.post('/test/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { title, message } = req.body;

    console.log('=== TEST NOTIFICATION DEBUG ===');
    console.log('Owner ID:', ownerId);
    console.log('Title:', title);
    console.log('Message:', message);
    console.log('===============================');

    // Check if owner exists
    const [ownerCheck] = await db.execute(
      'SELECT id FROM owner WHERE id = ?',
      [ownerId]
    );

    if (ownerCheck.length === 0) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Get a sample house for this owner
    const [houseCheck] = await db.execute(
      'SELECT id FROM houses WHERE owner_id = ? LIMIT 1',
      [ownerId]
    );

    if (houseCheck.length === 0) {
      return res.status(400).json({ error: 'Owner has no properties to create test notification' });
    }

    // Get a sample user
    const [userCheck] = await db.execute(
      'SELECT id FROM users LIMIT 1'
    );

    if (userCheck.length === 0) {
      return res.status(400).json({ error: 'No users found in system' });
    }

    // Create a test notification
    const [result] = await db.execute(`
      INSERT INTO notifications (user_id, owner_id, boarding_id, visit_request_id, type, title, message)
      VALUES (?, ?, ?, 1, 'visit_request', ?, ?)
    `, [
      userCheck[0].id,
      ownerId,
      houseCheck[0].id,
      title || 'Test Notification',
      message || 'This is a test notification to verify the system is working.'
    ]);

    console.log('✅ Test notification created with ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Test notification created successfully',
      notificationId: result.insertId
    });

  } catch (error) {
    console.error('❌ Error creating test notification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create test notification',
      details: error.message
    });
  }
});

module.exports = router;
