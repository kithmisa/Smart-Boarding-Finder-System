const pool = require('../db');
const crypto = require('crypto');

// PayHere configuration - Add these to your .env file
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1220001';
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || '8mYzXKqA3vNpR7sT';
const PAYHERE_CURRENCY = 'LKR';
const PAYHERE_SANDBOX = process.env.NODE_ENV !== 'production'; // Use sandbox for development

// PayHere URLs
const PAYHERE_BASE_URL = PAYHERE_SANDBOX 
  ? 'https://sandbox.payhere.lk/pay/checkout' 
  : 'https://www.payhere.lk/pay/checkout';

// ============================
// @desc Generate PayHere payment hash
// ============================
const generatePayHereHash = (merchantId, orderId, amount, currency, merchantSecret) => {
  const hashString = `${merchantId}${orderId}${amount}${currency}${crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()}`;
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
};

// ============================
// @desc Initiate PayHere payment
// @route POST /api/payments/initiate
// ============================
const initiatePayment = async (req, res) => {
  try {
    const { 
      bookingId, 
      amount, 
      customerFirstName, 
      customerLastName, 
      customerEmail, 
      customerPhone,
      customerAddress,
      customerCity 
    } = req.body;

    console.log('=== INITIATE PAYHERE PAYMENT ===');
    console.log('Booking ID:', bookingId);
    console.log('Amount:', amount);

    // Validation
    if (!bookingId || !amount || !customerFirstName || !customerLastName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for payment'
      });
    }

    // Get booking details
    const [bookingRows] = await pool.query(`
      SELECT b.*, h.title as house_title, h.address as house_address
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      WHERE b.id = ?
    `, [bookingId]);

    if (bookingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookingRows[0];

    // Verify amount matches booking
    const expectedAmount = booking.type === 'stay' ? booking.advance_payment : amount;
    if (parseFloat(amount) !== parseFloat(expectedAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match booking amount'
      });
    }

    // Generate order ID
    const orderId = `BRD_${bookingId}_${Date.now()}`;
    
    // Generate PayHere hash
    const hash = generatePayHereHash(
      PAYHERE_MERCHANT_ID,
      orderId,
      parseFloat(amount).toFixed(2),
      PAYHERE_CURRENCY,
      PAYHERE_MERCHANT_SECRET
    );

    // Store payment initiation in database
    const paymentInsertQuery = `
      INSERT INTO payments (
        booking_id, order_id, amount, currency, 
        customer_first_name, customer_last_name, customer_email, customer_phone,
        customer_address, customer_city, status, payment_hash, 
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [paymentResult] = await pool.query(paymentInsertQuery, [
      bookingId, orderId, amount, PAYHERE_CURRENCY,
      customerFirstName, customerLastName, customerEmail, customerPhone,
      customerAddress || '', customerCity || '', 'pending', hash
    ]);

    const paymentId = paymentResult.insertId;

    // Create PayHere payment form data
    const paymentData = {
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?payment_id=${paymentId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel?payment_id=${paymentId}`,
      notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/notify`,
      order_id: orderId,
      items: `${booking.house_title} - ${booking.type === 'stay' ? 'Stay Booking' : 'Visit Booking'}`,
      currency: PAYHERE_CURRENCY,
      amount: parseFloat(amount).toFixed(2),
      first_name: customerFirstName,
      last_name: customerLastName,
      email: customerEmail,
      phone: customerPhone,
      address: customerAddress || '',
      city: customerCity || '',
      country: 'Sri Lanka',
      hash: hash
    };

    console.log('✅ Payment initiated successfully');
    console.log('Payment ID:', paymentId);
    console.log('Order ID:', orderId);

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      payment: {
        id: paymentId,
        orderId,
        amount: parseFloat(amount).toFixed(2),
        currency: PAYHERE_CURRENCY,
        status: 'pending'
      },
      payhere: {
        url: PAYHERE_BASE_URL,
        data: paymentData
      }
    });

  } catch (error) {
    console.error('❌ Error initiating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Handle PayHere payment notification
// @route POST /api/payments/notify
// ============================
const handlePaymentNotification = async (req, res) => {
  try {
    console.log('=== PAYHERE NOTIFICATION RECEIVED ===');
    console.log('Notification data:', req.body);

    const {
      merchant_id,
      order_id,
      payment_id,
      status_code,
      status_message,
      md5sig
    } = req.body;

    // Verify PayHere signature
    const expectedMd5sig = crypto
      .createHash('md5')
      .update(PAYHERE_MERCHANT_SECRET)
      .digest('hex')
      .toUpperCase();

    if (md5sig !== expectedMd5sig) {
      console.error('❌ Invalid PayHere signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Find payment by order ID
    const [paymentRows] = await pool.query(
      'SELECT * FROM payments WHERE order_id = ?',
      [order_id]
    );

    if (paymentRows.length === 0) {
      console.error('❌ Payment not found for order:', order_id);
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = paymentRows[0];

    // Update payment status
    const updatePaymentQuery = `
      UPDATE payments 
      SET 
        status = ?, 
        payment_id = ?, 
        status_code = ?, 
        status_message = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await pool.query(updatePaymentQuery, [
      status_code === '2' ? 'completed' : 'failed',
      payment_id,
      status_code,
      status_message,
      payment.id
    ]);

    // Update booking status if payment successful
    if (status_code === '2') {
      await pool.query(
        'UPDATE bookings SET status = ?, payment_status = ? WHERE id = ?',
        ['confirmed', 'paid', payment.booking_id]
      );

      console.log('✅ Payment completed successfully');
      console.log('Payment ID:', payment_id);
      console.log('Booking ID:', payment.booking_id);
    } else {
      console.log('❌ Payment failed');
      console.log('Status:', status_message);
    }

    // Send success response to PayHere
    res.json({ status: 'OK' });

  } catch (error) {
    console.error('❌ Error handling payment notification:', error);
    res.status(500).json({ error: 'Internal server error' });
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

module.exports = {
  initiatePayment,
  handlePaymentNotification,
  getPaymentStatus,
  getPaymentsByBooking,
  createPaymentRecord
};