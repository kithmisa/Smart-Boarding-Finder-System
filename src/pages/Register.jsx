import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bgHero from '../assets/image.png';
import { useNavigate } from 'react-router-dom';
import {
  FaKey,
  FaUtensils,
  FaBroom,
  FaCar,
  FaCoffee,
  FaBath,
  FaBolt,
  FaFaucet,
  FaDoorOpen,
  FaChair
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

import { FaUser, FaHome, FaUpload, FaUserFriends } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
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
          {/* Section Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-black-600">
                <FaUser /> Owner Details
              </h2>
              <div className="h-1 w-20 bg-green-500 mt-1 mb-4 rounded-full" />
              <div className="space-y-4">
                <input type="text" placeholder="Name" className="w-full border border-gray-300 px-4 py-2 rounded" />
                <input type="email" placeholder="Email" className="w-full border border-gray-300 px-4 py-2 rounded" />
                <input type="text" placeholder="NIC" className="w-full border border-gray-300 px-4 py-2 rounded" />
                <input type="text" placeholder="Contact Numbers" className="w-full border border-gray-300 px-4 py-2 rounded" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-black-600">
                <FaHome /> House Details
              </h2>
              <div className="h-1 w-20 bg-green-500 mt-1 mb-4 rounded-full" />
              <div className="space-y-4">
                <input type="text" placeholder="Title" className="w-full border border-gray-300 px-4 py-2 rounded" />
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">Room Type</span>
                  <label className="flex items-center gap-1 text-sm">
                    <input type="radio" name="roomType" value="private" />
                    <FaUser /> Private
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input type="radio" name="roomType" value="shared" />
                    <FaUserFriends /> Shared
                  </label>
                </div>
                <input type="text" placeholder="Price Range" className="w-full border border-gray-300 px-4 py-2 rounded" />
                <input type="text" placeholder="Address" className="w-full border border-gray-300 px-4 py-2 rounded" />

                {/* Image Upload Section */}
                <div>
                  <p className="text-sm font-medium mb-2">Images (at least 2 required)</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <FaUpload className="text-blue-500 text-3xl mb-2" />
                    <span>Drag & drop or click to upload</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
                        {/* House Features Section */}
            <div className="mt-12">
           <h2 className="text-xl font-bold flex items-center gap-2 text-black-600 mb-4">
                <FaHome /> House Features
            </h2>
            <div className="h-1 w-24 bg-green-500 mb-6 rounded-full" />

            {/* Feature Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 text-sm text-black-700">
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaKey /> Key Money
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaUtensils /> Dinner Provided
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaBroom /> Cleaning Service
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaCar /> Parking Space
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaCoffee /> Breakfast Provided
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaUtensils /> Lunch Provided
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaChair /> Common Kitchen Access
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaBath /> Attached Bathroom
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaBolt /> Electricity Included
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaFaucet /> Water Bill Included
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaDoorOpen /> Private Entrance
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" />
                <FaUserFriends /> Visitors Allowed
            </label>
            </div>


            {/* Map and Drop-downs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Google Map" className="border border-gray-300 px-4 py-2 rounded" />
                
                <select className="border border-gray-300 px-4 py-2 rounded">
                <option value="">Select City</option>
                <option value="Matara">Matara</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 flex justify-center items-center gap-2 w-full md:w-auto">
            <MdLocationOn className="text-lg" />
            Pick Location
            </button>


                <select className="border border-gray-300 px-4 py-2 rounded">
                <option value="">Select Type</option>
                <option value="House">House</option>
                <option value="Room">Room</option>
                <option value="Annex">Annex</option>
                </select>

                <textarea
                rows="3"
                placeholder="Highlights (one per line)"
                className="border border-gray-300 px-4 py-2 rounded col-span-1 md:col-span-2"
                ></textarea>

                <select className="border border-gray-300 px-4 py-2 rounded">
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
            onClick={() => navigate('/payment')}
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
