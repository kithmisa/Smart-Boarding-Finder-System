import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // set threshold scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`flex justify-between items-center text-black font-bold px-2 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#5F5F5F] shadow-md' : 'bg-black bg-opacity-10'
      }`}
    >
      <div className="text-lg font-semibold flex items-center gap-4">
        <img src="/logo1.png" alt="logo" className="w-24 h-24" />
      </div>
      <div className="flex gap-14 ml-80">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Boardings</a>
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">About</a>
      </div>
      <button className="bg-transparent text-black px-6 py-2.5 rounded-xl font-bold text-xl hover:bg-gray-100 border-2 border-black">
        Register
      </button>
    </nav>
  );
};

export default Navbar;
