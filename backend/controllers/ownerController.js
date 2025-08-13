// backend/controllers/ownerController.js
const db = require('../db');

// ownerController.js - Register function
const registerOwner = async (req, res) => {
  try {
    const { name, email, nic, contact } = req.body;

    console.log('Registration request received:', { name, email, nic, contact }); // Debug log

    if (!name || !email || !nic || !contact) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if owner already exists
    const [existingOwner] = await db.query('SELECT * FROM owner WHERE nic = ?', [nic]);
    if (existingOwner.length > 0) {
      return res.status(400).json({ error: 'Owner with this NIC already exists' });
    }

    // Insert new owner
    const [result] = await db.query(
      'INSERT INTO owner (name, email, nic, contact) VALUES (?, ?, ?, ?)',
      [name, email, nic, contact]
    );

    console.log('Owner inserted with ID:', result.insertId); // Debug log

    // ✅ Return the owner_id in the response
    const responseData = {
      message: 'Owner registered successfully', 
      owner_id: result.insertId,  // This is the ID that was auto-generated
      id: result.insertId,        // Alternative field name
      ownerId: result.insertId,   // Another alternative
      owner: {
        id: result.insertId,
        name,
        email,
        nic,
        contact
      }
    };

    console.log('Sending response to frontend:', responseData); // Debug log
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error registering owner:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// ownerController.js - Login function
const loginOwner = async (req, res) => {
  try {
    const { nic } = req.body;

    console.log('Login request for NIC:', nic); // Debug log

    if (!nic) {
      return res.status(400).json({ error: 'NIC is required' });
    }

    // Find owner by NIC
    const [rows] = await db.query('SELECT * FROM owner WHERE nic = ?', [nic]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const owner = rows[0];
    console.log('Owner found:', owner); // Debug log

    // ✅ Return the complete owner data including owner_id
    res.status(200).json({ 
      message: 'Login successful',
      owner_id: owner.id,  // Make sure to return the owner_id
      id: owner.id,        // Alternative field name
      ownerId: owner.id,   // Another alternative
      owner: owner         // Complete owner object
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = { registerOwner, loginOwner };