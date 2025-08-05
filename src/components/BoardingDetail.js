import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BoardingDetail.css'; // We'll create styles here
import { Weight } from 'lucide-react';

const BoardingDetail = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/houses/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched house data:", data); 
        setHouse(data);
      })
      .catch(err => console.error("Failed to fetch house:", err));
  }, [id]);

  if (!house) return <p>Loading...</p>;
 // console.log("house.images:", house.images);


  const cleanedImages = Array.isArray(house.images)
    ? house.images.map(imgStr => {
        try {
          return JSON.parse(imgStr);
        } catch {
          return imgStr;
        }
      })
    : [];

      console.log("cleanedImages:", cleanedImages);


  return (
     <div className="detail-container">
      {/* 🖼️ Images at the top */}
      {/* Changed to check cleanedImages.length */}
      {cleanedImages.length > 0 && (
        <div className="detail-images">
          {cleanedImages.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:5000/uploads/${img}`}
              alt={`House ${index}`}
              className="detail-img"
              onError={e => (e.currentTarget.style.display = 'none')} // Hide broken images
            />
          ))}
        </div>
        
      )}
    

      <div className="detail-content">
        <div className='leftside'>
        <h1 style={{ fontWeight: "bold" }}>{house.title}</h1>
        <p><strong>Address:</strong> {house.address}</p>
        <p><strong>Price:</strong> Rs. {house.price} {house.shortTerm ? "/ month" : ""}</p>
        <p><strong>Type:</strong> {house.roomType} / {house.type}</p>
        <p><strong>Gender Allowed:</strong> {house.genderAllowed}</p>
        <p><strong>City:</strong> {house.city}</p>
        <p><strong>Location:</strong> {house.location} / {house.location}</p>
         <p><strong>Features:</strong> {house.features?.join(", ")}</p>
        <p><strong>Highlights:</strong> {house.highlights}</p>
        
       
        </div>
      <div className='rightside'>
      <h1 style={{ fontWeight: "bold" }}>Short Term Availability</h1>
        <p><strong>Short-term Booking:</strong> {house.shortTerm ? "Yes" : "No"}</p>
        
        
      {/* Only show below section if shortTerm is true AND price is greater than 0 */}
  {house.shortTerm && house.pricePerNight > 0 && (
    <>
      <p><strong>Price (Short):</strong> Rs. {house.pricePerNight} / day</p>

      {house.shortFeatures?.length > 0 && (
        <p><strong>Short Features:</strong> {house.shortFeatures.join(", ")}</p>
      )}

      {house.description && (
        <p><strong>Description:</strong> {house.description}</p>
      )}
    </>
  )}
      
      </div>

      </div>
    </div>
  );
};

export default BoardingDetail;
