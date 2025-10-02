const express = require('express');
const router = express.Router();
const { registerOwner, loginOwner } = require('../controllers/ownerController');


const db = require('../db'); 


const { encrypt, decrypt, maskAccountNumber } = require('../utils/encryption');


router.post('/register', registerOwner);
router.post('/login', loginOwner);


router.post('/:owner_id/bank-details', async (req, res) => {
  try {
    const { owner_id } = req.params;
    
    console.log('=== BANK DETAILS SUBMISSION DEBUG ===');
    console.log('Owner ID from params:', owner_id);
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);
    console.log('Request body:', req.body);
    console.log('Raw request body keys:', Object.keys(req.body || {}));
    console.log('=====================================');

    // ✅ Validate that request body exists and is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('❌ Empty request body received');
      return res.status(400).json({ 
        error: 'Request body is empty. Please send bank details data.',
        receivedBody: req.body 
      });
    }

    const {
      accountHolderName,
      accountType,
      accountNumber,
      bankName,
      branchName,
      branchCode
    } = req.body;

    console.log('Extracted fields:', {
      accountHolderName,
      accountType,
      accountNumber: accountNumber ? '***' + accountNumber.slice(-4) : 'missing',
      bankName,
      branchName,
      branchCode
    });

    // ✅ Validate required fields with detailed error messages
    const missingFields = [];
    if (!owner_id) missingFields.push('owner_id');
    if (!accountHolderName?.trim()) missingFields.push('accountHolderName');
    if (!accountType?.trim()) missingFields.push('accountType');
    if (!accountNumber?.trim()) missingFields.push('accountNumber');
    if (!bankName?.trim()) missingFields.push('bankName');
    if (!branchName?.trim()) missingFields.push('branchName');

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields,
        receivedData: {
          owner_id,
          accountHolderName: !!accountHolderName,
          accountType: !!accountType,
          accountNumber: !!accountNumber,
          bankName: !!bankName,
          branchName: !!branchName,
          branchCode: !!branchCode
        }
      });
    }

   
    console.log('Checking if owner exists...');
    const [ownerCheck] = await db.query(
      'SELECT id FROM owner WHERE id = ?',
      [owner_id]
    );

    if (ownerCheck.length === 0) {
      console.error('❌ Owner not found:', owner_id);
      return res.status(404).json({ error: 'Owner not found' });
    }
    console.log('✅ Owner exists:', ownerCheck[0]);

   
    console.log('Checking existing bank details...');
    const [existingBankDetails] = await db.query(
      'SELECT id FROM owner_bank_details WHERE owner_id = ?',
      [owner_id]
    );

    if (existingBankDetails.length > 0) {
      console.log('Updating existing bank details...');
      
      const updateQuery = `
        UPDATE owner_bank_details 
        SET account_holder_name = ?, 
            account_type = ?, 
            account_number = ?, 
            bank_name = ?, 
            branch_name = ?, 
            branch_code = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE owner_id = ?
      `;

      
      console.log('🔐 Encryption Debug:');
      console.log('Original account number:', accountNumber);
      const encryptedAccountNumber = encrypt(accountNumber);
      console.log('Encrypted account number:', encryptedAccountNumber);
      console.log('Is encrypted:', encryptedAccountNumber !== accountNumber ? 'Yes' : 'No');
      
      const [result] = await db.query(updateQuery, [
        accountHolderName,
        accountType,
        encryptedAccountNumber, 
        bankName,
        branchName,
        branchCode || null,
        owner_id
      ]);

      console.log('✅ Bank details updated successfully for owner:', owner_id, 'Affected rows:', result.affectedRows);
      res.status(200).json({ 
        message: 'Bank details updated successfully',
        owner_id: parseInt(owner_id),
        action: 'updated'
      });
    } else {
      console.log('Creating new bank details...');
      
      const insertQuery = `
        INSERT INTO owner_bank_details 
        (owner_id, account_holder_name, account_type, account_number, bank_name, branch_name, branch_code, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;

      
      console.log('🔐 Encryption Debug (INSERT):');
      console.log('Original account number:', accountNumber);
      const encryptedAccountNumber = encrypt(accountNumber);
      console.log('Encrypted account number:', encryptedAccountNumber);
      console.log('Is encrypted:', encryptedAccountNumber !== accountNumber ? 'Yes' : 'No');
      
      const [result] = await db.query(insertQuery, [
        owner_id,
        accountHolderName,
        accountType,
        encryptedAccountNumber, 
        bankName,
        branchName,
        branchCode || null
      ]);

      console.log('✅ Bank details saved successfully for owner:', owner_id, 'Insert ID:', result.insertId);
      res.status(201).json({ 
        message: 'Bank details saved successfully',
        owner_id: parseInt(owner_id),
        action: 'created',
        bank_details_id: result.insertId
      });
    }

  } catch (error) {
    console.error('❌ Error saving bank details:', error);
    console.error('Error stack:', error.stack);
    
    
    res.status(500).json({ 
      error: 'Internal server error while saving bank details',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


router.put('/:owner_id/profile', async (req, res) => {
  try {
    const { owner_id } = req.params;
    const { name, email, contact, nic } = req.body;

    console.log('=== PROFILE UPDATE DEBUG ===');
    console.log('Owner ID from params:', owner_id);
    console.log('Request body:', req.body);
    console.log('============================');

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !contact?.trim() || !nic?.trim()) {
      return res.status(400).json({ 
        error: 'All fields (name, email, contact, nic) are required' 
      });
    }

    // Check if owner exists
    const [ownerCheck] = await db.query(
      'SELECT id FROM owner WHERE id = ?',
      [owner_id]
    );

    if (ownerCheck.length === 0) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Check if email is already taken by another owner
    const [emailCheck] = await db.query(
      'SELECT id FROM owner WHERE email = ? AND id != ?',
      [email, owner_id]
    );

    if (emailCheck.length > 0) {
      return res.status(400).json({ error: 'Email is already taken by another owner' });
    }

    // Check if NIC is already taken by another owner
    const [nicCheck] = await db.query(
      'SELECT id FROM owner WHERE nic = ? AND id != ?',
      [nic, owner_id]
    );

    if (nicCheck.length > 0) {
      return res.status(400).json({ error: 'NIC number is already taken by another owner' });
    }

    // Update owner profile
    const updateQuery = `
      UPDATE owner 
      SET name = ?, email = ?, contact = ?, nic = ?
      WHERE id = ?
    `;

    console.log('Executing update query:', updateQuery);
    console.log('Query parameters:', [name.trim(), email.trim(), contact.trim(), nic.trim(), owner_id]);

    const [result] = await db.query(updateQuery, [
      name.trim(),
      email.trim(),
      contact.trim(),
      nic.trim(),
      owner_id
    ]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    console.log('✅ Profile updated successfully for owner:', owner_id);
    res.status(200).json({ 
      message: 'Profile updated successfully',
      owner_id: parseInt(owner_id),
      updated_fields: { name, email, contact, nic }
    });

  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ 
      error: 'Internal server error while updating profile',
      details: error.message
    });
  }
});


router.post('/:owner_id/send-email-otp', async (req, res) => {
  try {
    const { owner_id } = req.params;
    const { email } = req.body;

    console.log('=== SEND EMAIL OTP DEBUG ===');
    console.log('Owner ID:', owner_id);
    console.log('New Email:', email);
    console.log('============================');

    if (!email?.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if owner exists
    const [ownerCheck] = await db.query(
      'SELECT id, email as current_email FROM owner WHERE id = ?',
      [owner_id]
    );

    if (ownerCheck.length === 0) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const currentEmail = ownerCheck[0].current_email;
    
    // Only send OTP if email is actually changing
    if (currentEmail === email.trim()) {
      return res.status(200).json({ 
        message: 'Email unchanged, no OTP needed',
        emailVerified: true 
      });
    }

    // Use existing OTP system from authController
    const { sendOTP } = require('../controllers/authController');
    
    
    const mockReq = {
      body: {
        email: email.trim(),
        purpose: 'email_change'
      }
    };

    const mockRes = {
      status: (code) => ({
        json: (data) => {
          if (code === 200) {
            console.log(`📧 OTP sent to ${email} for owner ${owner_id}`);
            res.status(200).json({
              message: 'OTP sent successfully',
              email: email.trim(),
              purpose: 'email_change'
            });
          } else {
            res.status(code).json(data);
          }
        }
      })
    };

   
    await sendOTP(mockReq, mockRes);

  } catch (error) {
    console.error('❌ Error sending email OTP:', error);
    res.status(500).json({ 
      error: 'Internal server error while sending OTP',
      details: error.message
    });
  }
});


router.post('/:owner_id/verify-email-otp', async (req, res) => {
  try {
    const { owner_id } = req.params;
    const { email, otp, name, contact, nic } = req.body;

    console.log('=== VERIFY EMAIL OTP DEBUG ===');
    console.log('Owner ID:', owner_id);
    console.log('Email:', email);
    console.log('OTP:', otp);
    console.log('============================');

    if (!email?.trim() || !otp?.trim()) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

   
    const { verifyOTP } = require('../controllers/authController');
    
    
    const mockReq = {
      body: {
        email: email.trim(),
        otp: otp.trim(),
        purpose: 'email_change'
      }
    };

    let otpVerified = false;
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          if (code === 200) {
            otpVerified = true;
          }
          
        }
      })
    };

   
    await verifyOTP(mockReq, mockRes);

    if (!otpVerified) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Check if email is already taken by another owner
    const [emailCheck] = await db.query(
      'SELECT id FROM owner WHERE email = ? AND id != ?',
      [email.trim(), owner_id]
    );

    if (emailCheck.length > 0) {
      return res.status(400).json({ error: 'Email is already taken by another owner' });
    }

    
    const updateQuery = `
      UPDATE owner 
      SET name = ?, email = ?, contact = ?, nic = ?
      WHERE id = ?
    `;

    const [result] = await db.query(updateQuery, [
      name.trim(),
      email.trim(),
      contact.trim(),
      nic.trim(),
      owner_id
    ]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    console.log('✅ Profile updated successfully with verified email for owner:', owner_id);
    res.status(200).json({ 
      message: 'Profile updated successfully with verified email',
      owner_id: parseInt(owner_id),
      updated_fields: { name, email, contact, nic }
    });

  } catch (error) {
    console.error('❌ Error verifying email OTP:', error);
    res.status(500).json({ 
      error: 'Internal server error while verifying OTP',
      details: error.message
    });
  }
});


router.get('/:owner_id/bank-details', async (req, res) => {
  try {
    const { owner_id } = req.params;
    
    console.log('=== GET BANK DETAILS DEBUG ===');
    console.log('Owner ID from params:', owner_id);
    console.log('=============================');

    // Check if owner exists
    const [ownerCheck] = await db.query(
      'SELECT id FROM owner WHERE id = ?',
      [owner_id]
    );

    if (ownerCheck.length === 0) {
      console.log('❌ Owner not found:', owner_id);
      return res.status(404).json({ error: 'Owner not found' });
    }
    console.log('✅ Owner exists:', ownerCheck[0]);

    // Get bank details
    const [bankDetails] = await db.query(
      'SELECT * FROM owner_bank_details WHERE owner_id = ?',
      [owner_id]
    );

    if (bankDetails.length === 0) {
      console.log('❌ No bank details found for owner:', owner_id);
      return res.status(404).json({ error: 'Bank details not found' });
    }

    
    let accountNumber, maskedAccountNumber;
    
    try {
      
      accountNumber = decrypt(bankDetails[0].account_number);
      if (!accountNumber) {
        
        accountNumber = bankDetails[0].account_number;
      }
    } catch (error) {
      
      accountNumber = bankDetails[0].account_number;
    }
    
    maskedAccountNumber = maskAccountNumber(accountNumber);
    
    const decryptedDetails = {
      ...bankDetails[0],
      account_number: accountNumber, // Full account number for internal use
      masked_account_number: maskedAccountNumber // Masked for display
    };

    console.log('✅ Bank details found and processed:', {
      ...decryptedDetails,
      account_number: '***' + decryptedDetails.account_number.slice(-4), 
      masked_account_number: decryptedDetails.masked_account_number,
      original_encrypted: bankDetails[0].account_number.substring(0, 10) + '...'
    });
    
    res.json(decryptedDetails);

  } catch (error) {
    console.error('❌ Error fetching bank details:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching bank details',
      details: error.message
    });
  }
});

module.exports = router;