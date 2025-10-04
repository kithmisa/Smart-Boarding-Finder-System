// Vercel Function: Get House by ID
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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'House ID is required' });
    }

    // Get house details with owner information
    const houseResult = await sql`
      SELECT h.*, o.name as owner_name, o.email as owner_email, o.contact as owner_phone
      FROM houses h
      LEFT JOIN owner o ON h.owner_id = o.id
      WHERE h.id = ${id}
    `;

    if (houseResult.rows.length === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    const house = houseResult.rows[0];

    // Get reviews for this house
    const reviewsResult = await sql`
      SELECT r.*, u.username, u.first_name, u.last_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.boarding_id = ${id}
      ORDER BY r.created_at DESC
    `;

    // Get average ratings
    const ratingResult = await sql`
      SELECT 
        AVG(rating) as average_rating,
        AVG(cleanliness) as avg_cleanliness,
        AVG(location) as avg_location,
        AVG(value) as avg_value,
        AVG(amenities) as avg_amenities,
        COUNT(*) as total_reviews
      FROM reviews
      WHERE boarding_id = ${id}
    `;

    const ratings = ratingResult.rows[0];

    res.status(200).json({
      success: true,
      data: {
        ...house,
        reviews: reviewsResult.rows,
        ratings: {
          average_rating: parseFloat(ratings.average_rating) || 0,
          avg_cleanliness: parseFloat(ratings.avg_cleanliness) || 0,
          avg_location: parseFloat(ratings.avg_location) || 0,
          avg_value: parseFloat(ratings.avg_value) || 0,
          avg_amenities: parseFloat(ratings.avg_amenities) || 0,
          total_reviews: parseInt(ratings.total_reviews) || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching house:', error);
    res.status(500).json({ error: 'Failed to fetch house: ' + error.message });
  }
}
