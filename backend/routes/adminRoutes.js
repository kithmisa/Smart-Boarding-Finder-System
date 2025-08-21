// ✅ FIXED: Complete admin routes with corrected rejection
const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAllUsers,
  getAllOwners,
  getAllComments,
  getAllHouses,
  deleteUser,
  deleteOwner,
  deleteComment,
  deleteHouse,
  replyToComment,
  markAllMessagesAsRead
} = require('../controllers/adminController');

// Admin login
router.post('/login', loginAdmin);

// Test route to verify admin routes are working
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Admin routes are working!' });
});

// Get all users
router.get('/users', getAllUsers);

// Get all owners
router.get('/owners', getAllOwners);

// Get all comments
router.get('/comments', getAllComments);

// Get all houses (including pending/approved status)
router.get('/houses', getAllHouses);

// ✅ ALIAS: boarding-houses route (for compatibility)
router.get('/boarding-houses', getAllHouses);

// ✅ Dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  const db = require('../db');
  
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(CASE WHEN status = 'pending' OR (status IS NULL AND confirmed = 0) THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'approved' AND confirmed = 1 THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(*) as total
      FROM houses
    `);

    res.json({ success: true, stats: stats[0] });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get pending houses for approval
router.get('/houses/pending', async (req, res) => {
  const db = require('../db');
  
  try {
    const [rows] = await db.query(`
      SELECT h.*, o.name as owner_name, o.email as owner_email, o.contact as owner_phone 
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      WHERE h.status = 'pending' OR (h.status IS NULL AND h.confirmed = 0)
      ORDER BY h.created_at DESC
    `);

    const processedHouses = rows.map(house => {
      // Parse images
      try {
        if (house.images) {
          house.images = JSON.parse(house.images);
          if (!Array.isArray(house.images)) {
            house.images = [house.images];
          }
        } else {
          house.images = [];
        }
      } catch (e) {
        house.images = typeof house.images === 'string' 
          ? house.images.split(',').filter(img => img.trim() !== '') 
          : [];
      }

      // Parse features
      try {
        house.features = house.features ? JSON.parse(house.features) : [];
        house.shortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];
      } catch (e) {
        house.features = [];
        house.shortFeatures = [];
      }

      return house;
    });

    res.json({ success: true, houses: processedHouses });
  } catch (error) {
    console.error('Error fetching pending houses:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get approved houses
router.get('/houses/approved', async (req, res) => {
  const db = require('../db');
  
  try {
    const [rows] = await db.query(`
      SELECT h.*, o.name as owner_name, o.email as owner_email, o.contact as owner_phone 
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      WHERE h.status = 'approved' AND h.confirmed = 1
      ORDER BY h.confirmed_at DESC
    `);

    const processedHouses = rows.map(house => {
      // Parse images
      try {
        if (house.images) {
          house.images = JSON.parse(house.images);
          if (!Array.isArray(house.images)) {
            house.images = [house.images];
          }
        } else {
          house.images = [];
        }
      } catch (e) {
        house.images = typeof house.images === 'string' 
          ? house.images.split(',').filter(img => img.trim() !== '') 
          : [];
      }

      // Parse features
      try {
        house.features = house.features ? JSON.parse(house.features) : [];
        house.shortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];
      } catch (e) {
        house.features = [];
        house.shortFeatures = [];
      }

      return house;
    });

    res.json({ success: true, houses: processedHouses });
  } catch (error) {
    console.error('Error fetching approved houses:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get rejected houses
router.get('/houses/rejected', async (req, res) => {
  const db = require('../db');
  
  try {
    const [rows] = await db.query(`
      SELECT h.*, o.name as owner_name, o.email as owner_email, o.contact as owner_phone 
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      WHERE h.status = 'rejected'
      ORDER BY h.confirmed_at DESC
    `);

    const processedHouses = rows.map(house => {
      // Parse images
      try {
        if (house.images) {
          house.images = JSON.parse(house.images);
          if (!Array.isArray(house.images)) {
            house.images = [house.images];
          }
        } else {
          house.images = [];
        }
      } catch (e) {
        house.images = typeof house.images === 'string' 
          ? house.images.split(',').filter(img => img.trim() !== '') 
          : [];
      }

      // Parse features
      try {
        house.features = house.features ? JSON.parse(house.features) : [];
        house.shortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];
      } catch (e) {
        house.features = [];
        house.shortFeatures = [];
      }

      return house;
    });

    res.json({ success: true, houses: processedHouses });
  } catch (error) {
    console.error('Error fetching rejected houses:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get detailed house information (for admin modal)
router.get('/houses/:id/details', async (req, res) => {
  const db = require('../db');
  const houseId = req.params.id;
  
  try {
    const [rows] = await db.query(`
      SELECT h.*, o.name as owner_name, o.email as owner_email, o.contact as owner_phone 
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      WHERE h.id = ?
    `, [houseId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    const house = rows[0];

    // Parse images
    try {
      if (house.images) {
        house.images = JSON.parse(house.images);
        if (!Array.isArray(house.images)) {
          house.images = [house.images];
        }
      } else {
        house.images = [];
      }
    } catch (e) {
      house.images = typeof house.images === 'string' 
        ? house.images.split(',').filter(img => img.trim() !== '') 
        : [];
    }

    // Parse features
    try {
      house.features = house.features ? JSON.parse(house.features) : [];
      house.shortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];
    } catch (e) {
      house.features = [];
      house.shortFeatures = [];
    }

    res.json({ success: true, house });
  } catch (error) {
    console.error('Error fetching house details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Approve house
router.put('/houses/:id/approve', async (req, res) => {
  const db = require('../db');
  const houseId = req.params.id;
  
  try {
    const [result] = await db.query(
      'UPDATE houses SET status = ?, confirmed = 1, confirmed_at = NOW(), rejection_reason = NULL WHERE id = ?',
      ['approved', houseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    res.json({ success: true, message: 'House approved successfully' });
  } catch (error) {
    console.error('Error approving house:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ FIXED: Reject house with reason - corrected parameters
router.put('/houses/:id/reject', async (req, res) => {
  const db = require('../db');
  const houseId = req.params.id;
  const { rejection_reason } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE houses SET status = ?, confirmed = 0, confirmed_at = NOW(), rejection_reason = ? WHERE id = ?',
      ['rejected', rejection_reason || 'No reason provided', houseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    res.json({ success: true, message: 'House rejected successfully' });
  } catch (error) {
    console.error('Error rejecting house:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reply to comment
router.post('/comments/:id/reply', replyToComment);

// Mark all messages as read - IMPORTANT: This must come BEFORE the catch-all routes
router.put('/comments/mark-all-read', markAllMessagesAsRead);

// Delete routes
router.delete('/users/:id', deleteUser);
router.delete('/owners/:id', deleteOwner);
router.delete('/comments/:id', deleteComment);
router.delete('/houses/:id', deleteHouse);

module.exports = router;