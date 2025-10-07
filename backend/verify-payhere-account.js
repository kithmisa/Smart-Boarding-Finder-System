// Verify PayHere account status and configuration
require('dotenv').config();

console.log('🔍 PayHere Account Verification\n');

const MERCHANT_ID = '1231486';
const MERCHANT_SECRET = 'NzQzOTM1NDU4MjE3OTk1Njg1NDIzNDcwNDIyNjE0NDM3NjYzNzk';

console.log('📋 Account Details:');
console.log('   Merchant ID:', MERCHANT_ID);
console.log('   Merchant Secret:', MERCHANT_SECRET);
console.log('   Secret Length:', MERCHANT_SECRET.length);

console.log('\n🔗 PayHere Portal Links:');
console.log('   Sandbox Portal: https://sandbox.payhere.lk/');
console.log('   Login: https://sandbox.payhere.lk/merchant/');
console.log('   Domains/Apps: https://sandbox.payhere.lk/merchant/domains');

console.log('\n📝 Troubleshooting Checklist:');
console.log('1. ✅ Login to PayHere sandbox portal');
console.log('2. ✅ Check account status (should be "Active")');
console.log('3. ✅ Go to Integrations > Domains/Apps');
console.log('4. ✅ Verify "localhost" is configured as "App" (not Domain)');
console.log('5. ✅ Check if there are any account restrictions');
console.log('6. ✅ Verify merchant credentials match exactly');

console.log('\n🚨 Common Issues:');
console.log('• Account not activated by PayHere');
console.log('• Domain/App configuration not saved properly');
console.log('• Account suspended or restricted');
console.log('• Wrong environment (sandbox vs production)');
console.log('• Merchant credentials not verified');

console.log('\n🛠️ Next Steps:');
console.log('1. Open: https://sandbox.payhere.lk/merchant/domains');
console.log('2. Check if "localhost" appears in your Apps list');
console.log('3. If not, add it as an "App" (not Domain)');
console.log('4. Save the configuration');
console.log('5. Test again');

console.log('\n📞 If Still Not Working:');
console.log('• Contact PayHere support');
console.log('• Create a new sandbox account with different email');
console.log('• Verify account activation status');

console.log('\n🧪 Manual Test:');
console.log('• Open: backend/test-manual-payhere.html in your browser');
console.log('• Fill in the form and test directly with PayHere');
console.log('• This will help isolate if the issue is account-related');




