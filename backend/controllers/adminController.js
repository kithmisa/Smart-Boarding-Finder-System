const db = require('../db');

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
    const [users] = await db.query("SELECT * FROM users");
    res.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// Get all owners
const getAllOwners = async (req, res) => {
  try {
    const [owners] = await db.query("SELECT * FROM owner");
    res.json({ success: true, owners });
  } catch (err) {
    console.error("Error fetching owners:", err);
    res.status(500).json({ success: false, message: "Error fetching owner" });
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
      SELECT h.*, o.name as owner_name 
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
  
  try {
    await db.query("UPDATE contact_messages SET reply = ?, replied = 1 WHERE id = ?", [reply, id]);
    res.json({ success: true, message: "Reply sent successfully" });
  } catch (err) {
    console.error("Error replying to comment:", err);
    res.status(500).json({ success: false, message: "Error replying to comment" });
  }
};

module.exports = {
  loginAdmin,
  getAllUsers,  
  getAllOwners,
  getAllComments,
  getAllHouses,
  confirmHouse,
   deleteUser,  
  deleteOwner,
  deleteComment,
  deleteHouse,
  replyToComment  
};
