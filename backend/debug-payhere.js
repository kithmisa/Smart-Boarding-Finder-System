// Debug script for PayHere hash generation
const crypto = require('crypto');

// Your actual credentials (replace with your real ones)
const MERCHANT_ID = '1217129'; // Replace with your actual Merchant ID
const MERCHANT_SECRET = '8mMqyQQ9QZ8xQN2Q8mMqyQQ9QZ8xQN2Q'; // Replace with your actual Merchant Secret

console.log('🔍 PayHere Hash Debug Tool\n');

// Test parameters
const testParams = {
  merchant_id: MERCHANT_ID,
  return_url: 'http://localhost:3000/payment/payhere/success?order_id=TEST123',
  cancel_url: 'http://localhost:3000/payment/payhere/cancel?order_id=TEST123',
  notify_url: 'http://localhost:5000/api/payments/payhere/notify',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  phone: '0771234567',
  address: 'Test Address',
  city: 'Colombo',
  country: 'Sri Lanka',
  order_id: 'TEST123',
  items: 'Test Payment',
  currency: 'LKR',
  amount: '100.00'
};

console.log('📋 Test Parameters:');
Object.keys(testParams).forEach(key => {
  console.log(`   ${key}: ${testParams[key]}`);
});

// Generate hash using PayHere's exact method
const hashString = 
  MERCHANT_SECRET + 
  testParams.merchant_id + 
  testParams.order_id + 
  testParams.items + 
  testParams.currency + 
  testParams.amount;

console.log('\n🔐 Hash Generation:');
console.log('   Hash String:', hashString);
console.log('   Hash String Length:', hashString.length);

const generatedHash = crypto.createHash('sha256').update(hashString).digest('hex').toUpperCase();
console.log('   Generated Hash:', generatedHash);
console.log('   Hash Length:', generatedHash.length);

// Test with different amount formats
console.log('\n🧪 Testing Different Amount Formats:');
const amounts = ['100', '100.00', '100.0'];
amounts.forEach(amount => {
  const testHashString = MERCHANT_SECRET + testParams.merchant_id + testParams.order_id + testParams.items + testParams.currency + amount;
  const testHash = crypto.createHash('sha256').update(testHashString).digest('hex').toUpperCase();
  console.log(`   Amount: ${amount} -> Hash: ${testHash}`);
});

console.log('\n📝 PayHere Form Data:');
console.log('   <form method="post" action="https://sandbox.payhere.lk/pay/checkout">');
Object.keys(testParams).forEach(key => {
  console.log(`     <input type="hidden" name="${key}" value="${testParams[key]}" />`);
});
console.log(`     <input type="hidden" name="hash" value="${generatedHash}" />`);
console.log('   </form>');

console.log('\n✅ Debug completed!');
console.log('\n🔧 Common Issues:');
console.log('   1. Make sure your domain is approved in PayHere dashboard');
console.log('   2. Verify Merchant ID and Secret are correct');
console.log('   3. Check that amount format matches (try both "100" and "100.00")');
console.log('   4. Ensure all required fields are present');









