const express = require('express');
const router = express.Router();
const { addHouse, getAllHouses, getHousesByOwner, updateHouse, deleteHouse, 
  updateAvailability, 
  updateBookingStatus } = require('../controllers/houseController');
const db = require('../db');

const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ✅ POST - Add new house (sets status as 'pending' by default)
router.post('/', upload.array('images', 10), addHouse);

// ✅ GET - Get all houses (for admin - includes all statuses)
router.get('/all', getAllHouses);

// ✅ GET - Get APPROVED houses only (for boarding page) - includes all availability statuses
router.get('/approved', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.*, o.name as owner_name, o.contact as owner_phone 
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      WHERE h.status = 'approved' AND h.confirmed = 1
      ORDER BY h.created_at DESC
    `);

    // Process each house
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

    res.json(processedHouses);
  } catch (err) {
    console.error('Error fetching approved houses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET - Get houses by owner
router.get('/owner/:owner_id', getHousesByOwner);

// ✅ GET - Get single house by ID
router.get('/:id', async (req, res) => {
  const houseId = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM houses WHERE id = ?', [houseId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'House not found' });
    }

    const house = rows[0];

    // Parse images properly
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
      if (typeof house.images === 'string') {
        house.images = house.images.split(',').filter(img => img.trim() !== '');
      } else {
        house.images = [];
      }
    }

    // Parse features properly
    try {
      house.features = house.features ? JSON.parse(house.features) : [];
      house.shortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];
    } catch (e) {
      house.features = [];
      house.shortFeatures = [];
    }

    res.json(house);
  } catch (err) {
    console.error('Error fetching house:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT - Update house
router.put('/:id', async (req, res) => {
  const houseId = req.params.id;
  const updateData = req.body;

  try {
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'title', 'roomType', 'genderAllowed', 'price', 'address', 
      'city', 'type', 'location', 'highlights', 'shortTerm', 
      'pricePerNight', 'description'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updateData[field]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateValues.push(houseId);
    const sql = `UPDATE houses SET ${updateFields.join(', ')} WHERE id = ?`;
    
    const [result] = await db.query(sql, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    res.json({ message: 'House updated successfully' });
  } catch (err) {
    console.error('Error updating house:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ PUT - Approve house (Admin only)
router.put('/:id/approve', async (req, res) => {
  const houseId = req.params.id;
  
  try {
    const [result] = await db.query(
      'UPDATE houses SET status = ?, confirmed = 1, confirmed_at = NOW() WHERE id = ?',
      ['approved', houseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    res.json({ message: 'House approved successfully' });
  } catch (err) {
    console.error('Error approving house:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ PUT - Reject house (Admin only) - ENHANCED VERSION
router.put('/:id/reject', async (req, res) => {
  const houseId = req.params.id;
  const { rejection_reason } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE houses SET status = ?, confirmed = 0, confirmed_at = NOW(), rejection_reason = ? WHERE id = ?',
      ['rejected', houseId, rejection_reason || 'No reason provided']
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    res.json({ message: 'House rejected successfully' });
  } catch (err) {
    console.error('Error rejecting house:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ DELETE - Delete house
router.delete('/:id', async (req, res) => {
  const houseId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM houses WHERE id = ?', [houseId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    res.json({ message: 'House deleted successfully' });
  } catch (err) {
    console.error('Error deleting house:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ PUT - Update availability status
router.put('/:id/availability', async (req, res) => {
  const { id } = req.params;
  const { availabilityStatus, availableDate } = req.body;
  
  try {
    const validStatuses = ['available', 'occupied', 'unavailable'];
    const normalizedStatus = availabilityStatus.toLowerCase();
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid availability status. Must be: available, occupied, or unavailable' 
      });
    }
    
    // Convert to proper case for database consistency
    const dbStatus = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
    
    let updateQuery;
    let queryParams;
    
    if (availableDate) {
      updateQuery = 'UPDATE houses SET availabilityStatus = ?, availableDate = ? WHERE id = ?';
      queryParams = [dbStatus, availableDate, id];
    } else {
      updateQuery = 'UPDATE houses SET availabilityStatus = ?, availableDate = NULL WHERE id = ?';
      queryParams = [dbStatus, id];
    }
    
    const [result] = await db.query(updateQuery, queryParams);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'House not found' 
      });
    }
    
    // If property becomes available, notify users on waiting list
    if (normalizedStatus === 'available') {
      try {
        // Get all users on waiting list for this house
        const [waitingList] = await db.query(
          'SELECT wl.*, h.title as house_title FROM waiting_list wl JOIN houses h ON wl.house_id = h.id WHERE wl.house_id = ? AND wl.status = "waiting"',
          [id]
        );
        
        if (waitingList.length > 0) {
          console.log(`🏠 Property ${id} is now available! Notifying ${waitingList.length} users on waiting list`);
          
          // Update waiting list status to notified
          await db.query(
            'UPDATE waiting_list SET status = "notified", notified_at = NOW() WHERE house_id = ? AND status = "waiting"',
            [id]
          );
          
          // Here you could add email notification logic
          // For now, we'll just log it
          waitingList.forEach(user => {
            console.log(`📧 Notifying user ${user.name} (${user.email}) that ${user.house_title} is now available!`);
          });
        }
      } catch (notifyError) {
        console.error('⚠️ Error notifying waiting list users:', notifyError);
        // Don't fail the main request if notification fails
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Availability updated successfully',
      affectedRows: result.affectedRows 
    });
    
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating availability',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// ✅ PUT - Update booking status
router.put('/:id/booking-status', async (req, res) => {
  const houseId = req.params.id;
  const { bookingStatus } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE houses SET bookingStatus = ? WHERE id = ?',
      [bookingStatus, houseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    res.json({ message: 'Booking status updated successfully' });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;