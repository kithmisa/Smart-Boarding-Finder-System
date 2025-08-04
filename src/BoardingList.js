
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import roomsData from "./Boardingdata";
import "./BoardingList.css";

export default function BoardingList() {
  const [typeFilter, setTypeFilter] = useState("all");
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/boarding/${id}`);
  };

  const filteredRooms = roomsData.filter((room) => {
    return (
      typeFilter === "all" ||
      (typeFilter === "perDay" && room.perDay) ||
      (typeFilter === "longTerm" && room.longTerm)
    );
  });

  return (
    <div className="boarding-list-container">
      <h2>Smart Boarding Finder</h2>

      <div className="filter-section">
        <div className="filter-group">
          <strong>Type:</strong>
          <button
            className={typeFilter === "all" ? "active" : ""}
            onClick={() => setTypeFilter("all")}
          >
            All
          </button>
          <button
            className={typeFilter === "perDay" ? "active" : ""}
            onClick={() => setTypeFilter("perDay")}
          >
            Per Day
          </button>
          <button
            className={typeFilter === "longTerm" ? "active" : ""}
            onClick={() => setTypeFilter("longTerm")}
          >
            Long Term
          </button>
        </div>
      </div>

      <div className="room-list">
        {filteredRooms.map((room) => (
          <div
            className="boarding-card"
            key={room.id}
            onClick={() => handleCardClick(room.id)}
          >
            <div className="image-wrapper">
              <img src={room.image} alt={room.title} />
              {room.perDay && <span className="per-day-tag">Per Day</span>}
            </div>
            <div className="card-details">
              <h3>{room.title}</h3>
              <p>{room.address}</p>
              <span
                className={`status-badge ${
                  room.status.toLowerCase() === "available"
                    ? "available"
                    : "gone"
                }`}
              >
                {room.status}
              </span>

              {room.status.toLowerCase() === "gone" && room.date && (() => {
                const today = new Date();
                const availableDate = new Date(room.date);
                const timeDiff = availableDate - today;
                const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                const formattedDate = availableDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <p className="available-date">
                    Available on {formattedDate}{" "}
                    <strong>({daysLeft} day{daysLeft > 1 ? "s" : ""} left)</strong>
                  </p>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
