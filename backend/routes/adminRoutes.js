// ✅ FIXED: Complete admin routes with corrected rejection
const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAllUsers,
  getAllOwners,
  getAllComments,
  getAllHouses,
  getAllStayBookings,
  getHouseDetails,
  getAllVisitRequests,
  sendEmail,
  deleteUser,
  deleteOwner,
  deleteComment,
  deleteHouse,
  replyToComment,
  markAllMessagesAsRead,
  syncEmailReplies,
  getOwnerBankingDetails
} = require('../controllers/adminController');

// Import website rating functions
const { getRecentRatings, deleteRating, getRatingStats } = require('../controllers/websiteRatingController');

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

// Get owner banking details
router.get('/owners/:ownerId/banking', getOwnerBankingDetails);

// Get all comments
router.get('/comments', getAllComments);

// Get all houses (including pending/approved status)
router.get('/houses', getAllHouses);

// Get all visit requests
router.get('/visit-requests', getAllVisitRequests);

// Get all short-term stay bookings
router.get('/stay-bookings', getAllStayBookings);

// Send email
router.post('/send-email', sendEmail);

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

// Get detailed house information (for admin modal) with notifications
router.get('/houses/:id/details', getHouseDetails);

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

// Sync email replies from inbox (IMAP) into contact_messages
router.post('/comments/sync-email-replies', async (req, res, next) => {
  try {
    await syncEmailReplies(req, res);
  } catch (e) {
    next(e);
  }
});

// Mark all messages as read - IMPORTANT: This must come BEFORE the catch-all routes
router.put('/comments/mark-all-read', markAllMessagesAsRead);

// Delete routes
router.delete('/users/:id', deleteUser);
router.delete('/owners/:id', deleteOwner);
router.delete('/comments/:id', deleteComment);
router.delete('/houses/:id', deleteHouse);

// ✅ NEW: Missing endpoints for AdminDashboard
// Confirm boarding house
router.put('/boarding-houses/:id/confirm', async (req, res) => {
  const db = require('../db');
  const houseId = req.params.id;
  
  try {
    const [result] = await db.query(
      'UPDATE houses SET status = ?, confirmed = 1, confirmed_at = NOW() WHERE id = ?',
      ['approved', houseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    res.json({ success: true, message: 'Boarding house confirmed successfully' });
  } catch (error) {
    console.error('Error confirming boarding house:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Website Rating Admin Routes
// Get all website ratings
router.get('/website-ratings', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await getRecentRatings(req, res);
  } catch (error) {
    console.error('Error fetching website ratings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get website rating statistics
router.get('/website-ratings/stats', async (req, res) => {
  try {
    const result = await getRatingStats(req, res);
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a website rating
router.delete('/website-ratings/:id', async (req, res) => {
  try {
    const result = await deleteRating(req, res);
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Generic delete endpoint
router.delete('/:type/:id', async (req, res) => {
  const db = require('../db');
  const { type, id } = req.params;
  
  try {
    let tableName;
    let successMessage;
    
    switch (type) {
      case 'users':
        tableName = 'users';
        successMessage = 'User deleted successfully';
        break;
      case 'owners':
        tableName = 'owner';
        successMessage = 'Owner deleted successfully';
        break;
      case 'comments':
        tableName = 'contact_messages';
        successMessage = 'Comment deleted successfully';
        break;
      case 'houses':
        tableName = 'houses';
        successMessage = 'House deleted successfully';
        break;
      case 'website-ratings':
        tableName = 'website_ratings';
        successMessage = 'Rating deleted successfully';
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid type' });
    }
    
    const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, message: successMessage });
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;