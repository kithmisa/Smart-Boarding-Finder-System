import React from 'react';
import { FaFacebook, FaWhatsapp, FaInstagram} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black bg-opacity-60 text-white py-10 px-8 flex flex-col md:flex-row justify-between items-start gap-10">
      <div>
        <h2 className="text-xl font-bold">Smart Boarding Finder</h2>
        <p className="mt-2 text-sm">Smart boarding solutions for University of Ruhuna students.</p>
        <div className="flex gap-4 mt-4 text-2xl">
          <FaWhatsapp />
          <FaInstagram />
          <FaFacebook />
          
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-2">Navigation</h3>
        <ul className="space-y-1">
          <li><a href="#">Home</a></li>
          <li><a href="#">Boardings</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text- black mb-2">Contact</h3>
        <p className="flex items-center gap-2">📧 info@sbf.lk</p>
        <p className="flex items-center gap-2 mt-2">📞 +94 712432145</p>
      </div>
    </footer>
  );
};

export default Footer;
