const db = require('../db');

// Check if a house is in user's favorites
const checkFavoriteStatus = async (req, res) => {
  try {
    const { houseId } = req.params;
    const { userId } = req.query;

    if (!userId || !houseId) {
      return res.status(400).json({ error: 'User ID and House ID are required' });
    }

    const connection = await db.getConnection();
    
    try {
      const [favorites] = await connection.execute(
        'SELECT id FROM favorites WHERE user_id = ? AND house_id = ?',
        [userId, houseId]
      );

      res.status(200).json({
        isFavorite: favorites.length > 0,
        message: favorites.length > 0 ? 'House is in favorites' : 'House is not in favorites'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Failed to check favorite status: ' + error.message });
  }
};

// Toggle favorite (add/remove)
const toggleFavorite = async (req, res) => {
  try {
    const { userId, houseId } = req.body;

    if (!userId || !houseId) {
      return res.status(400).json({ error: 'User ID and House ID are required' });
    }

    const connection = await db.getConnection();
    
    try {
      // Check if already in favorites
      const [existing] = await connection.execute(
        'SELECT id FROM favorites WHERE user_id = ? AND house_id = ?',
        [userId, houseId]
      );

      if (existing.length > 0) {
        // Remove from favorites
        await connection.execute(
          'DELETE FROM favorites WHERE user_id = ? AND house_id = ?',
          [userId, houseId]
        );

        res.status(200).json({
          isFavorite: false,
          message: 'Removed from favorites'
        });
      } else {
        // Add to favorites
        await connection.execute(
          'INSERT INTO favorites (user_id, house_id) VALUES (?, ?)',
          [userId, houseId]
        );

        res.status(200).json({
          isFavorite: true,
          message: 'Added to favorites'
        });
      }

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite: ' + error.message });
  }
};

// Get user's favorites
const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const connection = await db.getConnection();
    
    try {
      const [favorites] = await connection.execute(
        `SELECT h.id, h.title, h.address, h.city, h.location, h.price, h.roomType, h.type, 
                h.genderAllowed, h.shortTerm, h.pricePerNight, h.images, h.created_at, 
                f.created_at as favorited_at
         FROM houses h
         JOIN favorites f ON h.id = f.house_id
         WHERE f.user_id = ?
         ORDER BY f.created_at DESC`,
        [userId]
      );

      console.log('🔍 Raw favorites from database:', favorites);
      
      const processedFavorites = favorites.map(favorite => {
        let parsedImages = [];
        
        try {
          if (favorite.images) {
            console.log('🖼️ Raw images for house', favorite.id, ':', favorite.images);
            parsedImages = JSON.parse(favorite.images);
            console.log('✅ Parsed images:', parsedImages);
          }
        } catch (parseError) {
          console.error('❌ Error parsing images for house', favorite.id, ':', parseError.message);
          console.log('🖼️ Raw images value:', favorite.images);
          parsedImages = [];
        }
        
        return {
          id: favorite.id,
          title: favorite.title,
          address: favorite.address,
          city: favorite.city,
          location: favorite.location,
          price: favorite.price,
          roomType: favorite.roomType,
          type: favorite.type,
          genderAllowed: favorite.genderAllowed,
          shortTerm: favorite.shortTerm,
          pricePerNight: favorite.pricePerNight,
          images: parsedImages,
          createdAt: favorite.created_at,
          favoritedAt: favorite.favorited_at
        };
      });
      
      console.log('🎯 Processed favorites:', processedFavorites);
      
      res.status(200).json({
        favorites: processedFavorites
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error getting user favorites:', error);
    res.status(500).json({ error: 'Failed to get favorites: ' + error.message });
  }
};

module.exports = {
  checkFavoriteStatus,
  toggleFavorite,
  getUserFavorites
};
