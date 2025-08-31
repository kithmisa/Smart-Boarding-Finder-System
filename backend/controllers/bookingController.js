const pool = require('../db');
const crypto = require('crypto');

// ============================
// @desc Create visit booking
// @route POST /api/bookings/visit
// ============================
const createVisitBooking = async (req, res) => {
  try {
    const { houseId, visitDate, type = 'visit', userId } = req.body;

    console.log('=== CREATE VISIT BOOKING ===');
    console.log('Data:', { houseId, visitDate, type, userId });

    // Validation
    if (!houseId || !visitDate) {
      return res.status(400).json({
        success: false,
        message: 'House ID and visit date are required'
      });
    }

    // Check if house exists
    const [houseRows] = await pool.query('SELECT * FROM houses WHERE id = ?', [houseId]);
    if (houseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'House not found'
      });
    }

    const house = houseRows[0];

    // Insert visit booking
    const insertQuery = `
      INSERT INTO bookings (
        house_id, visit_date, status, user_id
      ) VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertQuery, [
      houseId, visitDate, 'pending', userId || null
    ]);

    console.log('✅ Visit booking created with ID:', result.insertId);

    res.json({
      success: true,
      message: 'Visit booking created successfully',
      booking: {
        id: result.insertId,
        houseId,
        visitDate,
        status: 'pending',
        house: {
          title: house.title,
          address: house.address
        }
      }
    });

  } catch (error) {
    console.error('❌ Error creating visit booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create visit booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Create stay booking
// @route POST /api/bookings/stay
// ============================
const createStayBooking = async (req, res) => {
  try {
    const { houseId, checkIn, checkOut, type = 'stay', userId } = req.body;

    console.log('=== CREATE STAY BOOKING ===');
    console.log('Data:', { houseId, checkIn, checkOut, type, userId });

    // Validation
    if (!houseId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'House ID, check-in and check-out dates are required'
      });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Check if house exists and get details
    const [houseRows] = await pool.query('SELECT * FROM houses WHERE id = ?', [houseId]);
    if (houseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'House not found'
      });
    }

    const house = houseRows[0];

    // Check if short-term booking is available
    if (!house.shortTerm || house.pricePerNight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Short-term booking is not available for this property'
      });
    }

    // Calculate nights and total price
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * house.pricePerNight;
    const advancePayment = totalPrice / 4; // 25% advance

    // Skip conflict check for now due to database schema limitations
    // TODO: Implement proper conflict checking when database supports stay bookings

    // For stay bookings, use check-in date as visit_date (temporary solution)
    // Insert stay booking using available schema
    const insertQuery = `
      INSERT INTO bookings (
        house_id, visit_date, status, user_id
      ) VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertQuery, [
      houseId, checkIn, 'pending', userId || null
    ]);

    console.log('✅ Stay booking created with ID:', result.insertId);

    res.json({
      success: true,
      message: 'Stay booking request created successfully',
      booking: {
        id: result.insertId,
        houseId,
        checkIn,
        checkOut,
        nights,
        totalPrice,
        advancePayment,
        status: 'pending',
        house: {
          title: house.title,
          address: house.address,
          pricePerNight: house.pricePerNight
        }
      }
    });

  } catch (error) {
    console.error('❌ Error creating stay booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create stay booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Get booking by ID
// @route GET /api/bookings/:id
// ============================
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT b.*, h.title as house_title, h.address as house_address,
             h.pricePerNight, h.owner_id,
             o.name as owner_name, o.contact as owner_phone, o.email as owner_email
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      LEFT JOIN owner o ON h.owner_id = o.id
      WHERE b.id = ?
    `;

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking: rows[0]
    });

  } catch (error) {
    console.error('❌ Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
};

// ============================
// @desc Update booking status
// @route PUT /api/bookings/:id/status
// ============================
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentId, paymentMethod } = req.body;

    console.log('=== UPDATE BOOKING STATUS ===');
    console.log('Booking ID:', id, 'New Status:', status);

    const validStatuses = ['pending', 'confirmed', 'paid', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    let updateQuery = 'UPDATE bookings SET status = ?, updated_at = NOW()';
    let params = [status];

    // If payment related, add payment details
    if (status === 'paid' && paymentId) {
      updateQuery += ', payment_id = ?, payment_method = ?, paid_at = NOW()';
      params.push(paymentId, paymentMethod || 'payhere');
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.query(updateQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    console.log('✅ Booking status updated successfully');

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
};

// ============================
// @desc Get bookings for a house
// @route GET /api/bookings/house/:houseId
// ============================
const getBookingsByHouse = async (req, res) => {
  try {
    const { houseId } = req.params;
    const { status } = req.query;

    let query = `
      SELECT b.*, h.title as house_title, h.address as house_address
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      WHERE b.house_id = ?
    `;

    let params = [houseId];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    query += ' ORDER BY b.created_at DESC';

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      bookings: rows
    });

  } catch (error) {
    console.error('❌ Error fetching bookings by house:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

// ============================
// @desc Get all bookings with filters
// @route GET /api/bookings
// ============================
const getAllBookings = async (req, res) => {
  try {
    const { status, type, ownerId } = req.query;

    let query = `
      SELECT b.*, h.title as house_title, h.address as house_address,
             h.owner_id, o.name as owner_name, o.contact as owner_phone
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      LEFT JOIN owner o ON h.owner_id = o.id
      WHERE 1=1
    `;

    let params = [];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND b.type = ?';
      params.push(type);
    }

    if (ownerId) {
      query += ' AND h.owner_id = ?';
      params.push(ownerId);
    }

    query += ' ORDER BY b.created_at DESC';

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      bookings: rows
    });

  } catch (error) {
    console.error('❌ Error fetching all bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

module.exports = {
  createVisitBooking,
  createStayBooking,
  getBookingById,
  updateBookingStatus,
  getBookingsByHouse,
  getAllBookings
};