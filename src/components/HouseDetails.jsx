import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaKey, FaUtensils, FaBroom, FaCar, FaCoffee, FaBath,
  FaBolt, FaFaucet, FaDoorOpen, FaChair, FaHome, FaUpload, FaUserFriends
} from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';

const HouseDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Extract nic passed from OwnerDetails via state
  const nicFromOwner = state?.nic || '';

  const [formData, setFormData] = useState({
    nic: nicFromOwner,
    title: '',
    roomType: '',
    genderAllowed: '',
    price: '',
    address: '',
    images: [],
    features: [],
    city: '',
    type: '',
    location: '',
    highlights: '',
    shortTerm: false,
    pricePerNight: '',
    shortFeatures: [],
    description: '',
  });

  const handleFeatureToggle = (label, type = 'features') => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(label)
        ? prev[type].filter((f) => f !== label)
        : [...prev[type], label],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const {
      nic, title, roomType, genderAllowed, price, address,
      city, type, location,
    } = formData;

    // Required field validation
    if (
      !nic || !title || !roomType || !genderAllowed || !price || !address ||
      !city || !type || !location
    ) {
      alert('❌ Please fill out all required fields.');
      return;
    }

    try {
      const data = new FormData();

      data.append('nic', nic);
      data.append('title', title);
      data.append('roomType', roomType);
      data.append('genderAllowed', genderAllowed);
      data.append('price', price);
      data.append('address', address);
      data.append('city', city);
      data.append('type', type);
      data.append('location', location);
      data.append('highlights', formData.highlights);
      data.append('shortTerm', formData.shortTerm ? 'true' : 'false');
      data.append('pricePerNight', formData.pricePerNight || '');
      data.append('description', formData.description);

      data.append('features', JSON.stringify(formData.features));
      data.append('shortFeatures', JSON.stringify(formData.shortFeatures));

      formData.images.forEach((file) => {
        data.append('images', file);
      });

      const response = await fetch('http://localhost:5000/api/houses', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Failed to submit');

      alert('✅ Property added successfully!');
      navigate('/owner/listings');
    } catch (error) {
      console.error(error);
      alert('❌ Failed to submit property. Please try again.');
    }
  };

  const featureOptions = [
    { icon: FaKey, label: 'Key Access' },
    { icon: FaUtensils, label: 'Meals Provided' },
    { icon: FaBroom, label: 'Cleaning Service' },
    { icon: FaCar, label: 'Parking Available' },
    { icon: FaCoffee, label: 'Free Coffee' },
    { icon: FaBath, label: 'Private Bathroom' },
    { icon: FaBolt, label: 'Electricity Included' },
    { icon: FaFaucet, label: 'Water Supply' },
    { icon: FaDoorOpen, label: 'Private Entrance' },
    { icon: FaChair, label: 'Furnished' },
    { icon: FaUserFriends, label: 'Shared Room' },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-white shadow-md py-4 px-6 flex justify-center gap-6 max-w-7xl mx-auto mt-24 rounded">
        <button
          onClick={() => navigate('/owner/add-property')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          Add Property
        </button>

        <button
          onClick={() => navigate('/owner/listings')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          View My Listings
        </button>

        <button
          onClick={() => navigate('/owner/edit-contact')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          Edit Contact Details
        </button>
      </div>

      <div className="pt-32 pb-20 px-6 bg-white/90 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Main Form */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaHome /> House Details
            </h2>
            <div className="space-y-4 mt-4">
              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              <div className="flex gap-4">
                Room Type
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="roomType"
                    value="private"
                    checked={formData.roomType === 'private'}
                    onChange={handleChange}
                  />{' '}
                  Private
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="roomType"
                    value="shared"
                    checked={formData.roomType === 'shared'}
                    onChange={handleChange}
                  />{' '}
                  Shared
                </label>
              </div>

              <div className="mt-4">
                Gender Allowed:
                <div className="flex space-x-6">
                  {['Girls', 'Boys', 'Anyone'].map((gender) => (
                    <label key={gender} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="genderAllowed"
                        value={gender}
                        checked={formData.genderAllowed === gender}
                        onChange={handleChange}
                        className="mr-1"
                      />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>

              <input
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />

              <div>
                <p className="text-sm font-medium mb-2">Images</p>
                <div
                  className="border-2 border-dashed px-4 py-6 rounded-lg text-gray-500 flex flex-col items-center cursor-pointer"
                  onClick={() => document.getElementById('imageUpload').click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    handleImageUpload({ target: { files } });
                  }}
                >
                  <FaUpload className="text-blue-500 text-3xl mb-2" />
                  <span>Drag & drop or click to upload</span>
                </div>

                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Show preview thumbnails */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {formData.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(img)}
                        alt={`preview-${idx}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Select House Features:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {featureOptions.map(({ icon: Icon, label }, idx) => (
                    <label key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(label)}
                        onChange={() => handleFeatureToggle(label)}
                      />
                      <Icon /> {label}
                    </label>
                  ))}
                </div>
              </div>

              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Select City</option>
                <option value="Matara">Matara</option>
              </select>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Select Type</option>
                <option value="House">House</option>
                <option value="Room">Room</option>
                <option value="Annex">Annex</option>
              </select>

              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Select Location</option>
                <option value="Matara Town">Matara Town</option>
                <option value="Pallimulla">Pallimulla</option>
                <option value="Welewaththa">Welewaththa</option>
                <option value="Eliyakanda">Eliyakanda</option>
                <option value="Janaraja Mawatha">Janaraja Mawatha</option>
                <option value="SK Town">SK Town</option>
                <option value="Maddewatta">Maddewatta</option>
                <option value="Rassandeniya">Rassandeniya</option>
                <option value="Gandarawatta">Ganadarawatta</option>
                <option value="Devinuwara">Devinuwara</option>
              </select>

              <textarea
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                rows="3"
                placeholder="Highlights"
                className="w-full border px-4 py-2 rounded"
              />
            </div>
          </div>

          {/* Right Side - Short Term Rental */}
          <div>
            <h2 className="text-lg font-bold mb-2">Short-Term Availability</h2>
            <label className="flex items-center gap-2 mb-4">
              Does your property support short-term rentals?
              <input
                type="checkbox"
                name="shortTerm"
                checked={formData.shortTerm}
                onChange={handleChange}
              />
            </label>

            {formData.shortTerm && (
              <div className="space-y-4">
                <input
                  name="pricePerNight"
                  placeholder="Price per night"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />

                <h3 className="font-semibold">Short Term Features:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    'Meals Provided',
                    'On-site Parking',
                    'Private Bathroom',
                    'Free Coffee',
                    'Visitors Allowed',
                    'Cleaning Services',
                  ].map((label, idx) => (
                    <label key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.shortFeatures.includes(label)}
                        onChange={() => handleFeatureToggle(label, 'shortFeatures')}
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Description"
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-8 py-3 rounded font-bold"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default HouseDetails;
