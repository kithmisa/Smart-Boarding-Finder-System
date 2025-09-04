// backend/controllers/ownerController.js
const db = require('../db');
const bcrypt = require('bcryptjs');

// ownerController.js - Register function
const registerOwner = async (req, res) => {
  try {
    const { name, email, nic, contact, password } = req.body;

    console.log('Registration request received:', { name, email, nic, contact }); // Debug log

    if (!name || !email || !nic || !contact || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if owner already exists (NIC only - email check removed for development)
    const [existingOwner] = await db.query('SELECT * FROM owner WHERE nic = ?', [nic]);
    if (existingOwner.length > 0) {
      return res.status(400).json({ error: 'Owner with this NIC already exists' });
    }

    // TODO: Add email uniqueness check back in production
    // const [existingEmail] = await db.query('SELECT * FROM owner WHERE email = ?', [email]);
    // if (existingEmail.length > 0) {
    //   return res.status(400).json({ error: 'Owner with this email already exists' });
    // }

    // Hash the password
    const saltRounds = 12; // Higher salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new owner with hashed password
    const [result] = await db.query(
      'INSERT INTO owner (name, email, nic, contact, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, nic, contact, hashedPassword]
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
    const { name, password } = req.body;

    console.log('Login request for name:', name); // Debug log

    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    // Find owner by name
    const [rows] = await db.query('SELECT * FROM owner WHERE name = ?', [name]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const owner = rows[0];
    console.log('Owner found:', { id: owner.id, name: owner.name, email: owner.email }); // Debug log (don't log password)

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Remove password from response for security
    const { password: _, ...ownerWithoutPassword } = owner;

    // ✅ Return the complete owner data including owner_id (without password)
    res.status(200).json({ 
      message: 'Login successful',
      owner_id: owner.id,  // Make sure to return the owner_id
      id: owner.id,        // Alternative field name
      ownerId: owner.id,   // Another alternative
      owner: ownerWithoutPassword         // Complete owner object without password
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = { registerOwner, loginOwner };