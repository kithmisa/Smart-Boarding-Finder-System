// Test script to verify PayHere configuration
const { PAYHERE_CONFIG, createPayHereParams, generatePayHereHash } = require('./config/payhere');

console.log('🧪 Testing PayHere Configuration...\n');

// Test 1: Configuration
console.log('1. Configuration Test:');
console.log('   Merchant ID:', PAYHERE_CONFIG.MERCHANT_ID);
console.log('   Sandbox Mode:', PAYHERE_CONFIG.IS_SANDBOX);
console.log('   Currency:', PAYHERE_CONFIG.CURRENCY);
console.log('   Checkout URL:', PAYHERE_CONFIG.CHECKOUT_URL);
console.log('');

// Test 2: Hash Generation
console.log('2. Hash Generation Test:');
const testParams = {
  merchant_id: PAYHERE_CONFIG.MERCHANT_ID,
  return_url: 'http://localhost:3000/payment/success',
  cancel_url: 'http://localhost:3000/payment/cancel',
  notify_url: 'http://localhost:5000/api/payments/payhere/notify',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  phone: '0771234567',
  address: 'Test Address',
  city: 'Colombo',
  country: 'Sri Lanka',
  order_id: 'TEST_ORDER_123',
  items: 'Test Payment',
  currency: 'LKR',
  amount: '100.00'
};

const hash = generatePayHereHash(testParams);
console.log('   Generated Hash:', hash);
console.log('   Hash Length:', hash.length);
console.log('');

// Test 3: PayHere Parameters Creation
console.log('3. PayHere Parameters Test:');
const customerInfo = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '0771234567',
  address: 'Test Address',
  city: 'Colombo',
  country: 'Sri Lanka'
};

const payHereParams = createPayHereParams({
  orderId: 'TEST_ORDER_123',
  amount: 100.00,
  items: 'Test Payment',
  customerInfo,
  returnUrl: 'http://localhost:3000/payment/success',
  cancelUrl: 'http://localhost:3000/payment/cancel',
  notifyUrl: 'http://localhost:5000/api/payments/payhere/notify'
});

console.log('   PayHere Parameters:');
Object.keys(payHereParams).forEach(key => {
  console.log(`     ${key}: ${payHereParams[key]}`);
});
console.log('');

// Test 4: Validation
console.log('4. Validation Test:');
const requiredFields = ['merchant_id', 'order_id', 'amount', 'currency', 'hash'];
const missingFields = requiredFields.filter(field => !payHereParams[field]);

if (missingFields.length === 0) {
  console.log('   ✅ All required fields present');
} else {
  console.log('   ❌ Missing fields:', missingFields);
}

if (hash && hash.length === 64) {
  console.log('   ✅ Hash format is correct (64 characters)');
} else {
  console.log('   ❌ Hash format is incorrect');
}

if (PAYHERE_CONFIG.MERCHANT_ID && PAYHERE_CONFIG.MERCHANT_ID !== 'your_merchant_id_here') {
  console.log('   ✅ Merchant ID is configured');
} else {
  console.log('   ⚠️  Merchant ID needs to be updated with actual credentials');
}

if (PAYHERE_CONFIG.MERCHANT_SECRET && PAYHERE_CONFIG.MERCHANT_SECRET !== 'your_merchant_secret_here') {
  console.log('   ✅ Merchant Secret is configured');
} else {
  console.log('   ⚠️  Merchant Secret needs to be updated with actual credentials');
}

console.log('\n🎉 PayHere configuration test completed!');
console.log('\n📝 Next Steps:');
console.log('   1. Get your PayHere sandbox credentials');
console.log('   2. Update the credentials in backend/config/payhere.js');
console.log('   3. Test the payment flow in your application');
console.log('   4. Use test card numbers: 4916217501611292 (Visa)');





