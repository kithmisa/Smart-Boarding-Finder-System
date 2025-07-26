import React, { useState } from 'react';
//import ReactQuill from 'react-quill';
//import 'react-quill/dist/quill.snow.css';
import './AddBoardingForm.css';
import { MdTextFields } from 'react-icons/md';

const AddBoardingForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    propertyTypes: [],
    roomType: '',
    location: '',
    address: '',
    availableRooms: '',
    bathroomType: '',
    
    bills:'',
    keyMoney: '',
    facilities: '',
    image: null,
    price: '',
    negotiable: false,
    description: ''
  });

  const handleCheckboxArrayChange = (e, key) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: checked
        ? [...prev[key], value]
        : prev[key].filter((item) => item !== value)
    }));
  };


  const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === 'image') {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0]
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // TODO: Send data to backend
  };

  return (
    <div className="form-wrapper">
   <h3 className="form-heading">Add New Boarding</h3>
    <div className="form-container">
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        {/* Property Type */}
        <div className="row-group">
          <span>For Whom:</span>
          
           <label>
            <input
              type="checkbox"
              value="anyone"
              checked={formData.propertyTypes.includes('anyone')}
              onChange={(e) => handleCheckboxArrayChange(e, 'propertyTypes')}
            />
            anyone
          </label>
          
          <label>
            <input
              type="checkbox"
              value="Girls"
              checked={formData.propertyTypes.includes('Girls')}
              onChange={(e) => handleCheckboxArrayChange(e, 'propertyTypes')}
            />
           Only Girls
          </label>
          <label>
            <input
              type="checkbox"
              value="Boys"
              checked={formData.propertyTypes.includes('Boys')}
              onChange={(e) => handleCheckboxArrayChange(e, 'propertyTypes')}
            />
           Only Boys
          </label>
          <label>
            <input
              type="checkbox"
              value="Staff-male"
              checked={formData.propertyTypes.includes('Staff-male')}
              onChange={(e) => handleCheckboxArrayChange(e, 'propertyTypes')}
            />
            Staff-male
          </label>

           <label>
            <input
              type="checkbox"
              value="Staff-female"
              checked={formData.propertyTypes.includes('Staff-female')}
              onChange={(e) => handleCheckboxArrayChange(e, 'propertyTypes')}
            />
            Staff-female
          </label>

        </div>

        {/* Room Type */}
        <div className="row-group">
          <span>Room Type:</span>
          <div className="option-group">
          <label><input type="checkbox" name="roomType" value="Single" onChange={handleInputChange} /> Single</label>
          <label><input type="checkbox" name="roomType" value="Double" onChange={handleInputChange} /> Double</label>
          <label><input type="checkbox" name="roomType" value="shared" onChange={handleInputChange} /> shared more than two</label>
           <label><input type="checkbox" name="roomType" value="short term" onChange={handleInputChange} /> short term(per Day)</label>
        </div>
        </div>


        {/* Location Dropdown */}
        <label>
          Location:
          <select name="location" value={formData.location} onChange={handleInputChange} required>
            <option value="">Select Location</option>
            <option value="Eliyakanda">Eliyakanda</option>
            <option value="Janaraja Mawatha">Janaraja Mawatha</option>
            <option value="SK Town">SK Town</option>
            <option value="Pallimulla">Pallimulla</option>
            <option value="Matara Town">Matara Town</option>
            <option value="Welewatta">Welewatta</option>
            <option value="Maddewatta">Maddewatta</option>
            <option value="Rassandeniya">Rassandeniya</option>
            <option value="Gandarawatta">Ganadarawatta</option>
            <option value="Devinuwara">Devinuwara</option>
          </select>
        </label>

        {/* Address */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />

        {/* No. of Available Rooms */}
        <input
          type="number"
          name="availableRooms"
          placeholder="Number of Available Rooms"
          value={formData.availableRooms}
          onChange={handleInputChange}
          required
        />

        {/* Bathroom Type */}
        <label>
          Bathroom Type:
          <select name="bathroomType" value={formData.bathroomType} onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="Shared">Shared</option>
            <option value="Attached">Attached</option>
            <option value="Separate">Separate</option>
          </select>
        </label>

        {/* Furnishings */} 
          

        {/* Utility Bills */}
        

       <label>
          Electricity and WaterBills:
          <select name="Electricity and WaterBills" value={formData.ElectricityandWaterBills} onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="Included in monthly rent">Included in monthly rent</option>
            <option value="Charging Separately">Charging Separately</option>
            
          </select>
        </label>

        {/* Key Money Dropdown */}
        <label>
          Key Money:
          <select name="keyMoney" value={formData.keyMoney} onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="No Key Money">No Key Money</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
          </select>
        </label>

        {/* Facilities */}
        <label>Facilities:
        <textarea
          name="facilities"
          placeholder="Facilities (e.g.Kitchen,breakfast included, etc.)"
          value={formData.facilities}
          onChange={handleInputChange}
        />
        </label>

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
        />

        {/* Price */}
       

      {/* Price and Negotiable */}
<div className="price-negotiable-row">
  
  <div className="price-field">
    <label htmlFor="price">Price (LKR):</label>
    <input
      type="text"
      id="price"
      name="price"
      value={formData.price}
      onChange={handleInputChange}
    />
  </div>

  <div className="negotiable-field">
    <input
      type="checkbox"
      id="negotiable"
      name="negotiable"
      checked={formData.negotiable}
      onChange={handleInputChange}
    />
    <label htmlFor="negotiable">Negotiable</label>
  </div>

</div>


      <div className="description">
        <div style={{ marginTop: '20px', height:'50px' }}>
          <label>Description:
            <textarea
          name="description"
          placeholder="Describe why we choose you..."
          value={formData.description}
          onChange={handleInputChange}
        />
          </label>
        </div>


       
        
            
        </div>

        <button type="submit" style={{ marginTop: '20px' }}>Add</button>
      </form>
    </div>
    </div>
  );
};

export default AddBoardingForm;
