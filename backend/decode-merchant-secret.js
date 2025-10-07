// Script to decode PayHere merchant secret from Base64
const crypto = require('crypto');

// The Base64 encoded merchant secret from your PayHere dashboard
const base64Secret = 'NzQzOTM1NDU4MjE3OTk1Njg1NDIzNDcwNDIyNjE0NDM3NjYzNzk=';

console.log('🔍 Decoding PayHere Merchant Secret...\n');

try {
    // Decode from Base64
    const decodedSecret = Buffer.from(base64Secret, 'base64').toString('utf8');
    
    console.log('Base64 Secret:', base64Secret);
    console.log('Decoded Secret:', decodedSecret);
    console.log('Length:', decodedSecret.length);
    
    // Test hash generation with the decoded secret
    const testParams = {
        merchant_id: '1231486',
        order_id: 'TEST_ORDER_123',
        items: 'Test Payment',
        currency: 'LKR',
        amount: '100.00'
    };
    
    const hashString = decodedSecret + testParams.merchant_id + testParams.order_id + testParams.items + testParams.currency + testParams.amount;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
    
    console.log('\n🧪 Test Hash Generation:');
    console.log('Hash String:', hashString);
    console.log('Generated Hash:', hash);
    
} catch (error) {
    console.error('❌ Error decoding secret:', error.message);
}



