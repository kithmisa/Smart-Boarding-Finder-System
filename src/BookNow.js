
// BookNow.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./BookNow.css";


export default function BookNow() {
  const { id } = useParams();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [persons, setPersons] = useState(1);
  const [pricePerRoom, setPricePerRoom] = useState(1000); // replace with actual value later
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (checkIn && checkOut) {
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      const diffTime = date2 - date1;
      const days = diffTime / (1000 * 60 * 60 * 24);
      if (days > 0) {
        setTotalPrice(days * rooms * pricePerRoom);
      } else {
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, rooms, pricePerRoom]);

  const handlePayment = () => {
    alert(`Payment of ₹${totalPrice} initiated`);
    // Replace this with real payment API (Razorpay/Stripe)
  };

  return (
    <div className="book-now-container">
      <h2>Book Your Stay</h2>

      <label>Check-in Date</label>
      <input
        type="date"
        value={checkIn}
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => setCheckIn(e.target.value)}
      />

      <label>Checkout Date</label>
      <input
        type="date"
        value={checkOut}
        min={checkIn}
        onChange={(e) => setCheckOut(e.target.value)}
      />

      <label>Number of Rooms</label>
      <input
        type="number"
        min="1"
        value={rooms}
        onChange={(e) => setRooms(parseInt(e.target.value))}
      />

      <label>Number of People</label>
      <input
        type="number"
        min="1"
        value={persons}
        onChange={(e) => setPersons(parseInt(e.target.value))}
      />

      <div className="total-price">
        <strong>Total Price:</strong> ₹{totalPrice}
      </div>

      <button className="pay-now-button" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
}


<div className="book-now-container">
  {/* Content */}
</div>
