// Script to update all hardcoded API URLs
const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'src/components/PayHereCancel.jsx',
  'src/components/HouseDetails.jsx',
  'src/components/OwnerDetails.jsx',
  'src/components/Footer.jsx',
  'src/components/AdminDashboard.js',
  'src/components/UserProfile.jsx',
  'src/components/PayHereSuccess.jsx',
  'src/components/Payment.jsx',
  'src/components/BoardingDetail.js',
  'src/components/BankDetailsModal.jsx',
  'src/components/BoardingList.js',
  'src/components/ResetPassword.jsx',
  'src/components/AdminLogin.js'
];

// Update each file
filesToUpdate.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace hardcoded URLs
      content = content.replace(/http:\/\/localhost:5000\/api/g, '/api');
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`❌ File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log('🎉 API URL update complete!');
