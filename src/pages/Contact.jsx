import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bgHero from '../assets/image.png';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';

const Contact = () => {
  return (
    <>
      <Navbar />

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
              {/* Address */}
              <div className="border p-4 py-10 rounded bg-white/80 shadow transition hover:bg-blue-600 hover:text-white">
                <FaMapMarkerAlt className="text-red-500 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Address</h3>
                <p className="text-sm">University of Ruhuna,<br />Matara.</p>
              </div>

              {/* Phone */}
              <div className="border p-4 py-10 rounded bg-white/80 shadow transition hover:bg-blue-600 hover:text-white">
                <FaPhoneAlt className="text-red-500 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p className="text-sm">+94 71 2 432 145</p>
              </div>

              {/* Email */}
              <div className="border p-4 py-10 rounded bg-white/80 shadow transition hover:bg-blue-600 hover:text-white">
                <FaEnvelope className="text-black-500 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-sm">info@sbf.lk</p>
              </div>

              {/* Web Address */}
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
      <section className="bg-white py-20 px-4 ">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black-800 mb-4">Have Questions? We're Here To Help!</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <input
              type="text"
              placeholder="Name"
              className="col-span-1 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="col-span-1 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Title"
              className="col-span-2 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Comments"
              rows="4"
              className="col-span-2 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
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

      <Footer />
    </>
  );
};

export default Contact;
