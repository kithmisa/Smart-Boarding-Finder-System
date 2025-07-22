import React from 'react';
import './AddBoardingForm.css';

const AddBoardingForm = () => {
  return (
    <div className="form-container">
      <h3>Add New Boarding</h3>
      <input type="text" placeholder="Title" required />

      <div className="row-group">
        <span>Property Type:</span>
        <label><input type="radio" name="type" /> Boys</label>
        <label><input type="radio" name="type" /> Girls</label>
        <label><input type="radio" name="type" /> Mixed</label>
      </div>

      <div className="row-group">
        <span>Room Type:</span>
        <label><input type="radio" name="room" /> Single</label>
        <label><input type="radio" name="room" /> Double</label>
        <label><input type="radio" name="room" /> Triple</label>
      </div>

      <input type="text" placeholder="Address" required />
      <textarea placeholder="Facilities (e.g. Wi-Fi, Kitchen, etc.)" />
      <input type="file" />
      <textarea placeholder="Description" />

      <button type="submit">Add</button>
    </div>
  );
};

export default AddBoardingForm;