// controllers/houseController.js
const db = require('../db');

// ✅ Add new house - Updated to handle all fields
const addHouse = async (req, res) => {
  try {
    console.log('🏠 Received house submission request');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files ? req.files.length : 0);
    
    const {
      title, roomType, genderAllowed, price, address, city, type, location,
      highlights, shortTerm, pricePerNight, description, features,
      shortFeatures, availabilityStatus, availableDate, owner_id
    } = req.body;
    
    // Validate required fields
    const requiredFields = { title, roomType, genderAllowed, price, address, city, type, location, owner_id };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value === 'undefined' || value === 'null')
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      });
    }
    
    // Validate owner_id is a number
    const ownerIdNum = parseInt(owner_id);
    if (isNaN(ownerIdNum) || ownerIdNum <= 0) {
      console.error('❌ Invalid owner_id:', owner_id);
      return res.status(400).json({ message: 'Invalid owner ID' });
    }
    
    // Process uploaded images
    const images = req.files ? req.files.map(file => file.filename) : [];
    console.log('📸 Processing images:', images);
    
    // Prepare data for insertion
    const insertData = {
      title: title.trim(),
      roomType,
      genderAllowed,
      price: parseFloat(price),
      address: address.trim(),
      city,
      type,
      location,
      highlights: highlights ? highlights.trim() : null,
      shortTerm: shortTerm === 'true' || shortTerm === true ? 1 : 0,
      pricePerNight: pricePerNight && pricePerNight !== '' ? parseFloat(pricePerNight) : null,
      description: description ? description.trim() : null,
      features: features ? (typeof features === 'string' ? features : JSON.stringify(features)) : null,
      shortFeatures: shortFeatures ? (typeof shortFeatures === 'string' ? shortFeatures : JSON.stringify(shortFeatures)) : null,
      images: JSON.stringify(images),
      availabilityStatus: availabilityStatus || 'available',
      availableDate: availableDate && availableDate !== '' ? availableDate : null,
      owner_id: ownerIdNum,
      status: 'pending',
      confirmed: 0,
      // ✅ Add missing required fields based on database schema
      amount: roomType === 'shared' ? 'Two Persons' : 'One Person', // Default based on room type
      priceR: parseFloat(price) < 5000 ? 'less-than-5000' : 
             parseFloat(price) <= 7000 ? '5000-7000' : 
             parseFloat(price) <= 10000 ? '7000-10000' : 'above-10000', // Price range
      gender: genderAllowed === 'Girls' ? 'Female' : 
             genderAllowed === 'Boys' ? 'Male' : 
             genderAllowed === 'Anyone' ? 'Anyone' : 'Anyone' // Map gender allowed to gender field
    };
    
    console.log('💾 Inserting house data:', {
      ...insertData,
      images: `[${images.length} files]`,
      features: insertData.features ? '[JSON]' : null,
      shortFeatures: insertData.shortFeatures ? '[JSON]' : null
    });
    
    // Execute database insertion
    const [result] = await db.query(
      `INSERT INTO houses (
        title, roomType, genderAllowed, price, address, city, type, location,
        highlights, shortTerm, pricePerNight, description, features, shortFeatures,
        images, availabilityStatus, availableDate, owner_id, status, confirmed,
        amount, priceR, gender
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        insertData.title, insertData.roomType, insertData.genderAllowed,
        insertData.price, insertData.address, insertData.city, insertData.type,
        insertData.location, insertData.highlights, insertData.shortTerm,
        insertData.pricePerNight, insertData.description, insertData.features,
        insertData.shortFeatures, insertData.images, insertData.availabilityStatus,
        insertData.availableDate, insertData.owner_id, insertData.status, insertData.confirmed,
        insertData.amount, insertData.priceR, insertData.gender
      ]
    );
    
    console.log('✅ House added successfully with ID:', result.insertId);
    
    res.status(201).json({
      message: 'House added successfully',
      houseId: result.insertId,
      status: 'pending',
      imagesCount: images.length
    });
    
  } catch (error) {
    console.error('❌ Error adding house:', error);
    console.error('Error details:', error.message);
    
    // Handle specific database errors
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Invalid owner ID - owner not found' });
    }
    
    if (error.code === 'ER_BAD_NULL_ERROR') {
      return res.status(400).json({ message: 'Required field is missing or null' });
    }
    
    res.status(500).json({ 
      message: 'Server error while adding house',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// ✅ Get all houses
const getAllHouses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM houses');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get houses by owner - Updated to parse JSON fields
const getHousesByOwner = async (req, res) => {
  try {
    const { owner_id } = req.params;
    console.log('📋 Fetching houses for owner_id:', owner_id);
    
    const [rows] = await db.query('SELECT * FROM houses WHERE owner_id = ?', [owner_id]);
    
    // Process each house to parse JSON fields
    const processedHouses = rows.map(house => {
      // Parse images
      try {
        if (house.images) {
          house.images = JSON.parse(house.images);
          if (!Array.isArray(house.images)) {
            house.images = [house.images];
          }
        } else {
          house.images = [];
        }
      } catch (e) {
        house.images = typeof house.images === 'string' 
          ? house.images.split(',').filter(img => img.trim() !== '') 
          : [];
      }

      // Parse features
      try {
        house.features = house.features ? JSON.parse(house.features) : [];
        house.shortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];
      } catch (e) {
        house.features = [];
        house.shortFeatures = [];
      }

      return house;
    });
    
    console.log(`✅ Found ${processedHouses.length} houses for owner ${owner_id}`);
    res.json(processedHouses);
  } catch (error) {
    console.error('Error fetching owner houses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update house
const updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'title', 'roomType', 'genderAllowed', 'price', 'address',
      'city', 'type', 'location', 'highlights', 'shortTerm',
      'pricePerNight', 'description'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updateData[field]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateValues.push(id);
    const sql = `UPDATE houses SET ${updateFields.join(', ')} WHERE id = ?`;

    const [result] = await db.query(sql, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    res.json({ message: 'House updated successfully' });
  } catch (error) {
    console.error('Error updating house:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete house
const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM houses WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'House not found' });
    }

    res.json({ message: 'House deleted successfully' });
  } catch (error) {
    console.error('Error deleting house:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update availability
const updateAvailability = async (req, res) => {
  const { id } = req.params;
  const { availabilityStatus, availableDate } = req.body;

  try {
    const validStatuses = ['available', 'occupied', 'unavailable'];
    if (!validStatuses.includes(availabilityStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability status. Must be: available, occupied, or unavailable'
      });
    }

    let query, values;
    if (availableDate) {
      query = 'UPDATE houses SET availabilityStatus = ?, availableDate = ? WHERE id = ?';
      values = [availabilityStatus, availableDate, id];
    } else {
      query = 'UPDATE houses SET availabilityStatus = ?, availableDate = NULL WHERE id = ?';
      values = [availabilityStatus, id];
    }

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    res.json({ success: true, message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ success: false, message: 'Error updating availability' });
  }
};

// ✅ Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    const [result] = await db.query(
      'UPDATE houses SET bookingStatus = ? WHERE id = ?',
      [bookingStatus, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'House not found' });
    }

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Export all controller functions
module.exports = {
  addHouse,
  getAllHouses,
  getHousesByOwner,
  updateHouse,
  deleteHouse,
  updateAvailability,
  updateBookingStatus
};
