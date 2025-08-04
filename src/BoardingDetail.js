
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

      {/* Review Section */}
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

      {/* Display Submitted Reviews */}
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

