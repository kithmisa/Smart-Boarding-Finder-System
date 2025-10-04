// Vercel Function: Get All Houses
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { search, city, roomType, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT h.*, o.name as owner_name, o.email as owner_email, o.contact as owner_phone
      FROM houses h
      LEFT JOIN owner o ON h.owner_id = o.id
      WHERE h.status = 'confirmed' AND h.availabilityStatus = 'available'
    `;
    
    const params = [];
    let paramCount = 0;

    // Add search filters
    if (search) {
      paramCount++;
      query += ` AND (h.title ILIKE $${paramCount} OR h.description ILIKE $${paramCount} OR h.address ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (city) {
      paramCount++;
      query += ` AND h.city ILIKE $${paramCount}`;
      params.push(`%${city}%`);
    }

    if (roomType) {
      paramCount++;
      query += ` AND h.roomType = $${paramCount}`;
      params.push(roomType);
    }

    if (minPrice) {
      paramCount++;
      query += ` AND h.price >= $${paramCount}`;
      params.push(minPrice);
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND h.price <= $${paramCount}`;
      params.push(maxPrice);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` ORDER BY h.created_at DESC LIMIT $${paramCount}`;
    params.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await sql.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM houses h
      WHERE h.status = 'confirmed' AND h.availabilityStatus = 'available'
    `;
    
    const countParams = [];
    let countParamCount = 0;

    if (search) {
      countParamCount++;
      countQuery += ` AND (h.title ILIKE $${countParamCount} OR h.description ILIKE $${countParamCount} OR h.address ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    if (city) {
      countParamCount++;
      countQuery += ` AND h.city ILIKE $${countParamCount}`;
      countParams.push(`%${city}%`);
    }

    if (roomType) {
      countParamCount++;
      countQuery += ` AND h.roomType = $${countParamCount}`;
      countParams.push(roomType);
    }

    if (minPrice) {
      countParamCount++;
      countQuery += ` AND h.price >= $${countParamCount}`;
      countParams.push(minPrice);
    }

    if (maxPrice) {
      countParamCount++;
      countQuery += ` AND h.price <= $${countParamCount}`;
      countParams.push(maxPrice);
    }

    const countResult = await sql.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({ error: 'Failed to fetch houses: ' + error.message });
  }
}
