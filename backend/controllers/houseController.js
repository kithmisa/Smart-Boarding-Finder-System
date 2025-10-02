const pool = require('../db');

// =======================
// Helper function for safe values
// =======================
const safeValue = (value, fallback = null) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  return value;
};


//  Add a new house
// route POST /api/houses

const addHouse = async (req, res) => {
  console.log('=== ADD HOUSE REQUEST ===');
  console.log('Body:', req.body);
  console.log('Files:', req.files?.map(f => f.filename));

  try {
    const {
      title, roomType, genderAllowed, price, address,
      city, type, location, googleMapsUrl, highlights, shortTerm,
      pricePerNight, description, features, shortFeatures,
      availabilityStatus, availableDate, owner_id
    } = req.body;

   
    if (!owner_id || owner_id === 'null' || owner_id === 'undefined' || owner_id === '') {
      console.error('❌ Missing or invalid owner_id:', owner_id);
      return res.status(400).json({ 
        error: 'Owner ID is required and must be valid',
        received_owner_id: owner_id,
        type_of_owner_id: typeof owner_id
      });
    }

    
    const ownerIdNum = parseInt(owner_id);
    if (isNaN(ownerIdNum) || ownerIdNum <= 0) {
      console.error('❌ Invalid owner_id format:', owner_id);
      return res.status(400).json({ 
        error: 'Owner ID must be a valid positive number',
        received_owner_id: owner_id
      });
    }

   
    if (!title || !roomType || !genderAllowed || !price || !address || !city || !type || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'roomType', 'genderAllowed', 'price', 'address', 'city', 'type', 'location']
      });
    }

    
    const images = req.files || [];
    
    if (images.length < 3) {
      return res.status(400).json({ 
        error: `At least 3 images are required. You uploaded ${images.length} image(s).` 
      });
    }

    console.log(`✅ ${images.length} images uploaded`);

    
    const featuresArr = features ? JSON.parse(features) : [];
    const shortFeaturesArr = shortFeatures ? JSON.parse(shortFeatures) : [];

    
    const isShortTerm = shortTerm === 'true';

    
    const imagePaths = images.map(file => file.filename);
    console.log("Final image paths to store:", imagePaths);

    
    const sql = `
      INSERT INTO houses (
        title, roomType, genderAllowed, price, address, city, type,
        location, googleMapsUrl, highlights, shortTerm, pricePerNight, description,
        features, shortFeatures, images, availabilityStatus, availableDate, 
        owner_id, status, confirmed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      safeValue(title),
      safeValue(roomType),
      safeValue(genderAllowed),
      parseFloat(price) || 0,
      safeValue(address),
      safeValue(city),
      safeValue(type),
      safeValue(location),
      safeValue(googleMapsUrl, null),
      safeValue(highlights, ''),
      isShortTerm ? 1 : 0,
      parseFloat(pricePerNight) || null,
      safeValue(description, ''),
      JSON.stringify(featuresArr),
      JSON.stringify(shortFeaturesArr),
      JSON.stringify(imagePaths),
      safeValue(availabilityStatus, 'available'),
      safeValue(availableDate, null),
      ownerIdNum,
      'pending',  
      0           
    ];

    console.log('✅ Executing insert query...');
    const [result] = await pool.query(sql, values);

    console.log('✅ House inserted successfully with ID:', result.insertId);

    res.status(201).json({
      message: '✅ House submitted successfully! It is now pending admin approval.',
      houseId: result.insertId,
      status: 'pending',
      imagesUploaded: images.length,
      imageFilenames: imagePaths,
      note: 'Your property will be visible on the boarding page once approved by admin (usually 24-48 hours).'
    });

  } catch (error) {
    console.error('❌ Error adding house:', error);
    
    // Handle specific database errors
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        error: 'Invalid owner ID. Owner does not exist in database.',
        owner_id: req.body.owner_id
      });
    }
    
    if (error.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ 
        error: 'One or more fields exceed maximum length limits.'
      });
    }

    res.status(500).json({ 
      error: 'Failed to add house. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Get all houses
// route GET /api/houses

const getAllHouses = async (req, res) => {
  try {
    console.log('=== GET ALL HOUSES ===');

    
    const query = `
      SELECT h.*, o.name as owner_name, o.contact as owner_phone, o.email as owner_email
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      WHERE h.status = 'approved' AND h.confirmed = 1
      ORDER BY h.created_at DESC
    `;

    const [rows] = await pool.query(query);
    console.log(`✅ Found ${rows.length} approved houses`);

    const formatted = rows.map(house => {
      let parsedImages = [];
      let parsedFeatures = [];
      let parsedShortFeatures = [];
      
      try {
        parsedImages = house.images ? JSON.parse(house.images) : [];
        if (!Array.isArray(parsedImages)) parsedImages = [parsedImages];
      } catch (e) {
        console.error(`Error parsing images for house ${house.id}:`, e);
        parsedImages = [];
      }
      
      try {
        parsedFeatures = house.features ? JSON.parse(house.features) : [];
      } catch (e) {
        parsedFeatures = [];
      }
      
      try {
        parsedShortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];
      } catch (e) {
        parsedShortFeatures = [];
      }

      
      if (!house.status) {
        house.status = house.confirmed ? 'approved' : 'pending';
      }

      return {
        ...house,
        features: parsedFeatures,
        shortFeatures: parsedShortFeatures,
        images: parsedImages,
        imageCount: parsedImages.length
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('❌ Error fetching all houses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch houses',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


//Get single house by ID with owner info
// route GET /api/houses/:id

const getHouseById = async (req, res) => {
  const houseId = req.params.id;

  try {
    console.log('=== GET HOUSE BY ID ===', houseId);

    
    const query = `
      SELECT h.*, o.name as owner_name, o.contact as owner_phone, o.email as owner_email
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      WHERE h.id = ?
    `;

    const [rows] = await pool.query(query, [houseId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'House not found' });
    }

    const house = rows[0];

    
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
      if (typeof house.images === 'string') {
        house.images = house.images.split(',').filter(img => img.trim() !== '');
      } else {
        house.images = [];
      }
    }

    
    try {
      house.features = house.features ? JSON.parse(house.features) : [];
      house.shortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];
    } catch (e) {
      house.features = [];
      house.shortFeatures = [];
    }

    console.log('✅ House fetched successfully');
    res.json(house);
  } catch (err) {
    console.error('❌ Error fetching house:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get houses by owner
// route GET /api/houses/owner/:owner_id

const getHousesByOwner = async (req, res) => {
  const { owner_id } = req.params;

  console.log('=== GET HOUSES BY OWNER ===');
  console.log('Owner ID:', owner_id);

  try {
   
    const ownerIdNum = parseInt(owner_id);
    if (isNaN(ownerIdNum) || ownerIdNum <= 0) {
      return res.status(400).json({ 
        error: 'Invalid owner ID format',
        received: owner_id
      });
    }

    
    const query = `
      SELECT h.*, o.name as owner_name, o.contact as owner_phone, o.email as owner_email
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      WHERE h.owner_id = ? 
      ORDER BY h.created_at DESC
    `;

    console.log('Executing query:', query);
    console.log('With owner_id:', ownerIdNum);

    const [rows] = await pool.query(query, [ownerIdNum]);
    console.log(`✅ Found ${rows.length} houses for owner ${ownerIdNum}`);

   
    const processedHouses = rows.map(house => {
     
      let parsedImages = [];
      try {
        if (house.images) {
          parsedImages = JSON.parse(house.images);
          if (!Array.isArray(parsedImages)) {
            parsedImages = [parsedImages];
          }
        }
      } catch (e) {
        console.warn('Error parsing images for house', house.id, ':', e.message);
        parsedImages = [];
      }

      
      let parsedFeatures = [];
      let parsedShortFeatures = [];
      try {
        parsedFeatures = house.features ? JSON.parse(house.features) : [];
        parsedShortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];
      } catch (e) {
        console.warn('Error parsing features for house', house.id, ':', e.message);
        parsedFeatures = [];
        parsedShortFeatures = [];
      }

     
      house.imageCount = parsedImages.length;
      
      
      if (!house.status) {
        house.status = house.confirmed ? 'approved' : 'pending';
      }

      
      house.statusLabel = house.status === 'pending' ? '⏳ Pending Review' :
                         house.status === 'approved' ? '✅ Approved & Live' :
                         house.status === 'rejected' ? '❌ Rejected' : 'Unknown';

      house.isLive = house.status === 'approved' && house.confirmed === 1;

      return {
        ...house,
        features: parsedFeatures,
        shortFeatures: parsedShortFeatures,
        images: parsedImages
      };
    });

    console.log('✅ Processed houses with status info');
    res.json(processedHouses);

  } catch (error) {
    console.error('❌ Error fetching houses by owner:', error);
    res.status(500).json({ 
      error: 'Failed to fetch houses',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


//  Update house
// route PUT /api/houses/:id

const updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('📝 Updating house:', id, 'with data:', updateData);

    // Build dynamic SQL query based on provided fields
    const updateFields = [];
    const updateValues = [];

    // List of allowed fields to update
    const allowedFields = [
      'title', 'roomType', 'genderAllowed', 'price', 'address', 
      'city', 'type', 'location', 'googleMapsUrl', 'highlights', 'shortTerm', 
      'pricePerNight', 'description', 'availabilityStatus', 
      'availableDate', 'bookingStatus'
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

    // Add updated timestamp
    updateFields.push('updated_at = NOW()');
    updateValues.push(id); 

    const sql = `UPDATE houses SET ${updateFields.join(', ')} WHERE id = ?`;
    
    console.log('Update SQL:', sql);
    console.log('Update values:', updateValues);

    const [result] = await pool.query(sql, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    console.log('✅ House updated successfully');
    res.json({ message: 'House updated successfully' });
  } catch (error) {
    console.error('❌ Error updating house:', error);
    res.status(500).json({ 
      error: 'Failed to update house',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


//  Delete house
// @route DELETE /api/houses/:id

const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting house:', id);

    const [result] = await pool.query('DELETE FROM houses WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    console.log('✅ House deleted successfully');
    res.json({ message: 'House deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting house:', error);
    res.status(500).json({ 
      error: 'Failed to delete house',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Update availability status
// PUT /api/houses/:id/availability

const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availabilityStatus, availableDate } = req.body;

    console.log('📅 Updating availability for house:', id, { availabilityStatus, availableDate });

    const sql = `
      UPDATE houses 
      SET availabilityStatus = ?, availableDate = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const [result] = await pool.query(sql, [availabilityStatus, availableDate, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    console.log('✅ Availability updated successfully');
    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error('❌ Error updating availability:', error);
    res.status(500).json({ 
      error: 'Failed to update availability',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


//  Update booking status
// PUT /api/houses/:id/booking-status

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    console.log('📋 Updating booking status for house:', id, { bookingStatus });

    const sql = `
      UPDATE houses 
      SET bookingStatus = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const [result] = await pool.query(sql, [bookingStatus, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    console.log('✅ Booking status updated successfully');
    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    res.status(500).json({ 
      error: 'Failed to update booking status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


module.exports = {
  addHouse,
  getAllHouses,
  getHouseById,       
  getHousesByOwner,
  updateHouse,
  deleteHouse,
  updateAvailability,
  updateBookingStatus
};