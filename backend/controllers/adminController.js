const db = require('../db');
const nodemailer = require('nodemailer');
const { decrypt, maskData, maskAccountNumber } = require('../utils/encryption');
require('dotenv').config();

// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Admin login
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt", { username, password });

  try {
    const [rows] = await db.query("SELECT * FROM admins WHERE username = ? AND password = ?", [username, password]);

    if (rows.length === 1) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Select all fields except password_hash and reset_token for security
                    const [users] = await db.query(`
                  SELECT
                    id,
                    username,
                    email,
                    first_name,
                    last_name,
                    phone,
                    role,
                    status,
                    created_at,
                    updated_at
                  FROM users
                  ORDER BY created_at DESC
                `);

    // Get activity summaries for each user
    const usersWithActivity = await Promise.all(
      users.map(async (user) => {
        try {
          // Get visit requests summary with boarding house details
          const [visitRequests] = await db.query(`
            SELECT 
              COUNT(*) as total_requests,
              SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
              SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_requests,
              SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_requests
            FROM visit_requests 
            WHERE user_id = ?
          `, [user.id]);

          // Get detailed visit requests with boarding house information
          const [visitRequestsDetails] = await db.query(`
            SELECT 
              vr.id,
              vr.status,
              vr.requested_date,
              vr.created_at,
              h.id as house_id,
              h.title as house_title,
              h.address as house_address
            FROM visit_requests vr
            JOIN houses h ON vr.boarding_id = h.id
            WHERE vr.user_id = ?
            ORDER BY vr.created_at DESC
            LIMIT 10
          `, [user.id]);

          // Get waiting list summary
          const [waitingList] = await db.query(`
            SELECT 
              COUNT(*) as total_waiting,
              SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) as active_waiting,
              SUM(CASE WHEN status = 'notified' THEN 1 ELSE 0 END) as notified_waiting
            FROM waiting_list 
            WHERE user_id = ?
          `, [user.id]);

          // Get detailed waiting list with boarding house information
          const [waitingListDetails] = await db.query(`
            SELECT 
              wl.id,
              wl.status,
              wl.joined_at,
              wl.notified_at,
              h.id as house_id,
              h.title as house_title,
              h.address as house_address
            FROM waiting_list wl
            JOIN houses h ON wl.house_id = h.id
            WHERE wl.user_id = ?
            ORDER BY wl.joined_at DESC
            LIMIT 10
          `, [user.id]);

          // Get reviews summary
          const [reviews] = await db.query(`
            SELECT 
              COUNT(*) as total_reviews,
              AVG(rating) as average_rating,
              AVG(cleanliness) as avg_cleanliness,
              AVG(location) as avg_location,
              AVG(value) as avg_value,
              AVG(amenities) as avg_amenities
            FROM reviews 
            WHERE user_id = ?
          `, [user.id]);

          // Get detailed reviews with boarding house information
          const [reviewsDetails] = await db.query(`
            SELECT 
              r.id,
              r.rating,
              r.title,
              r.comment,
              r.cleanliness,
              r.location,
              r.value,
              r.amenities,
              r.created_at,
              h.id as house_id,
              h.title as house_title,
              h.address as house_address
            FROM reviews r
            JOIN houses h ON r.boarding_id = h.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
            LIMIT 10
          `, [user.id]);

          // Get bookings summary (including short-term stays) - COMMENTED OUT UNTIL BOOKINGS TABLE IS CREATED
          // const [bookings] = await db.query(`
          //   SELECT 
          //     COUNT(*) as total_bookings,
          //     SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
          //     SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
          //     SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings
          //   FROM bookings 
          //   WHERE user_id = ?
          // `, [user.id]);
          const bookings = [{ total_bookings: 0, pending_bookings: 0, confirmed_bookings: 0, cancelled_bookings: 0 }];

          // Get recent activity (last 30 days)
          const [recentActivity] = await db.query(`
            SELECT 
              (SELECT COUNT(*) FROM visit_requests WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recent_visits,
              (SELECT COUNT(*) FROM waiting_list WHERE user_id = ? AND joined_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recent_waiting,
              (SELECT COUNT(*) FROM reviews WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recent_reviews,
              0 as recent_bookings
          `, [user.id, user.id, user.id]);

          // Convert string values to numbers for proper display
          const reviewsData = reviews[0] || { total_reviews: 0, average_rating: 0, avg_cleanliness: 0, avg_location: 0, avg_value: 0, avg_amenities: 0 };
          const processedReviews = {
            ...reviewsData,
            average_rating: reviewsData.average_rating ? parseFloat(reviewsData.average_rating) : 0,
            avg_cleanliness: reviewsData.avg_cleanliness ? parseFloat(reviewsData.avg_cleanliness) : 0,
            avg_location: reviewsData.avg_location ? parseFloat(reviewsData.avg_location) : 0,
            avg_value: reviewsData.avg_value ? parseFloat(reviewsData.avg_value) : 0,
            avg_amenities: reviewsData.avg_amenities ? parseFloat(reviewsData.avg_amenities) : 0
          };

          // Use recent activity data as fallback if summary shows 0 but we have details
          const recentData = recentActivity[0] || { recent_visits: 0, recent_waiting: 0, recent_reviews: 0, recent_bookings: 0 };
          
          const userWithActivity = {
            ...user,
            activity: {
              visitRequests: {
                summary: visitRequests[0] || { 
                  total_requests: visitRequestsDetails.length || recentData.recent_visits, 
                  pending_requests: 0, 
                  confirmed_requests: 0, 
                  rejected_requests: 0 
                },
                details: visitRequestsDetails || []
              },
              waitingList: {
                summary: waitingList[0] || { 
                  total_waiting: waitingListDetails.length || recentData.recent_waiting, 
                  active_waiting: 0, 
                  notified_waiting: 0 
                },
                details: waitingListDetails || []
              },
              reviews: {
                summary: {
                  ...processedReviews,
                  total_reviews: processedReviews.total_reviews || reviewsDetails.length || recentData.recent_reviews
                },
                details: reviewsDetails || []
              },
              bookings: bookings[0] || { total_bookings: 0, pending_bookings: 0, confirmed_bookings: 0, cancelled_bookings: 0 },
              recentActivity: recentData
            }
          };

          // Debug logging for first user (commented out after fixing data structure)
          // if (user.id === users[0]?.id) {
          //   console.log(`🔍 Debug - User ${user.id} activity data:`, {
          //     visitRequests: visitRequests[0],
          //     waitingList: waitingList[0],
          //     reviews: reviews[0],
          //     recentActivity: recentActivity[0],
          //     visitRequestsDetails: visitRequestsDetails.length,
          //     waitingListDetails: waitingListDetails.length,
          //     reviewsDetails: reviewsDetails.length
          //   });
          // }

          return userWithActivity;
        } catch (activityError) {
          console.error(`Error fetching activity for user ${user.id}:`, activityError);
          return {
            ...user,
            activity: {
              visitRequests: { total_requests: 0, pending_requests: 0, confirmed_requests: 0, rejected_requests: 0 },
              waitingList: { total_waiting: 0, active_waiting: 0, notified_waiting: 0 },
              reviews: { total_reviews: 0, average_rating: 0, avg_cleanliness: 0, avg_location: 0, avg_value: 0, avg_amenities: 0 },
              bookings: { total_bookings: 0, pending_bookings: 0, confirmed_bookings: 0, cancelled_bookings: 0 },
              recentActivity: { recent_visits: 0, recent_waiting: 0, recent_reviews: 0, recent_bookings: 0 }
            }
          };
        }
      })
    );

    res.json({ success: true, users: usersWithActivity });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// Get all owners with activity data
const getAllOwners = async (req, res) => {
  try {
    // Select all owner fields
    const [owners] = await db.query(`
      SELECT
        id,
        name,
        email,
        nic,
        contact
      FROM owner
      ORDER BY id DESC
    `);

    // Get activity summaries for each owner and decrypt NIC
    const ownersWithActivity = await Promise.all(
      owners.map(async (owner) => {
        try {
          // Decrypt and mask NIC for security
          const decryptedNIC = decrypt(owner.nic);
          const maskedNIC = maskData(decryptedNIC, 4);
          
          // Update owner object with both original and masked NIC
          const ownerWithMaskedNIC = {
            ...owner,
            nic: maskedNIC,           // For display
            nic_original: decryptedNIC // For search functionality
          };
          // Get properties summary
          const [properties] = await db.query(`
            SELECT
              COUNT(*) as total_properties,
              SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_properties,
              SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_properties,
              SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_properties
            FROM houses
            WHERE owner_id = ?
          `, [owner.id]);

          // Get recent properties (last 5)
          const [recentProperties] = await db.query(`
            SELECT
              h.id,
              h.title,
              h.location,
              h.price,
              h.status,
              h.availabilityStatus,
              h.created_at
            FROM houses h
            WHERE h.owner_id = ?
            ORDER BY h.created_at DESC
            LIMIT 5
          `, [owner.id]);

          // Get visit requests for owner's properties
          const [visitRequests] = await db.query(`
            SELECT
              COUNT(*) as total_requests,
              SUM(CASE WHEN vr.status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
              SUM(CASE WHEN vr.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_requests,
              SUM(CASE WHEN vr.status = 'rejected' THEN 1 ELSE 0 END) as rejected_requests
            FROM visit_requests vr
            JOIN houses h ON vr.boarding_id = h.id
            WHERE h.owner_id = ?
          `, [owner.id]);

          // Get recent visit requests (last 5)
          const [recentVisitRequests] = await db.query(`
            SELECT
              vr.id as request_id,
              vr.boarding_id as house_id,
              h.title as house_title,
              h.address as house_address,
              vr.status,
              vr.requested_date,
              vr.created_at,
              u.username as user_name,
              u.email as user_email
            FROM visit_requests vr
            JOIN houses h ON vr.boarding_id = h.id
            JOIN users u ON vr.user_id = u.id
            WHERE h.owner_id = ?
            ORDER BY vr.created_at DESC
            LIMIT 5
          `, [owner.id]);

          // Get reviews for owner's properties
          const [reviews] = await db.query(`
            SELECT
              COUNT(*) as total_reviews,
              AVG(rating) as average_rating,
              AVG(cleanliness) as avg_cleanliness,
              AVG(r.location) as avg_location,
              AVG(value) as avg_value,
              AVG(amenities) as avg_amenities
            FROM reviews r
            JOIN houses h ON r.boarding_id = h.id
            WHERE h.owner_id = ?
          `, [owner.id]);

          // Get recent reviews (last 5)
          const [recentReviews] = await db.query(`
            SELECT
              r.id as review_id,
              r.boarding_id as house_id,
              h.title as house_title,
              h.address as house_address,
              r.rating,
              r.title as review_title,
              r.comment as review_comment,
              r.created_at,
              u.username as user_name
            FROM reviews r
            JOIN houses h ON r.boarding_id = h.id
            JOIN users u ON r.user_id = u.id
            WHERE h.owner_id = ?
            ORDER BY r.created_at DESC
            LIMIT 5
          `, [owner.id]);

          // Get waiting list for owner's properties
          const [waitingList] = await db.query(`
            SELECT
              COUNT(*) as total_waiting,
              SUM(CASE WHEN wl.status = 'waiting' THEN 1 ELSE 0 END) as active_waiting,
              SUM(CASE WHEN wl.status = 'notified' THEN 1 ELSE 0 END) as notified_waiting
            FROM waiting_list wl
            JOIN houses h ON wl.house_id = h.id
            WHERE h.owner_id = ?
          `, [owner.id]);

          // Get recent waiting list entries (last 5)
          const [recentWaitingList] = await db.query(`
            SELECT
              wl.id as waiting_id,
              wl.house_id,
              h.title as house_title,
              h.address as house_address,
              wl.status,
              wl.joined_at,
              wl.notified_at,
              u.username as user_name,
              u.email as user_email
            FROM waiting_list wl
            JOIN houses h ON wl.house_id = h.id
            JOIN users u ON wl.user_id = u.id
            WHERE h.owner_id = ?
            ORDER BY wl.joined_at DESC
            LIMIT 5
          `, [owner.id]);

          // Get recent activity (30 days)
          const [recentActivity] = await db.query(`
            SELECT
              (SELECT COUNT(*) FROM houses h WHERE h.owner_id = ? AND h.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recent_properties,
              (SELECT COUNT(*) FROM visit_requests vr JOIN houses h ON vr.boarding_id = h.id WHERE h.owner_id = ? AND vr.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recent_visits,
              (SELECT COUNT(*) FROM reviews r JOIN houses h ON r.boarding_id = h.id WHERE h.owner_id = ? AND r.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recent_reviews,
              (SELECT COUNT(*) FROM waiting_list wl JOIN houses h ON wl.house_id = h.id WHERE h.owner_id = ? AND wl.joined_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recent_waiting
          `, [owner.id, owner.id, owner.id, owner.id]);

          // Process reviews data with type conversion
          const reviewsData = reviews[0] || { total_reviews: 0, average_rating: 0, avg_cleanliness: 0, avg_location: 0, avg_value: 0, avg_amenities: 0 };
          const processedReviews = {
            ...reviewsData,
            average_rating: reviewsData.average_rating ? parseFloat(reviewsData.average_rating) : 0,
            avg_cleanliness: reviewsData.avg_cleanliness ? parseFloat(reviewsData.avg_cleanliness) : 0,
            avg_location: reviewsData.avg_location ? parseFloat(reviewsData.avg_location) : 0,
            avg_value: reviewsData.avg_value ? parseFloat(reviewsData.avg_value) : 0,
            avg_amenities: reviewsData.avg_amenities ? parseFloat(reviewsData.avg_amenities) : 0
          };

          const recentData = recentActivity[0] || { recent_properties: 0, recent_visits: 0, recent_reviews: 0, recent_waiting: 0 };

          const ownerWithActivity = {
            ...owner,
            activity: {
              properties: {
                summary: properties[0] || {
                  total_properties: recentProperties.length || recentData.recent_properties,
                  pending_properties: 0,
                  approved_properties: 0,
                  rejected_properties: 0,
                  available_properties: 0,
                  unavailable_properties: 0
                },
                details: recentProperties || []
              },
              visitRequests: {
                summary: visitRequests[0] || {
                  total_requests: recentVisitRequests.length || recentData.recent_visits,
                  pending_requests: 0,
                  confirmed_requests: 0,
                  rejected_requests: 0
                },
                details: recentVisitRequests || []
              },
              reviews: {
                summary: {
                  ...processedReviews,
                  total_reviews: processedReviews.total_reviews || recentReviews.length || recentData.recent_reviews
                },
                details: recentReviews || []
              },
              waitingList: {
                summary: waitingList[0] || {
                  total_waiting: recentWaitingList.length || recentData.recent_waiting,
                  active_waiting: 0,
                  notified_waiting: 0
                },
                details: recentWaitingList || []
              },
              recentActivity: recentData
            }
          };

          return {
            ...ownerWithActivity,
            ...ownerWithMaskedNIC
          };
        } catch (activityError) {
          console.error(`Error fetching activity for owner ${owner.id}:`, activityError);
          return {
            ...ownerWithMaskedNIC,
            activity: {
              properties: { summary: { total_properties: 0, pending_properties: 0, approved_properties: 0, rejected_properties: 0, available_properties: 0, unavailable_properties: 0 }, details: [] },
              visitRequests: { summary: { total_requests: 0, pending_requests: 0, confirmed_requests: 0, rejected_requests: 0 }, details: [] },
              reviews: { summary: { total_reviews: 0, average_rating: 0, avg_cleanliness: 0, avg_location: 0, avg_value: 0, avg_amenities: 0 }, details: [] },
              waitingList: { summary: { total_waiting: 0, active_waiting: 0, notified_waiting: 0 }, details: [] },
              recentActivity: { recent_properties: 0, recent_visits: 0, recent_reviews: 0, recent_waiting: 0 }
            }
          };
        }
      })
    );

    res.json({ success: true, owners: ownersWithActivity });
  } catch (err) {
    console.error("Error fetching owners:", err);
    res.status(500).json({ success: false, message: "Error fetching owners" });
  }
};

// Get waiting list for a specific house (for owner notifications)
const getHouseWaitingList = async (req, res) => {
  try {
    const houseId = req.params.houseId;
    
    // Get waiting list for this house
    const [waitingList] = await db.query(`
      SELECT 
        wl.id as waiting_id,
        wl.user_id,
        wl.name,
        wl.email,
        wl.phone,
        wl.message,
        wl.status,
        wl.joined_at,
        wl.notified_at,
        u.username,
        u.first_name,
        u.last_name
      FROM waiting_list wl
      LEFT JOIN users u ON wl.user_id = u.id
      WHERE wl.house_id = ?
      ORDER BY wl.joined_at DESC
    `, [houseId]);

    res.json({ 
      success: true, 
      waitingList: waitingList || []
    });
  } catch (err) {
    console.error("Error fetching house waiting list:", err);
    res.status(500).json({ success: false, message: "Error fetching waiting list" });
  }
};

// Get house details with waiting list notifications
const getHouseDetails = async (req, res) => {
  try {
    const houseId = req.params.id;
    
    // Get house details
    const [houses] = await db.query(`
      SELECT h.*, o.name as owner_name, o.email as owner_email, o.contact as owner_phone
      FROM houses h
      LEFT JOIN owner o ON h.owner_id = o.id
      WHERE h.id = ?
    `, [houseId]);

    if (houses.length === 0) {
      return res.status(404).json({ success: false, message: "House not found" });
    }

    const house = houses[0];

    // Get waiting list notifications for this house
    const [waitingList] = await db.query(`
      SELECT 
        wl.id as waiting_id,
        wl.user_id,
        wl.status,
        wl.joined_at,
        wl.notified_at,
        u.username,
        u.email as user_email,
        u.first_name,
        u.last_name,
        u.phone as user_phone
      FROM waiting_list wl
      JOIN users u ON wl.user_id = u.id
      WHERE wl.house_id = ?
      ORDER BY wl.joined_at DESC
    `, [houseId]);

    // Get visit requests for this house
    const [visitRequests] = await db.query(`
      SELECT 
        vr.id as request_id,
        vr.user_id,
        vr.status,
        vr.requested_date,
        vr.created_at,
        u.username,
        u.email as user_email,
        u.first_name,
        u.last_name,
        u.phone as user_phone
      FROM visit_requests vr
      JOIN users u ON vr.user_id = u.id
      WHERE vr.boarding_id = ?
      ORDER BY vr.created_at DESC
    `, [houseId]);

    // Get reviews for this house
    const [reviews] = await db.query(`
      SELECT 
        r.id as review_id,
        r.user_id,
        r.rating,
        r.title as review_title,
        r.comment as review_comment,
        r.created_at,
        u.username,
        u.email as user_email,
        u.first_name,
        u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.boarding_id = ?
      ORDER BY r.created_at DESC
    `, [houseId]);

    // Process images if they exist
    let processedImages = [];
    if (house.images) {
      try {
        // Try to parse as JSON first
        processedImages = JSON.parse(house.images);
      } catch (e) {
        // If not JSON, try splitting by comma
        processedImages = house.images.split(',').map(img => img.trim()).filter(img => img);
      }
    }

    res.json({ 
      success: true, 
      house: {
        ...house,
        images: processedImages,
        notifications: {
          waitingList: waitingList || [],
          visitRequests: visitRequests || [],
          reviews: reviews || []
        }
      }
    });
  } catch (err) {
    console.error("Error fetching house details:", err);
    res.status(500).json({ success: false, message: "Error fetching house details" });
  }
};

// Get all user comments
const getAllComments = async (req, res) => {
  try {
    const [comments] = await db.query("SELECT * FROM contact_messages");
    res.json({ success: true, comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ success: false, message: "Error fetching comments" });
  }
};

// Get all houses
/*const getAllHouses = async (req, res) => {
  try {
    const [houses] = await db.query("SELECT * FROM houses");
    res.json({ success: true, houses });
  } catch (err) {
    console.error("Error fetching houses:", err);
    res.status(500).json({ success: false, message: "Error fetching houses" });
  }
};*/

// Get all boarding houses
const getAllHouses = async (req, res) => {
  try {
    const [houses] = await db.query(`
      SELECT 
        h.*, 
        o.name as owner_name,
        CASE WHEN EXISTS (
          SELECT 1 FROM payments p 
          WHERE p.house_id = h.id AND p.type = 'listing_fee' AND p.status = 'completed'
        ) THEN 1 ELSE 0 END AS listing_fee_paid
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      ORDER BY h.created_at DESC
    `);
    res.json({ success: true, houses });
  } catch (err) {
    console.error("Error fetching boarding houses:", err);
    res.status(500).json({ success: false, message: "Error fetching boarding houses" });
  }
};


const confirmHouse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      "UPDATE houses SET status = 'confirmed', confirmed = 1, confirmed_at = NOW() WHERE id = ?", 
      [id]
    );
    res.json({ success: true, message: "Boarding house confirmed successfully" });
  } catch (err) {
    console.error("Error confirming boarding house:", err);
    res.status(500).json({ success: false, message: "Error confirming boarding house" });
  }
};




const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

// Delete owner by id
const deleteOwner = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM owner WHERE id = ?", [id]);
    res.json({ success: true, message: "Owner deleted" });
  } catch (err) {
    console.error("Error deleting owner:", err);
    res.status(500).json({ success: false, message: "Error deleting owner" });
  }
};

// Delete comment by id
const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM contact_messages WHERE id = ?", [id]);
    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ success: false, message: "Error deleting comment" });
  }
};

// Delete house by id
const deleteHouse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM houses WHERE id = ?", [id]);
    res.json({ success: true, message: "House deleted" });
  } catch (err) {
    console.error("Error deleting house:", err);
    res.status(500).json({ success: false, message: "Error deleting house" });
  }
};

const replyToComment = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  
  if (!reply || !reply.trim()) {
    return res.status(400).json({ success: false, message: 'Reply content is required' });
  }
  
  try {
    // Get the existing message
    const [messages] = await db.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );
    
    if (messages.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    const message = messages[0];
    
    // Determine if this is an additional reply
    const isAdditional = message.reply ? true : false;
    
    // Construct the new reply content
    let newReply;
    let emailSubject;
    
    if (isAdditional) {
      newReply = `${message.reply}\n\n--- Additional Reply ---\n${reply}`;
      emailSubject = `Re: ${message.title} - Additional Response - Smart Boarding Finder`;
    } else {
      newReply = reply;
      emailSubject = `Re: ${message.title} - Smart Boarding Finder`;
    }
    
    // Update the database
    await db.query(
      'UPDATE contact_messages SET reply = ?, replied = 1, replied_at = NOW() WHERE id = ?',
      [newReply, id]
    );
    
    // Send email notification
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: {
        	name: 'Smart Boarding Finder',
        	address: process.env.EMAIL_USER
        },
        to: message.email,
        replyTo: process.env.REPLY_TO_EMAIL || process.env.EMAIL_USER,
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Smart Boarding Finder</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Response</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${message.name || 'there'}!</h2>
              
              <p style="font-size: 16px; margin: 0; color: #6a1b9a;">
                ${isAdditional ? 'Here is an additional response to your inquiry:' : 'Thank you for contacting us. Here is our response to your inquiry:'}
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <p style="font-size: 16px; margin: 0; color: #6a1b9a;"><strong>${isAdditional ? 'Additional Response:' : 'Our Response:'}</strong></p>
                <p style="font-size: 14px; margin: 10px 0 0 0; color: #424242; white-space: pre-wrap;">${reply}</p>
              </div>
              
              ${isAdditional && message.reply ? `
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
                <p style="font-size: 16px; margin: 0; color: #856404;"><strong>Previous Response:</strong></p>
                <p style="font-size: 14px; margin: 10px 0 0 0; color: #424242;">${message.reply}</p>
              </div>
              ` : ''}
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <p style="font-size: 16px; margin: 0; color: #28a745;"><strong>Your Original Message:</strong></p>
                <p style="font-size: 14px; margin: 10px 0 0 0; color: #424242;"><strong>Subject:</strong> ${message.title}</p>
                <p style="font-size: 14px; margin: 10px 0 0 0; color: #424242;">${message.comments}</p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
                If you have any further questions, please don't hesitate to contact us again.
              </p>
              
              <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">
                Best regards,<br>
                <strong>Smart Boarding Finder Team</strong>
              </p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${message.email}`);
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Don't fail the request if email fails, just log it
    }
    
    const responseMessage = isAdditional
      ? "Additional reply sent successfully and email notification delivered"
      : "Reply sent successfully and email notification delivered";
    
    res.json({ success: true, message: responseMessage });
    
  } catch (error) {
    console.error('❌ Error replying to comment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark all unread messages as read
const markAllMessagesAsRead = async (req, res) => {
  const { messageIds } = req.body;
  
  if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
    return res.status(400).json({ success: false, message: "Message IDs array is required" });
  }
  
  try {
    // Update all specified messages to mark them as read
    const placeholders = messageIds.map(() => '?').join(',');
    await db.query(
      `UPDATE contact_messages SET replied = 1, replied_at = NOW() WHERE id IN (${placeholders})`,
      messageIds
    );
    
    console.log(`✅ Marked ${messageIds.length} messages as read`);
    res.json({ success: true, message: `${messageIds.length} messages marked as read successfully` });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({ success: false, message: "Error marking messages as read" });
  }
};

// Sync email replies from IMAP inbox and attach to matching contact messages
const syncEmailReplies = async (req, res) => {
  const { ImapFlow } = require('imapflow');
  const { simpleParser } = require('mailparser');

  const host = process.env.IMAP_HOST || 'imap.gmail.com';
  const port = Number(process.env.IMAP_PORT || 993);
  const user = process.env.IMAP_USER || process.env.EMAIL_USER;
  const pass = process.env.IMAP_PASS || process.env.EMAIL_PASS;
  const includeSeen = (req.query && req.query.includeSeen === 'true') || (req.body && req.body.includeSeen === true);
  const fallbackLatest = (req.query && req.query.fallbackLatest === 'true') || (req.body && req.body.fallbackLatest === true);

  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: { user, pass }
  });

  let processed = 0;
  let matched = 0;
  try {
    await client.connect();
    await client.mailboxOpen('INBOX');

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const searchCriteria = includeSeen ? { since } : { seen: false, since };
    const uids = await client.search(searchCriteria);

    for (const uid of uids) {
      try {
        const data = await client.fetchOne(uid, { envelope: true, source: true, headers: true });
        if (!data) continue;

        const envelope = data.envelope || {};
        const source = data.source;
        const parsed = await simpleParser(source);

        const fromAddress = (envelope.from && envelope.from[0] && envelope.from[0].address)
          ? envelope.from[0].address.toLowerCase()
          : (parsed.from && parsed.from.value && parsed.from.value[0] && parsed.from.value[0].address
            ? parsed.from.value[0].address.toLowerCase()
            : null);

        const subject = (envelope.subject || parsed.subject || '').toString();
        const plainText = (parsed.text || '').trim();

        if (!fromAddress || !plainText) {
          await client.messageFlagsAdd(uid, ['\\Seen']);
          processed++;
          continue;
        }

        // Find most recent contact messages for this sender
        const [rows] = await db.query(
          'SELECT id, title, reply FROM contact_messages WHERE LOWER(email) = ? ORDER BY created_at DESC LIMIT 10',
          [fromAddress]
        );

        let target = null;
        const normalizedSubject = subject.toLowerCase();
        for (const row of rows) {
          const title = (row.title || '').toLowerCase();
          if (!title) continue;
          // Match if subject contains original title (common for "Re: title")
          if (normalizedSubject.includes(title)) {
            target = row;
            break;
          }
        }

        // Fallback: if only one message from sender exists, use it
        if (!target && rows.length === 1) {
          target = rows[0];
        }
        // Optional fallback: if multiple exist and no subject match, pick most recent
        if (!target && fallbackLatest && rows.length > 0) {
          target = rows[0]; // rows ordered by created_at DESC
        }

        if (target) {
          // Basic dedupe: avoid appending exact same text if already included
          const existing = (target.reply || '');
          const sample = plainText.substring(0, 120);
          if (!existing.includes(sample)) {
            const divider = '\n\n--- User Reply (' + new Date().toISOString() + ') ---\n';
            const newReply = (existing ? (existing + divider + plainText) : plainText);
            await db.query(
              'UPDATE contact_messages SET reply = ?, replied = 1, replied_at = NOW() WHERE id = ?',
              [newReply, target.id]
            );
            matched++;
          }
        }

        // Mark message as seen to avoid reprocessing
        await client.messageFlagsAdd(uid, ['\\Seen']);
        processed++;
      } catch (innerErr) {
        console.error('Error processing email uid', uid, innerErr);
      }
    }

    res.json({ success: true, message: `Synced emails. Processed: ${processed}, matched to messages: ${matched}` });
  } catch (err) {
    console.error('❌ IMAP sync failed:', err);
    res.status(500).json({ success: false, message: 'IMAP sync failed', error: err.message });
  } finally {
    try { await client.logout(); } catch (e) {}
  }
};

// Get all visit requests for admin
const getAllVisitRequests = async (req, res) => {
  try {
    const [visitRequests] = await db.query(`
      SELECT 
        vr.*,
        h.title as boarding_title,
        h.address as boarding_address,
        o.name as owner_name,
        o.contact as owner_phone,
        o.email as owner_email,
        u.username as user_username,
        u.first_name,
        u.last_name,
        u.email as user_email,
        u.phone as user_phone
      FROM visit_requests vr
      JOIN houses h ON vr.boarding_id = h.id
      LEFT JOIN owner o ON h.owner_id = o.id
      JOIN users u ON vr.user_id = u.id
      ORDER BY vr.created_at DESC
    `);

    res.json({
      success: true,
      visitRequests: visitRequests
    });
  } catch (error) {
    console.error('Error fetching visit requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch visit requests'
    });
  }
};

// Send email from admin
const sendEmail = async (req, res) => {
  try {
    const { to, subject, message, recipientName } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, message'
      });
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px 15px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Smart Boarding Finder</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px;">Hello ${recipientName || 'User'},</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                This message was sent by the Smart Boarding Finder administration team.
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
                If you have any questions, please contact us at ${process.env.EMAIL_USER}
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email: ' + error.message
    });
  }
};

// Get owner banking details
const getOwnerBankingDetails = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const [banking] = await db.query(`
      SELECT
        id,
        owner_id,
        account_holder_name,
        account_type,
        account_number,
        bank_name,
        branch_name,
        branch_code,
        created_at,
        updated_at
      FROM owner_bank_details
      WHERE owner_id = ?
    `, [ownerId]);

    if (banking.length === 0) {
      return res.status(200).json({ 
        success: true, 
        banking: null,
        message: 'No banking details found for this owner'
      });
    }

    // Decrypt and mask account number
    let accountNumber, maskedAccountNumber;
    
    try {
      // Try to decrypt (in case it's already encrypted)
      accountNumber = decrypt(banking[0].account_number);
      if (!accountNumber) {
        // If decryption fails, assume it's plain text
        accountNumber = banking[0].account_number;
      }
    } catch (error) {
      // If decryption throws error, use original (plain text)
      accountNumber = banking[0].account_number;
    }
    
    maskedAccountNumber = maskAccountNumber(accountNumber);

    const bankingDetails = {
      ...banking[0],
      account_number: maskedAccountNumber // Return masked account number for display
    };

    return res.status(200).json({ 
      success: true, 
      banking: bankingDetails
    });
  } catch (error) {
    console.error('Error fetching owner banking details:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching banking details' 
    });
  }
};

module.exports = {
  loginAdmin,
  getAllUsers,  
  getAllOwners,
  getAllComments,
  getAllHouses,
  getHouseDetails,
  getHouseWaitingList,
  getAllVisitRequests,
  sendEmail,
  confirmHouse,
  deleteUser,  
  deleteOwner,
  deleteComment,
  deleteHouse,
  replyToComment,
  markAllMessagesAsRead,
  syncEmailReplies,
  getOwnerBankingDetails
};
