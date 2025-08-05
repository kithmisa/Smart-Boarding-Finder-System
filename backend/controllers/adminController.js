const db = require('../db');

exports.login = (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt", req.body);

  const query = "SELECT * FROM admins WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 1) {
      return res.status(200).json({ success: true, message: "Login successful", admin: results[0] });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
};
