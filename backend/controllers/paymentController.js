const pool = require('../db');
const crypto = require('crypto');
const { PAYHERE_CONFIG, createPayHereParams, verifyPayHereHash } = require('../config/payhere');

// Currency for manual payment records
const PAYHERE_CURRENCY = 'LKR';


// ============================
// @desc Create listing payment record (for owner listing fees)
// @route POST /api/payments/listing/create
// ============================
const createListingPaymentRecord = async (req, res) => {
  try {
    const {
      houseId,
      ownerId,
      amount,
      paymentMethod,
      transactionId,
      notes
    } = req.body;

    if (!houseId || !ownerId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const orderId = `LIST_${houseId}_${Date.now()}`;

    await pool.query(`
      INSERT INTO payments (
        house_id, owner_id, order_id, amount, currency,
        status, payment_method, transaction_id, notes, type,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      houseId, ownerId, orderId, amount, PAYHERE_CURRENCY,
      'completed', paymentMethod, transactionId || null, notes || null, 'listing_fee'
    ]);

    res.json({
      success: true,
      message: 'Listing payment recorded',
      orderId
    });
  } catch (error) {
    console.error('❌ Error creating listing payment record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create listing payment record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Get payment status
// @route GET /api/payments/:paymentId/status
// ============================
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const [paymentRows] = await pool.query(`
      SELECT p.*, b.type as booking_type, b.status as booking_status
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.id = ?
    `, [paymentId]);

    if (paymentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const payment = paymentRows[0];

    res.json({
      success: true,
      payment: {
        id: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        statusCode: payment.status_code,
        statusMessage: payment.status_message,
        paymentId: payment.payment_id,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        booking: {
          type: payment.booking_type,
          status: payment.booking_status
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Get payments by booking
// @route GET /api/payments/booking/:bookingId
// ============================
const getPaymentsByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const [paymentRows] = await pool.query(`
      SELECT * FROM payments 
      WHERE booking_id = ? 
      ORDER BY created_at DESC
    `, [bookingId]);

    res.json({
      success: true,
      payments: paymentRows.map(payment => ({
        id: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        statusCode: payment.status_code,
        statusMessage: payment.status_message,
        paymentId: payment.payment_id,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at
      }))
    });

  } catch (error) {
    console.error('❌ Error getting payments by booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Create payment record (for manual payments)
// @route POST /api/payments/create
// ============================
const createPaymentRecord = async (req, res) => {
  try {
    const {
      bookingId,
      amount,
      paymentMethod,
      transactionId,
      notes
    } = req.body;

    // Validation
    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Generate order ID
    const orderId = `MAN_${bookingId}_${Date.now()}`;

    // Insert payment record
    const [result] = await pool.query(`
      INSERT INTO payments (
        booking_id, order_id, amount, currency, 
        status, payment_method, transaction_id, notes,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      bookingId, orderId, amount, PAYHERE_CURRENCY,
      'completed', paymentMethod, transactionId || null, notes || null
    ]);

    // Update booking status
    await pool.query(
      'UPDATE bookings SET status = ?, payment_status = ? WHERE id = ?',
      ['confirmed', 'paid', bookingId]
    );

    res.json({
      success: true,
      message: 'Payment record created successfully',
      payment: {
        id: result.insertId,
        orderId,
        amount,
        status: 'completed'
      }
    });

  } catch (error) {
    console.error('❌ Error creating payment record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Initiate PayHere payment for booking
// @route POST /api/payments/payhere/initiate
// ============================
const initiatePayHerePayment = async (req, res) => {
  try {
    const {
      bookingId,
      amount,
      customerInfo,
      items
    } = req.body;

    // Validation
    if (!bookingId || !amount || !customerInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingId, amount, customerInfo'
      });
    }

    // Generate unique order ID
    const orderId = `PAYHERE_${bookingId}_${Date.now()}`;

    // Create payment record with pending status
    const [result] = await pool.query(`
      INSERT INTO payments (
        booking_id, order_id, amount, currency, 
        status, payment_method, type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      bookingId, orderId, amount, PAYHERE_CURRENCY,
      'pending', 'payhere', 'booking'
    ]);

    // Create PayHere payment parameters
    const payHereParams = createPayHereParams({
      orderId,
      amount: parseFloat(amount).toFixed(2), // Ensure proper decimal format
      items: items || `Booking Payment - Order ${orderId}`,
      customerInfo,
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/payhere/success?order_id=${orderId}`,
      cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/payhere/cancel?order_id=${orderId}`,
      notifyUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/payhere/notify`
    });

    res.json({
      success: true,
      message: 'PayHere payment initiated',
      paymentId: result.insertId,
      orderId,
      payHereParams,
      checkoutUrl: PAYHERE_CONFIG.CHECKOUT_URL
    });

  } catch (error) {
    console.error('❌ Error initiating PayHere payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate PayHere payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Initiate PayHere payment for listing fee
// @route POST /api/payments/payhere/listing/initiate
// ============================
const initiatePayHereListingPayment = async (req, res) => {
  try {
    const {
      houseId,
      ownerId,
      amount,
      customerInfo,
      items
    } = req.body;

    // Validation
    if (!houseId || !ownerId || !amount || !customerInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: houseId, ownerId, amount, customerInfo'
      });
    }

    // Generate unique order ID
    const orderId = `LIST_PAYHERE_${houseId}_${Date.now()}`;

    // Create payment record with pending status
    const [result] = await pool.query(`
      INSERT INTO payments (
        house_id, owner_id, order_id, amount, currency, 
        status, payment_method, type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      houseId, ownerId, orderId, amount, PAYHERE_CURRENCY,
      'pending', 'payhere', 'listing_fee'
    ]);

    // Create PayHere payment parameters
    const payHereParams = createPayHereParams({
      orderId,
      amount,
      items: items || `Property Listing Fee - Order ${orderId}`,
      customerInfo,
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/payhere/success?order_id=${orderId}`,
      cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/payhere/cancel?order_id=${orderId}`,
      notifyUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/payhere/notify`
    });

    res.json({
      success: true,
      message: 'PayHere listing payment initiated',
      paymentId: result.insertId,
      orderId,
      payHereParams,
      checkoutUrl: PAYHERE_CONFIG.CHECKOUT_URL
    });

  } catch (error) {
    console.error('❌ Error initiating PayHere listing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate PayHere listing payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Handle PayHere payment notification
// @route POST /api/payments/payhere/notify
// ============================
const handlePayHereNotification = async (req, res) => {
  try {
    const notificationData = req.body;
    
    console.log('📧 PayHere Notification Received:', notificationData);

    // Verify the hash to ensure the notification is from PayHere
    if (!verifyPayHereHash(notificationData)) {
      console.error('❌ Invalid PayHere notification hash');
      return res.status(400).json({
        success: false,
        message: 'Invalid notification hash'
      });
    }

    const {
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      payment_id,
      method,
      status_message
    } = notificationData;

    // Find the payment record
    const [paymentRows] = await pool.query(`
      SELECT * FROM payments WHERE order_id = ?
    `, [order_id]);

    if (paymentRows.length === 0) {
      console.error('❌ Payment record not found for order:', order_id);
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    const payment = paymentRows[0];
    let newStatus = 'failed';
    let bookingStatus = null;
    let paymentStatus = null;

    // Determine status based on PayHere status code
    if (status_code === '2') {
      newStatus = 'completed';
      bookingStatus = 'confirmed';
      paymentStatus = 'paid';
    } else if (status_code === '0') {
      newStatus = 'pending';
    } else {
      newStatus = 'failed';
    }

    // Update payment record
    await pool.query(`
      UPDATE payments 
      SET status = ?, 
          status_code = ?, 
          status_message = ?, 
          payment_id = ?, 
          transaction_id = ?,
          updated_at = NOW()
      WHERE order_id = ?
    `, [newStatus, status_code, status_message, payment_id, payment_id, order_id]);

    // Update booking status if it's a booking payment
    if (payment.booking_id && newStatus === 'completed') {
      await pool.query(`
        UPDATE booking_stay 
        SET status = ?, payment_status = ?, updated_at = NOW()
        WHERE id = ?
      `, [bookingStatus, paymentStatus, payment.booking_id]);
    }

    // Update owner listing status if it's a listing payment
    if (payment.house_id && payment.type === 'listing_fee' && newStatus === 'completed') {
      // You might want to update house status or owner status here
      console.log('✅ Listing fee payment completed for house:', payment.house_id);
    }

    console.log('✅ PayHere notification processed successfully');

    res.json({
      success: true,
      message: 'Notification processed successfully'
    });

  } catch (error) {
    console.error('❌ Error processing PayHere notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Get PayHere payment status
// @route GET /api/payments/payhere/:orderId/status
// ============================
const getPayHerePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const [paymentRows] = await pool.query(`
      SELECT p.*, 
             b.id as booking_id, b.status as booking_status, b.payment_status as booking_payment_status,
             h.title as house_title, o.name as owner_name
      FROM payments p
      LEFT JOIN booking_stay b ON p.booking_id = b.id
      LEFT JOIN houses h ON p.house_id = h.id
      LEFT JOIN owner o ON p.owner_id = o.id
      WHERE p.order_id = ?
    `, [orderId]);

    if (paymentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const payment = paymentRows[0];

    res.json({
      success: true,
      payment: {
        id: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        statusCode: payment.status_code,
        statusMessage: payment.status_message,
        paymentId: payment.payment_id,
        paymentMethod: payment.payment_method,
        type: payment.type,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        booking: payment.booking_id ? {
          id: payment.booking_id,
          status: payment.booking_status,
          paymentStatus: payment.booking_payment_status
        } : null,
        house: payment.house_id ? {
          id: payment.house_id,
          title: payment.house_title
        } : null,
        owner: payment.owner_id ? {
          id: payment.owner_id,
          name: payment.owner_name
        } : null
      }
    });

  } catch (error) {
    console.error('❌ Error getting PayHere payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getPaymentStatus,
  getPaymentsByBooking,
  createPaymentRecord,
  createListingPaymentRecord,
  initiatePayHerePayment,
  initiatePayHereListingPayment,
  handlePayHereNotification,
  getPayHerePaymentStatus
};