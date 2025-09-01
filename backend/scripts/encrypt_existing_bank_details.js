const db = require('../db');
const { encrypt } = require('../utils/encryption');

/**
 * Script to encrypt existing bank account numbers
 * Run this script once to encrypt all existing plain text account numbers
 */

async function encryptExistingBankDetails() {
  try {
    console.log('🔐 Starting encryption of existing bank details...');
    
    // Get all bank details with plain text account numbers
    const [rows] = await db.query(
      'SELECT id, account_number FROM owner_bank_details WHERE account_number NOT LIKE "U2F%"'
    );
    
    if (rows.length === 0) {
      console.log('✅ No plain text account numbers found. All data is already encrypted.');
      return;
    }
    
    console.log(`📊 Found ${rows.length} records to encrypt...`);
    
    let encryptedCount = 0;
    let errorCount = 0;
    
    for (const row of rows) {
      try {
        // Encrypt the account number
        const encryptedAccountNumber = encrypt(row.account_number);
        
        // Update the record with encrypted data
        await db.query(
          'UPDATE owner_bank_details SET account_number = ? WHERE id = ?',
          [encryptedAccountNumber, row.id]
        );
        
        encryptedCount++;
        console.log(`✅ Encrypted record ${row.id}: ${row.account_number.substring(0, 4)}... → XXXX...`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error encrypting record ${row.id}:`, error.message);
      }
    }
    
    console.log('\n📈 Encryption Summary:');
    console.log(`✅ Successfully encrypted: ${encryptedCount} records`);
    console.log(`❌ Failed to encrypt: ${errorCount} records`);
    console.log(`📊 Total processed: ${rows.length} records`);
    
    if (errorCount === 0) {
      console.log('\n🎉 All existing bank details have been encrypted successfully!');
    } else {
      console.log('\n⚠️  Some records failed to encrypt. Check the logs above.');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during encryption:', error);
  } finally {
    // Close the database connection
    await db.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run the encryption if this script is executed directly
if (require.main === module) {
  encryptExistingBankDetails()
    .then(() => {
      console.log('🏁 Script completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { encryptExistingBankDetails };
