import React from "react";

export default function Boardings() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-red-500 text-2xl">\u</span>
          Smart Boarding Finder
        </div>
        <nav className="space-x-6">
          <a href="#" className="hover:text-red-400">Home</a>
          <a href="#" className="hover:text-red-400">Boardings</a>
          <a href="#" className="hover:text-red-400">Contact</a>
          <a href="#" className="hover:text-red-400">About</a>
          <button className="bg-white text-black font-semibold px-4 py-1 rounded">Register</button>
        </nav>
      </header>

      {/* Main content */}
      <main className="bg-[url('./image(1).png')] bg-cover bg-center py-12 px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white text-black p-4 rounded-xl shadow-lg">
          <img
            src="boarding 1.jpeg"
            alt="Shared Room"
            className="w-full h-48 object-cover rounded-md"
          />
          <h2 className="font-bold mt-4">Shared Room in Meddawatha</h2>
          <p className="text-sm mt-1">no 801, Ariyawamsa mawatha, Meddawatha</p>
          <button className="bg-red-600 text-white px-4 py-1 rounded mt-3">GONE</button>
          <p className="text-xs mt-2">Available from May 16</p>
        </div>

        <div className="bg-white text-black p-4 rounded-xl shadow-lg">
          <img
            src="/boarding 2.jpg"
            alt="Single Room"
            className="w-full h-48 object-cover rounded-md"
          />
          <h2 className="font-bold mt-4">Single Room in Wellamadawa</h2>
          <p className="text-sm mt-1">no 16, main road, Wellamadawa</p>
          <button className="bg-green-500 text-white px-4 py-1 rounded mt-3">Available</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6 grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold">Smart Boarding Finder</h3>
          <p className="text-sm mt-2">Smart boarding solutions for University of Ruhuna students.</p>
          <div className="flex space-x-4 mt-4">
            <a href="#"><img src="/facebook.svg" alt="Facebook" className="w-5 h-5" /></a>
            <a href="#"><img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" /></a>
            <a href="#"><img src="/instagram.svg" alt="Instagram" className="w-5 h-5" /></a>
            <a href="#"><img src="/twitter.svg" alt="Twitter" className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Navigation</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Home</a></li>
            <li><a href="#">Boardings</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2">Contact</h3>
          <p className="text-sm flex items-center gap-2">
            <img src="/mail.svg" alt="email" className="w-4 h-4" /> info@sbf.lk
          </p>
          <p className="text-sm flex items-center gap-2 mt-2">
            <img src="/phone.svg" alt="phone" className="w-4 h-4" /> +94 712432145
          </p>
        </div>
      </footer>
    </div>
  );
}
