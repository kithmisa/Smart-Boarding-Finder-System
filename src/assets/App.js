import React from 'react';
import image from './assets/image.png'; // Add your background image to /assets folder
//import { FaFacebook, FaWhatsapp, FaInstagram, FaTwitter } from 'react-icons/fa';

function App() {
  return (
    <div className="bg-gray-100 text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-black bg-opacity-30 px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="text-lg font-semibold flex items-center gap-2">
          <img src="/logo1.png" alt="logo" className="w-16 h-16" />
          <span>Smart Boarding Finder</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Boardings</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">About</a>
        </div>
        <button className="bg-transparent text-black px-6 py-2 rounded-lg font-semibold text-xl hover:bg-gray-100 border-2 border-black">Register</button>
      </nav>

      {/* Hero Section */}
      <section
        className="h-screen flex flex-col justify-center px-8 pt-20"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold">Find your perfect stay,</h1>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mt-2">Stress-free.</h1>
          <button className="mt-6 bg-white bg-opacity-50 px-12 py-5 text-black rounded-3xl font-bold text-2xl hover:bg-gray-100">
            Search Now
          </button>
          <p className="mt-6 text-lg font-light">
            “Smart Boarding Finder helps students and professionals easily find trusted boarding
            places through a simple and user-friendly platform.”
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-75 text-white py-10 px-8 flex flex-col md:flex-row justify-between items-start gap-10">
        <div>
          <h2 className="text-2xl font-bold">Smart Boarding Finder</h2>
          <p className="mt-2 text-sm">Smart boarding solutions for University of Ruhuna students.</p>
          
        </div>

        <div>
          <h3 className="font-bold mb-2">Navigation</h3>
          <ul className="space-y-1">
            <li><a href="#" classname="hover:underline">Home</a></li>
            <li><a href="#" classname="hover:underline">Boardings</a></li>
            <li><a href="#" classname="hover:underline">Contact</a></li>
            <li><a href="#" classname="hover:underline">About</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2">Contact</h3>
          <p className="flex items-center gap-2">📧 info@sbf.lk</p>
          <p className="flex items-center gap-2 mt-2">📞 +94 712432145</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
