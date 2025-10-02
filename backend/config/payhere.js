// PayHere Payment Gateway Configuration
const crypto = require('crypto');

// PayHere Sandbox Configuration
const PAYHERE_CONFIG = {
  // Sandbox URLs
  CHECKOUT_URL: 'https://sandbox.payhere.lk/pay/checkout',
  NOTIFY_URL: 'https://sandbox.payhere.lk/pay/notify',
  
  // Your PayHere Sandbox Credentials (from .env file)
  MERCHANT_ID: process.env.PAYHERE_MERCHANT_ID || '1231486', // Your merchant ID
  MERCHANT_SECRET: process.env.PAYHERE_MERCHANT_SECRET || '74393545821799568542347042261443766379', // Your merchant secret
  
  // Currency
  CURRENCY: 'LKR',
  
  // Environment
  IS_SANDBOX: process.env.PAYHERE_SANDBOX === 'true' || true, // Default to sandbox for safety
};

/**
 * Generate PayHere hash for security
 * @param {Object} params - Payment parameters
 * @returns {string} - Generated hash
 */
const generatePayHereHash = (params) => {
  const {
    merchant_id,
    order_id,
    items,
    currency,
    amount
  } = params;

  // Create the hash string in the exact order required by PayHere
  const hashString = 
    PAYHERE_CONFIG.MERCHANT_SECRET + 
    merchant_id + 
    order_id + 
    items + 
    currency + 
    amount;

  console.log('Hash String:', hashString);
  console.log('Merchant Secret:', PAYHERE_CONFIG.MERCHANT_SECRET);
  console.log('Merchant ID:', merchant_id);
  console.log('Order ID:', order_id);
  console.log('Items:', items);
  console.log('Currency:', currency);
  console.log('Amount:', amount);

  // Generate MD5 hash and convert to uppercase (PayHere requires MD5)
  const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
  console.log('Generated Hash:', hash);
  
  return hash;
};

/**
 * Verify PayHere notification hash
 * @param {Object} notificationData - Notification data from PayHere
 * @returns {boolean} - Whether the hash is valid
 */
const verifyPayHereHash = (notificationData) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig
  } = notificationData;

  // Create the hash string for verification
  const hashString = 
    PAYHERE_CONFIG.MERCHANT_SECRET + 
    merchant_id + 
    order_id + 
    payhere_amount + 
    payhere_currency + 
    status_code;

  // Generate MD5 hash
  const generatedHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
  
  return generatedHash === md5sig;
};

/**
 * Create PayHere payment parameters
 * @param {Object} paymentData - Payment data
 * @returns {Object} - PayHere payment parameters
 */
const createPayHereParams = (paymentData) => {
  const {
    orderId,
    amount,
    items,
    customerInfo,
    returnUrl,
    cancelUrl,
    notifyUrl
  } = paymentData;

  const params = {
    merchant_id: PAYHERE_CONFIG.MERCHANT_ID,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    first_name: customerInfo.firstName,
    last_name: customerInfo.lastName,
    email: customerInfo.email,
    phone: customerInfo.phone,
    address: customerInfo.address || 'No Address',
    city: customerInfo.city || 'Colombo',
    country: customerInfo.country || 'Sri Lanka',
    order_id: orderId,
    items: items,
    currency: PAYHERE_CONFIG.CURRENCY,
    amount: parseFloat(amount).toFixed(2)
  };

  // Generate hash
  params.hash = generatePayHereHash(params);

  return params;
};

module.exports = {
  PAYHERE_CONFIG,
  generatePayHereHash,
  verifyPayHereHash,
  createPayHereParams
};
