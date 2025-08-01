import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bgHero from '../assets/image.png';
import {
  FaKey, FaUtensils, FaBroom, FaCar, FaCoffee, FaBath,
  FaBolt, FaFaucet, FaDoorOpen, FaChair, FaUser, FaHome,
  FaUpload, FaUserFriends
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const Register = () => {
  const navigate = useNavigate();

  // State for required fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    contact: '',
    title: '',
    roomType: '',
    price: '',
    address: '',
    map: '',
    city: '',
    type: '',
    location: '',
  });

  // Update state when any input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const {
      name, email, nic, contact, title,
      roomType, price, address, map,
      city, type, location
    } = formData;

    // Simple required field validation
    if (
      !name || !email || !nic || !contact ||
      !title || !roomType || !price || !address ||
      !map || !city || !type || !location
    ) {
      alert("❌ Please fill out all required fields before submitting.");
      return;
    }

    // If validation passes
    navigate('/payment');
  };

  return (
    <>
      <Navbar />
      <div
        className="relative flex-grow px-8 pt-32 pb-16 text-white"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pt-32 pb-20 px-6 bg-white/80 text-black min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Owner & House Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaUser /> Owner Details
                </h2>
                <div className="h-1 w-20 bg-green-500 mt-1 mb-4 rounded-full" />
                <div className="space-y-4">
                  <input name="name" type="text" placeholder="Name" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                  <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                  <input name="nic" type="text" placeholder="NIC" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                  <input name="contact" type="text" placeholder="Contact Numbers" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaHome /> House Details
                </h2>
                <div className="h-1 w-20 bg-green-500 mt-1 mb-4 rounded-full" />
                <div className="space-y-4">
                  <input name="title" type="text" placeholder="Title" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold">Room Type</span>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="roomType" value="private" onChange={handleChange} />
                      <FaUser /> Private
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="roomType" value="shared" onChange={handleChange} />
                      <FaUserFriends /> Shared
                    </label>
                  </div>
                  <input name="price" type="text" placeholder="Price Range" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                  <input name="address" type="text" placeholder="Address" onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                  {/* Upload */}
                  <div>
                    <p className="text-sm font-medium mb-2">Images (at least 2 required)</p>
                    <div className="border-2 border-dashed px-4 py-6 rounded-lg text-gray-500 flex flex-col items-center">
                      <FaUpload className="text-blue-500 text-3xl mb-2" />
                      <span>Drag & drop or click to upload</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* House Features */}
            <div className="mt-12">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <FaHome /> House Features
              </h2>
              <div className="h-1 w-24 bg-green-500 mb-6 rounded-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {[
                  [FaKey, "Key Money"], [FaUtensils, "Dinner Provided"], [FaBroom, "Cleaning Service"],
                  [FaCar, "Parking Space"], [FaCoffee, "Breakfast Provided"], [FaUtensils, "Lunch Provided"],
                  [FaChair, "Common Kitchen Access"], [FaBath, "Attached Bathroom"], [FaBolt, "Electricity Included"],
                  [FaFaucet, "Water Bill Included"], [FaDoorOpen, "Private Entrance"], [FaUserFriends, "Visitors Allowed"]
                ].map(([Icon, label]) => (
                  <label key={label} className="flex items-center gap-2">
                    <input type="checkbox" />
                    <Icon /> {label}
                  </label>
                ))}
              </div>

              {/* Google Map + Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <input name="map" type="text" placeholder="Google Map" onChange={handleChange} className="border px-4 py-2 rounded" />
                <select name="city" onChange={handleChange} className="border px-4 py-2 rounded">
                  <option value="">Select City</option>
                  <option value="Matara">Matara</option>
                </select>
                <div className="flex justify-center items-center w-full">
                <button className="bg-blue-600 text-white px-20 py-2 rounded font-semibold flex items-center gap-2 w-full md:w-auto">
                    <MdLocationOn className="text-lg" />
                    <span className="text-center">Pick Location</span>
                </button>
                </div>

                <select name="type" onChange={handleChange} className="border px-4 py-2 rounded">
                  <option value="">Select Type</option>
                  <option value="House">House</option>
                  <option value="Room">Room</option>
                  <option value="Annex">Annex</option>
                </select>
                <textarea rows="3" placeholder="Highlights (one per line)" className="border px-4 py-2 rounded col-span-1 md:col-span-2" />
                <select name="location" onChange={handleChange} className="border px-4 py-2 rounded">
                  <option value="">Select Location</option>
                  <option value="Weligama">Weligama</option>
                  <option value="Kamburugamuwa">Kamburugamuwa</option>
                  <option value="Kekanadurra">Kekanadurra</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-bold"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
