// src/components/PerDayRoom.js
import React from "react";
import "./PerDayRoom.css";
import roomImg from "../assets/room.jpg";

const PerDayRoom = () => {
  return (
    <div className="room-container">
      <img src={roomImg} alt="Room" className="room-image" />

      <div className="room-details">
        <h2>Per day boarding</h2>
        <h3>Shared Room in Meddawatha</h3>
        <p>📍 no 801, Ariyawamsa mawatha, Meddawatha</p>
        <p>Available from May 16</p>

        <button className="gone-button">GONE</button>
        <p className="more-details">more details</p>
      </div>
    </div>
  );
};

export default PerDayRoom;
