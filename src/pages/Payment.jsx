import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bgHero from '../assets/image.png';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';

const Payment = () => {
  const [cardNumber, setCardNumber] = useState('');

  // Allow only numeric input, limit to 16 digits
  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (input.length <= 16) setCardNumber(input);
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

      {/* Payment Form */}
      <div className="pt-10 pb-20  min-h-screen px-4">
        <div className="max-w-5xl mx-auto bg-white/80 shadow-md rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Card Info */}
            <div>
              <h2 className="text-lg text-black font-semibold mb-2">Card Information</h2>
              <p className="text-sm text-black mb-4">
                Indicate details of the card from which money will be debited
              </p>

              {/* Card icons */}
              <div className="flex items-center gap-4 mb-3">
                <FaCcVisa className="text-4xl text-blue-600" />
                <FaCcMastercard className="text-4xl text-red-600" />
              </div>

              <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{16}"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month and Year
                    </label>
                    <input
                      type="text"
                      placeholder="00 / 00"
                      className="w-full border border-gray-300 px-4 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      className="w-full border border-gray-300 px-4 py-2 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Personal Info */}
            <div>
              <h2 className="text-lg text-black font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border border-gray-300 px-4 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border border-gray-300 px-4 py-2 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Country"
                  className="border border-gray-300 px-4 py-2 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="border border-gray-300 px-4 py-2 rounded"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                className="border border-gray-300 px-4 py-2 rounded w-full"
              />
            </div>
          </div>

          {/* Pay Button */}
          <div className="text-center mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full text-lg font-semibold">
              PAY
            </button>
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
};

export default Payment;
