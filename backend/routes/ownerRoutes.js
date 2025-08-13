const express = require('express');
const router = express.Router();
const { registerOwner, loginOwner } = require('../controllers/ownerController');

// ✅ FIXED: Import your database connection (same path as in ownerController.js)
const db = require('../db'); // ✅ ADD THIS LINE - matching your controller import path

// Correct route paths
router.post('/register', registerOwner);
router.post('/login', loginOwner);

// ✅ FIXED: More robust POST route with better error handling
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

    // ✅ Check if owner exists
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

    // ✅ Check if bank details already exist
    console.log('Checking existing bank details...');
    const [existingBankDetails] = await db.query(
      'SELECT id FROM owner_bank_details WHERE owner_id = ?',
      [owner_id]
    );

    if (existingBankDetails.length > 0) {
      console.log('Updating existing bank details...');
      // ✅ UPDATE existing bank details
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

      const [result] = await db.query(updateQuery, [
        accountHolderName,
        accountType,
        accountNumber,
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
      // ✅ INSERT new bank details
      const insertQuery = `
        INSERT INTO owner_bank_details 
        (owner_id, account_holder_name, account_type, account_number, bank_name, branch_name, branch_code, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;

      const [result] = await db.query(insertQuery, [
        owner_id,
        accountHolderName,
        accountType,
        accountNumber,
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
    
    // ✅ Send detailed error info for debugging
    res.status(500).json({ 
      error: 'Internal server error while saving bank details',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;