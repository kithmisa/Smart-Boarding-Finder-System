/*
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roomsData from "./Boardingdata";
import "./BoardingDetail.css";

export default function BoardingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = roomsData.find((r) => r.id === parseInt(id));

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([]);

  if (!room) return <p>Room not found</p>;

  const handleSubmitReview = () => {
    if (reviewText.trim() !== "") {
      setSubmittedReviews([
        ...submittedReviews,
        { text: reviewText, stars: rating }
      ]);
      setReviewText("");
      setRating(0);
    }
  };

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="room-card">
        <img src={room.image} alt={room.title} className="room-image" />

        <div className="room-info">
          <h2>{room.title}</h2>
          <p className="room-address">📍 {room.address}</p>

          <button className="book-btn" onClick={() => alert("Redirecting to payment")}>
            Book now
          </button>

          <p className="owner-contact">📞 To contact Owner<br />071-*******</p>

          <div className="features">
            <h3>Features</h3>
            <ul>
              <li>✅ Seperate Study Area </li>
              <li>✅ Separate Sleeping Area</li>
              <li>✅ Cooking Area avilable </li>
              <li>✅ tap Water</li>
              <li>✅ Security</li>
              <li>✅ Rules and Regulations</li>
            </ul>
          </div>
        </div>
      </div>

      // Review Section 
      <div className="review-section">
        <h3>Leave a Review</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#ffc107" : "#ccc",
                fontSize: "24px"
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="3"
          cols="40"
          style={{ marginTop: "10px" }}
        />
        <br />
        <button onClick={handleSubmitReview} style={{ marginTop: "10px" }}>
          Submit Review
        </button>
      </div>

      // Display Submitted Reviews 
      <div className="submitted-reviews">
        <h3>Reviews</h3>
        {submittedReviews.length === 0 && <p>No reviews yet.</p>}
        {submittedReviews.map((review, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ color: "#ffc107" }}>
              {"★".repeat(review.stars) + "☆".repeat(5 - review.stars)}
            </div>
            <p>{review.text}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

*/

/*phone number pop up and additional photos */

/*
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roomsData from "./Boardingdata";
import "./BoardingDetail.css";

export default function BoardingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = roomsData.find((r) => r.id === parseInt(id));

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([]);

  if (!room) return <p>Room not found</p>;

  const handleSubmitReview = () => {
    if (reviewText.trim() !== "") {
      setSubmittedReviews([
        ...submittedReviews,
        { text: reviewText, stars: rating },
      ]);
      setReviewText("");
      setRating(0);
    }
  };

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="room-card">
        <img src={room.image} alt={room.title} className="room-image" />

        <div className="room-info">
          <h2>{room.title}</h2>
          <p className="room-address">📍 {room.address}</p>

          <button
            className="book-btn"
            onClick={() => alert("Redirecting to payment")}
          >
            Book now
          </button>

          <p
            className="owner-contact"
            onClick={() => alert("Please register to view more details")}
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            📞 To contact Owner<br />071-*******
          </p>


          
          <div className="features">
            <h3>Features</h3>
            <ul>
              <li>✅ Seperate Study Area </li>
              <li>✅ Separate Sleeping Area</li>
              <li>✅ Cooking Area available</li>
              <li>✅ Tap Water</li>
              <li>✅ Security</li>
              <li>✅ Rules and Regulations</li>
            </ul>
          </div>

          
          <div className="more-images">
            <h4>More Photos</h4>
            <div className="photo-grid">
              <img src={room.bathroomImage} alt="Bathroom" />
              <img src={room.kitchenImage} alt="Kitchen" />
              <img src={room.studyAreaImage} alt="Study Area" />
            </div>
          </div>
        </div>
      </div>

      
      <div className="review-section">
        <h3>Leave a Review</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#ffc107" : "#ccc",
                fontSize: "24px",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="3"
          cols="40"
          style={{ marginTop: "10px" }}
        />
        <br />
        <button
          onClick={handleSubmitReview}
          style={{
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </div>

      
      <div className="submitted-reviews">
        <h3>Reviews</h3>
        {submittedReviews.length === 0 && <p>No reviews yet.</p>}
        {submittedReviews.map((review, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ color: "#ffc107" }}>
              {"★".repeat(review.stars) + "☆".repeat(5 - review.stars)}
            </div>
            <p>{review.text}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

*/


/*
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roomsData from "./Boardingdata";
import "./BoardingDetail.css";

export default function BoardingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = roomsData.find((r) => r.id === parseInt(id));

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  if (!room) return <p>Room not found</p>;

  const handleSubmitReview = () => {
    if (reviewText.trim() !== "") {
      setSubmittedReviews([
        ...submittedReviews,
        { text: reviewText, stars: rating },
      ]);
      setReviewText("");
      setRating(0);
    }
  };

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="room-card">
        <img src={room.image} alt={room.title} className="room-image" />

        <div className="room-info">
          <h2>{room.title}</h2>
          <p className="room-address">📍 {room.address}</p>

          <button
            className="book-btn"
            onClick={() => alert("Redirecting to payment")}
          >
            Book now
          </button>

          <div className="owner-contact">
            📞 To contact Owner<br />
            <span
              className="phone-number"
              onClick={(e) => {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000);
              }}
              style={{ position: "relative", cursor: "pointer" }}
            >
              071-*******
              {showPopup && (
                <div className="popup-message" style={{
                  position: "absolute",
                  top: "25px",
                  left: "0",
                  backgroundColor: "#333",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  zIndex: 1000
                }}>
                  Please Register to view more details
                </div>
              )}
            </span>
          </div>

          <div className="features">
            <h3>Features</h3>
            <ul>
              <li>✅ Seperate Study Area </li>
              <li>✅ Separate Sleeping Area</li>
              <li>✅ Cooking Area available</li>
              <li>✅ Tap Water</li>
              <li>✅ Security</li>
              <li>✅ Rules and Regulations</li>
            </ul>
          </div>

          
          <div className="more-images">
            <h4>More Photos</h4>
            <div className="photo-grid">
             <img src={room.bathroomImage} alt="Bathroom" />
              <img src={room.kitchenImage} alt="Kitchen" />
              <img src={room.studyAreaImage} alt="Study Area" />
            </div>
          </div>
        </div>
      </div>

      
      <div className="review-section">
        <h3>Leave a Review</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#ffc107" : "#ccc",
                fontSize: "24px",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="3"
          cols="40"
          style={{ marginTop: "10px" }}
        />
        <br />
        <button
          onClick={handleSubmitReview}
          style={{
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </div>

      
      <div className="submitted-reviews">
        <h3>Reviews</h3>
        {submittedReviews.length === 0 && <p>No reviews yet.</p>}
        {submittedReviews.map((review, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ color: "#ffc107" }}>
              {"★".repeat(review.stars) + "☆".repeat(5 - review.stars)}
            </div>
            <p>{review.text}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}


/* additional photos */

/*
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roomsData from "./Boardingdata";
import "./BoardingDetail.css";

export default function BoardingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = roomsData.find((r) => r.id === parseInt(id));

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  if (!room) return <p>Room not found</p>;

  const handleSubmitReview = () => {
    if (reviewText.trim() !== "") {
      setSubmittedReviews([
        ...submittedReviews,
        { text: reviewText, stars: rating },
      ]);
      setReviewText("");
      setRating(0);
    }
  };

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="room-card">
        <img src={room.image} alt={room.title} className="room-image" />

        <div className="room-info">
          <h2>{room.title}</h2>
          <p className="room-address">📍 {room.address}</p>

          <button
            className="book-btn"
            onClick={() => alert("Redirecting to payment")}
          >
            Book now
          </button>

          <div className="owner-contact">
            📞 To contact Owner
            <br />
            <span
              className="phone-number"
              onClick={(e) => {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000);
              }}
              style={{ position: "relative", cursor: "pointer" }}
            >
              071-*******
              {showPopup && (
                <div className="popup-message">
                  Please Register to view more details
                </div>
              )}
            </span>
          </div>

          <div className="features">
            <h3>Features</h3>
            <ul>
              <li>✅ Seperate Study Area </li>
              <li>✅ Separate Sleeping Area</li>
              <li>✅ Cooking Area available</li>
              <li>✅ Tap Water</li>
              <li>✅ Security</li>
              <li>✅ Rules and Regulations</li>
            </ul>
          </div>

          
          <div className="more-images">
            <h4>More Photos</h4>
            <div className="photo-grid">
              <img
                src={"/bathroom3.jpg"}
                alt="Bathroom"
                onClick={() => setPreviewImage("/bathroom3.jpg")}
              />
              <img
                src={"/kitchen3.jpg"}
                alt="Kitchen"
                onClick={() => setPreviewImage("/kitchen3.jpg")}
              />
              <img
                src={"/studyarea3.jpg"}
                alt="Study Area"
                onClick={() => setPreviewImage("/studyarea3.jpg")}
              />
            </div>
          </div>
        </div>
      </div>

      
      <div className="review-section">
        <h3>Leave a Review</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#ffc107" : "#ccc",
                fontSize: "24px",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="3"
          cols="40"
          style={{ marginTop: "10px" }}
        />
        <br />
        <button
          onClick={handleSubmitReview}
          style={{
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </div>

      
      <div className="submitted-reviews">
        <h3>Reviews</h3>
        {submittedReviews.length === 0 && <p>No reviews yet.</p>}
        {submittedReviews.map((review, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ color: "#ffc107" }}>
              {"★".repeat(review.stars) + "☆".repeat(5 - review.stars)}
            </div>
            <p>{review.text}</p>
            <hr />
          </div>
        ))}
      </div>

      
      {previewImage && (
        <div
          className="image-preview-modal"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}


*/

/*
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roomsData from "./Boardingdata";
import "./BoardingDetail.css";

export default function BoardingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = roomsData.find((r) => r.id === parseInt(id));

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  if (!room) return <p>Room not found</p>;

  // Availability date logic
  const today = new Date();
  const availableDate = room.availableOn ? new Date(room.availableOn) : null;
  const timeDiff = availableDate ? availableDate - today : null;
  const daysLeft = availableDate ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : null;
  const isFutureDate = daysLeft > 0;
  const isAvailableNow = daysLeft !== null && daysLeft <= 0;
  const [selectedDate, setSelectedDate] = useState("");
  const [previewImage, setPreviewImage] = useState(null);


  const handleSubmitReview = () => {
    if (reviewText.trim() !== "") {
      setSubmittedReviews([
        ...submittedReviews,
        { text: reviewText, stars: rating },
      ]);
      setReviewText("");
      setRating(0);
    }
  };

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="room-card">
        <img src={room.image} alt={room.title} className="room-image" />

        <div className="room-info">
          <h2>{room.title}</h2>
          <p className="room-address">📍 {room.address}</p>

         
          {room.availableOn && (
            <div style={{ marginTop: "10px" }}>
              {isFutureDate ? (
                <>
                  <p><strong>Available on:</strong> {room.availableOn}</p>
                  <p style={{ fontWeight: "bold", color: "#f57c00" }}>
                    {daysLeft} day{daysLeft > 1 ? "s" : ""} left
                  </p>
                </>
              ) : (
                <button className="available-btn">✅ Available</button>
              )}
            </div>
          )}

          <button
            className="book-btn"
            onClick={() => alert("Redirecting to payment")}
          >
            Book now
          </button>

          <div className="owner-contact">
            📞 To contact Owner<br />
            <span
              className="phone-number"
              onClick={() => {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000);
              }}
              style={{ position: "relative", cursor: "pointer" }}
            >
              071-*******
              {showPopup && (
                <div className="popup-message">
                  Please Register to view more details
                </div>
              )}
            </span>
          </div>

          <div className="features">
            <h3>Features</h3>
            <ul>
              <li>✅ Seperate Study Area </li>
              <li>✅ Separate Sleeping Area</li>
              <li>✅ Cooking Area available</li>
              <li>✅ Tap Water</li>
              <li>✅ Security</li>
              <li>✅ Rules and Regulations</li>
            </ul>
          </div>

          
          <div className="more-images">
            <h4>More Photos</h4>
            <div className="photo-grid">
              <img
                src={"/bathroom3.jpg"}
                alt="Bathroom"
                onClick={() => setPreviewImage("/bathroom3.jpg")}
              />
              <img
                src={"/kitchen3.jpg"}
                alt="Kitchen"
                onClick={() => setPreviewImage("/kitchen3.jpg")}
              />
              <img
                src={"/studyarea3.jpg"}
                alt="Study Area"
                onClick={() => setPreviewImage("/studyarea.jpg")}
              />
            </div>
          </div>
        </div>
      </div>
      

          <div className="visit-booking-section">
            <h3>Book a Visit Date</h3>
            <p>Select a future date to visit the boarding place.</p>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker"
            />
            <button
              onClick={() => {
                if (selectedDate) {
                  alert(`Visit booked for ${selectedDate}`);
                } else {
                  alert("Please select a date first.");
                }
              }}
              style={{
                marginTop: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Book Visit
            </button>
          </div>
        
            

      <div className="review-section">
        <h3>Leave a Review</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#ffc107" : "#ccc",
                fontSize: "24px",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="3"
          cols="40"
          style={{ marginTop: "10px" }}
        />
        <br />
        <button
          onClick={handleSubmitReview}
          style={{
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </div>

      
      <div className="submitted-reviews">
        <h3>Reviews</h3>
        {submittedReviews.length === 0 && <p>No reviews yet.</p>}
        {submittedReviews.map((review, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ color: "#ffc107" }}>
              {"★".repeat(review.stars) + "☆".repeat(5 - review.stars)}
            </div>
            <p>{review.text}</p>
            <hr />
          </div>
        ))}
      </div>

      
      {previewImage && (
        <div
          className="image-preview-modal"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

*/

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roomsData from "./Boardingdata";
import "./BoardingDetail.css";

export default function BoardingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Declare all hooks at the top (before any return)
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const room = roomsData.find((r) => r.id === parseInt(id));

  if (!room) return <p>Room not found</p>;

  // Availability date logic
  const today = new Date();
  const availableDate = room.availableOn ? new Date(room.availableOn) : null;
  const timeDiff = availableDate ? availableDate - today : null;
  const daysLeft = availableDate ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : null;
  const isFutureDate = daysLeft > 0;
  const isAvailableNow = daysLeft !== null && daysLeft <= 0;

  const handleSubmitReview = () => {
    if (reviewText.trim() !== "") {
      setSubmittedReviews([
        ...submittedReviews,
        { text: reviewText, stars: rating },
      ]);
      setReviewText("");
      setRating(0);
    }
  };

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="room-card">
        <img src={room.image} alt={room.title} className="room-image" />

        <div className="room-info">
          <h2>{room.title}</h2>
          <p className="room-address">📍 {room.address}</p>

          {room.availableOn && (
            <div style={{ marginTop: "10px" }}>
              {isFutureDate ? (
                <>
                  <p><strong>Available on:</strong> {room.availableOn}</p>
                  <p style={{ fontWeight: "bold", color: "#f57c00" }}>
                    {daysLeft} day{daysLeft > 1 ? "s" : ""} left
                  </p>
                </>
              ) : (
                <button className="available-btn">✅ Available</button>
              )}
            </div>
          )}

          <button
            className="book-btn"
            onClick={() => alert("Redirecting to payment")}
          >
            Book now
          </button>

          <div className="owner-contact">
            📞 To contact Owner<br />
            <span
              className="phone-number"
              onClick={() => {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000);
              }}
              style={{ position: "relative", cursor: "pointer" }}
            >
              071-*******
              {showPopup && (
                <div className="popup-message">
                  Please Register to view more details
                </div>
              )}
            </span>
          </div>

          <div className="features">
            <h3>Features</h3>
            <ul>
              <li>✅ Seperate Study Area </li>
              <li>✅ Separate Sleeping Area</li>
              <li>✅ Cooking Area available</li>
              <li>✅ Tap Water</li>
              <li>✅ Security</li>
              <li>✅ Rules and Regulations</li>
            </ul>
          </div>

          <div className="more-images">
            <h4>More Photos</h4>
            <div className="photo-grid">
              <img
                src={"/bathroom3.jpg"}
                alt="Bathroom"
                onClick={() => setPreviewImage("/bathroom3.jpg")}
              />
              <img
                src={"/kitchen3.jpg"}
                alt="Kitchen"
                onClick={() => setPreviewImage("/kitchen3.jpg")}
              />
              <img
                src={"/studyarea3.jpg"}
                alt="Study Area"
                onClick={() => setPreviewImage("/studyarea.jpg")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Visit Section */}
      <div className="visit-booking-section">
        <h3>Book a Visit Date</h3>
        <p>Select a future date to visit the boarding place.</p>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />
        <button
          onClick={() => {
            if (selectedDate) {
              alert(`Visit booked for ${selectedDate}`);
            } else {
              alert("Please select a date first.");
            }
          }}
          style={{
            marginTop: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Book Visit
        </button>
      </div>

      <div className="review-section">
        <h3>Leave a Review</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#ffc107" : "#ccc",
                fontSize: "24px",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="3"
          cols="40"
          style={{ marginTop: "10px" }}
        />
        <br />
        <button
          onClick={handleSubmitReview}
          style={{
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </div>

      <div className="submitted-reviews">
        <h3>Reviews</h3>
        {submittedReviews.length === 0 && <p>No reviews yet.</p>}
        {submittedReviews.map((review, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ color: "#ffc107" }}>
              {"★".repeat(review.stars) + "☆".repeat(5 - review.stars)}
            </div>
            <p>{review.text}</p>
            <hr />
          </div>
        ))}
      </div>

      {previewImage && (
        <div
          className="image-preview-modal"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}
