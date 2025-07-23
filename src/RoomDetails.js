// RoomDetails.js
import React from "react";
import "./RoomDetails.css"; // Importing the CSS

const RoomDetails = () => {
  return (
    
    <div className="room-page">
      <div className="room-card">
        <div className="room-image">
          <img src="room1.jpeg" alt="Room" />
        </div>
        <div className="room-info">
          <h2>Single Room - for Girls</h2>
          <p className="location">
            📍 no 16, main road, Wellamadawa, Matara
          </p>
          <button className="book-button">Book now</button>
          <p className="contact">
            📞 To contact Owner <br />
            <strong>071-*******</strong>
          </p>
          <div className="features">
            <h3>Features</h3>
            <ul>
              <li>🖥 Study Area</li>
              <li>🛏 Sleeping Area</li>
              <li>🍳 Cooking Area</li>
              <li>🚿 Water</li>
              <li>🔐 Security</li>
              <li>📜 Rules and Regulations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
