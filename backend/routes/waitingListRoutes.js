const express = require('express');
const router = express.Router();
const db = require('../db');

// Join waiting list
router.post('/join', async (req, res) => {
  try {
    const { houseId, userId, name, email, phone, message } = req.body;

    // Validate required fields
    if (!houseId || !userId || !name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'House ID, User ID, Name, and Email are required' 
      });
    }

    // Check if user is already on waiting list for this house
    const [existing] = await db.query(
      'SELECT id FROM waiting_list WHERE house_id = ? AND user_id = ?',
      [houseId, userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already on the waiting list for this property' 
      });
    }

    // Add user to waiting list
    const [result] = await db.query(
      'INSERT INTO waiting_list (house_id, user_id, name, email, phone, message, joined_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [houseId, userId, name, email, phone || null, message || null]
    );

    console.log('✅ User added to waiting list:', { houseId, userId, name, email });

    res.status(201).json({
      success: true,
      message: 'Successfully joined waiting list',
      waitingListId: result.insertId
    });

  } catch (error) {
    console.error('❌ Error joining waiting list:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to join waiting list',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Leave waiting list
router.post('/leave', async (req, res) => {
  try {
    const { houseId, userId } = req.body;

    if (!houseId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'House ID and User ID are required' 
      });
    }

    // Remove user from waiting list
    const [result] = await db.query(
      'DELETE FROM waiting_list WHERE house_id = ? AND user_id = ?',
      [houseId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'You are not on the waiting list for this property' 
      });
    }

    console.log('✅ User removed from waiting list:', { houseId, userId });

    res.json({
      success: true,
      message: 'Successfully removed from waiting list'
    });

  } catch (error) {
    console.error('❌ Error leaving waiting list:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to leave waiting list',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Check if user is on waiting list
router.get('/check/:houseId', async (req, res) => {
  try {
    const { houseId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Check if user is on waiting list
    const [rows] = await db.query(
      'SELECT id FROM waiting_list WHERE house_id = ? AND user_id = ?',
      [houseId, userId]
    );

    res.json({
      success: true,
      isOnWaitingList: rows.length > 0
    });

  } catch (error) {
    console.error('❌ Error checking waiting list status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check waiting list status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get waiting list for a house (for owners/admins)
router.get('/house/:houseId', async (req, res) => {
  try {
    const { houseId } = req.params;

    const [rows] = await db.query(
      'SELECT wl.*, u.first_name, u.last_name, u.email as user_email FROM waiting_list wl LEFT JOIN users u ON wl.user_id = u.id WHERE wl.house_id = ? ORDER BY wl.joined_at ASC',
      [houseId]
    );

    res.json({
      success: true,
      waitingList: rows
    });

  } catch (error) {
    console.error('❌ Error fetching waiting list:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch waiting list',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
