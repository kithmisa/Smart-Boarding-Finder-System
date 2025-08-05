import React, { useEffect, useState } from "react";
import './BoardingList.css';
import { useNavigate } from 'react-router-dom';


const BoardingList = () => {
  const [houses, setHouses] = useState([]);

  const navigate = useNavigate();
  
  useEffect(() => {
    fetch("http://localhost:5000/api/houses/all")
      .then(res => res.json())
      .then(data => setHouses(data))
      .catch(err => console.error("Failed to fetch houses:", err));
  }, []);

  return (
      <div className="boarding-bg-wrapper">
      <div className="boarding-bg-overlay">

    <div className="boarding-grid-container">
      {houses.map((house) => (
        <div className="boarding-card" key={house.id}>
          <div className="card-image-wrapper">
            {house.images && house.images.length > 0 ? (
              <img
                src={`http://localhost:5000/uploads/${house.images[0]}`}
                alt="House"
                className="card-image"
              />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          <div className="card-content">
            <h3>{house.title}</h3>
            <p><strong>Address:</strong> {house.address}</p>
            <p><strong>Price:</strong> Rs. {house.price} {house.shortTerm ? "/ Month" : ""}</p>
            <p><strong>Type:</strong> {house.roomType} / {house.type}</p>
            <p><strong>Gender Allowed:</strong> {house.genderAllowed}</p>
            <span className={`status-badge ${house.status?.toLowerCase()}`}>
              {house.status}
            </span>

            <button
              className="view-more-button"
              onClick={() => navigate(`/boarding/${house.id}`)}
            >
              View More
            </button>


          </div>
        </div>
      ))}
    </div>
      </div>
      </div>
  );
};

export default BoardingList;
