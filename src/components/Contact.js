import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bgHero from '../assets/image.png';

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    comments: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form data:', formData); // ✅ Show what's being submitted


  try {
    const response = await fetch('http://localhost:5000/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

      const rawText = await response.text(); // 👈 log it raw
console.log('Raw response:', rawText);

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    alert('✅ Message sent successfully!');
    setFormData({ name: '', email: '', title: '', comments: '' });
  } catch (err) {
    console.error(err);
    alert('❌ Failed to send message. Please try again.');
  }
};


  return (
    <>
      {/* Hero background wrapper */}
      <div
        className="relative flex-grow px-8 pt-32 pb-16 text-white"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Contact Cards Section */}
        <section className="pt-32 pb-16 px-6 text-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="border p-4 py-10 rounded bg-white/80 shadow transition hover:bg-blue-600 hover:text-white">
                <FaMapMarkerAlt className="text-red-500 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Address</h3>
                <p className="text-sm">University Of Ruhuna,<br />Matara.</p>
              </div>

              <div className="border p-4 py-10 rounded bg-white/80 shadow transition hover:bg-blue-600 hover:text-white">
                <FaPhoneAlt className="text-red-500 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p className="text-sm">+94 71 2 432 145</p>
              </div>

              <div className="border p-4 py-10 rounded bg-white/80 shadow transition hover:bg-blue-600 hover:text-white">
                <FaEnvelope className="text-black-500 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-sm">smartboproject@gmail.com</p>
              </div>

              <div className="border p-4 py-10 rounded bg-white/80 shadow transition hover:bg-blue-600 hover:text-white">
                <FaGlobe className="text-black-500 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Web Address</h3>
                <p className="text-sm">www.smartboardingfinder.lk</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Contact Form Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black-800 mb-4">Have Questions? We're Here To Help!</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="col-span-1 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="col-span-1 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="col-span-2 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Comments"
              rows="4"
              className="col-span-2 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded"
              >
                SEND
              </button>
            </div>
          </form>
        </div>
      </section>

      
    </>
  );
};

export default Contact;
