const pool = require('../db');

// Test database connection
const testConnection = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT 1 as test');
    res.json({
      success: true,
      message: 'Database connection successful',
      data: result[0]
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
};

// Submit a website rating
const submitRating = async (req, res) => {
  try {
    const { rating, comment, userId } = req.body; // Get userId from request body
    const ipAddress = req.ip || req.connection.remoteAddress;

    console.log('=== RATING SUBMISSION DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Rating submission attempt:', { rating, comment, userId, ipAddress });
    console.log('User ID type:', typeof userId, 'Value:', userId);

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      console.log('❌ Rating validation failed');
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // First, check if the table exists
    try {
      await pool.execute('SELECT 1 FROM website_ratings LIMIT 1');
      console.log('✅ Table exists');
    } catch (tableError) {
      console.error('❌ Table does not exist:', tableError);
      return res.status(500).json({
        success: false,
        message: 'Rating system not properly configured. Please contact administrator.'
      });
    }

    // Check if user has already rated in the last 24 hours (if authenticated)
    if (userId) {
      console.log('🔍 Checking for authenticated user rating...');
      console.log('User ID to check:', userId);
      
      const [recentRating] = await pool.execute(
        'SELECT id FROM website_ratings WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)',
        [userId]
      );
      
      console.log('Recent rating query result:', recentRating);
      console.log('Number of recent ratings found:', recentRating.length);

      if (recentRating.length > 0) {
        console.log('❌ User has rated recently, blocking submission');
        return res.status(400).json({ 
          success: false, 
          message: 'You can only rate once per 24 hours' 
        });
      }
      console.log('✅ User can rate (no recent ratings found)');
    }

    // For anonymous users, check if this specific IP has rated recently
    // This prevents anonymous spam from the same IP
    if (!userId) {
      console.log('🔍 Checking for anonymous IP rating...');
      console.log('IP address to check:', ipAddress);
      
      const [recentRating] = await pool.execute(
        'SELECT id FROM website_ratings WHERE ip_address = ? AND user_id IS NULL AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)',
        [ipAddress]
      );
      
      console.log('Anonymous IP rating query result:', recentRating);
      console.log('Number of anonymous ratings found:', recentRating.length);

      if (recentRating.length > 0) {
        console.log('❌ IP has rated recently, blocking submission');
        return res.status(400).json({ 
          success: false, 
          message: 'You can only rate once per 24 hours' 
        });
      }
      console.log('✅ Anonymous user can rate (no recent IP ratings found)');
    }

    // Insert the rating
    console.log('💾 Inserting new rating...');
    const [result] = await pool.execute(
      'INSERT INTO website_ratings (user_id, rating, comment, ip_address) VALUES (?, ?, ?, ?)',
      [userId, rating, comment || null, ipAddress]
    );

    console.log('✅ Rating submitted successfully:', result.insertId);
    console.log('=== END DEBUG ===');

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      ratingId: result.insertId
    });

  } catch (error) {
    console.error('❌ Error submitting rating:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get website rating statistics
const getRatingStats = async (req, res) => {
  try {
    const [stats] = await pool.execute(
      'SELECT * FROM website_ratings_summary'
    );

    if (stats.length === 0) {
      return res.json({
        success: true,
        data: {
          totalRatings: 0,
          averageRating: 0,
          ratingDistribution: {
            fiveStar: 0,
            fourStar: 0,
            threeStar: 0,
            twoStar: 0,
            oneStar: 0
          }
        }
      });
    }

    const data = stats[0];
    res.json({
      success: true,
      data: {
        totalRatings: data.total_ratings,
        averageRating: parseFloat(data.average_rating).toFixed(1),
        ratingDistribution: {
          fiveStar: data.five_star,
          fourStar: data.four_star,
          threeStar: data.three_star,
          twoStar: data.two_star,
          oneStar: data.one_star
        }
      }
    });

  } catch (error) {
    console.error('Error getting rating stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get recent ratings (for admin purposes)
const getRecentRatings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const [ratings] = await pool.execute(
      `SELECT wr.*, u.username, u.email 
       FROM website_ratings wr 
       LEFT JOIN users u ON wr.user_id = u.id 
       ORDER BY wr.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.json({
      success: true,
      data: ratings
    });

  } catch (error) {
    console.error('Error getting recent ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete a rating (admin only)
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if rating exists
    const [rating] = await pool.execute(
      'SELECT id FROM website_ratings WHERE id = ?',
      [id]
    );

    if (rating.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Delete the rating
    await pool.execute(
      'DELETE FROM website_ratings WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  testConnection,
  submitRating,
  getRatingStats,
  getRecentRatings,
  deleteRating
};
