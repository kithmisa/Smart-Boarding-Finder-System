// Test both Base64 and decoded merchant secrets
const crypto = require('crypto');

const base64Secret = 'NzQzOTM1NDU4MjE3OTk1Njg1NDIzNDcwNDIyNjE0NDM3NjYzNzk=';
const decodedSecret = '74393545821799568542347042261443766379';

const testParams = {
    merchant_id: '1231486',
    order_id: 'PAYHERE_45_1758096343978',
    items: 'Booking Payment - Home away from home',
    currency: 'LKR',
    amount: '12400.00'
};

console.log('🧪 Testing Both Secret Formats...\n');

// Test 1: Using decoded secret (current method)
console.log('1. Using DECODED secret:');
const hashString1 = decodedSecret + testParams.merchant_id + testParams.order_id + testParams.items + testParams.currency + testParams.amount;
const hash1 = crypto.createHash('md5').update(hashString1).digest('hex').toUpperCase();
console.log('Hash String:', hashString1);
console.log('Generated Hash:', hash1);
console.log('');

// Test 2: Using Base64 secret directly
console.log('2. Using BASE64 secret directly:');
const hashString2 = base64Secret + testParams.merchant_id + testParams.order_id + testParams.items + testParams.currency + testParams.amount;
const hash2 = crypto.createHash('md5').update(hashString2).digest('hex').toUpperCase();
console.log('Hash String:', hashString2);
console.log('Generated Hash:', hash2);
console.log('');

// Test 3: Using Base64 secret without padding
const base64NoPadding = base64Secret.replace(/=+$/, '');
console.log('3. Using BASE64 secret without padding:');
const hashString3 = base64NoPadding + testParams.merchant_id + testParams.order_id + testParams.items + testParams.currency + testParams.amount;
const hash3 = crypto.createHash('md5').update(hashString3).digest('hex').toUpperCase();
console.log('Hash String:', hashString3);
console.log('Generated Hash:', hash3);
console.log('');

console.log('Expected hash from your terminal: F5E5446A95C275C79B37461B8223DB2C');
console.log('Which method matches?');



