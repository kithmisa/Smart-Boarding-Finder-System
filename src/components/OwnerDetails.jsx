import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import Navbar from './Navbar';
import bgHero from '../assets/image.png';

const OwnerDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    contact: '',
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginNIC, setLoginNIC] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, email, nic, contact } = formData;
    if (!name || !email || !nic || !contact) {
      alert("❌ Please fill out all fields.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/owner/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Registration failed');
        return;
      }

      alert('✅ Registered successfully');
      navigate('/register/house', { state: { ownerData: formData } });
    } catch (err) {
      alert('❌ Server error');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nic: loginNIC }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }

      alert('✅ Login successful');
      setShowLoginModal(false);
      navigate('/register/house');
    } catch (err) {
      alert('❌ Server error');
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero background wrapper */}
      <div
        className="relative flex-grow px-8 pt-32 pb-16"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Form section */}
        <div className="pt-32 pb-20 px-6 bg-white/50 min-h-screen">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-black">
              <FaUser /> Owner Details
            </h2>
            <div className="h-1 w-20 bg-green-600 mt-1 mb-4 rounded-full" />
            <div className="space-y-4">
              <input
                name="name"
                type="text"
                placeholder="Name"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded text-black placeholder-gray-500"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded text-black placeholder-gray-500"
              />
              <input
                name="nic"
                type="text"
                placeholder="NIC"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded text-black placeholder-gray-500"
              />
              <input
                name="contact"
                type="text"
                placeholder="Contact"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded text-black placeholder-gray-500"
              />

              <button
                onClick={handleRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-bold mt-4"
              >
                Register
              </button>

              <p className="mt-4 text-sm text-black">
                Already registered?{' '}
                <span
                  onClick={() => setShowLoginModal(true)}
                  className="text-blue-700 hover:underline cursor-pointer font-semibold"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NIC Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Login with NIC</h2>
            <input
              type="text"
              placeholder="Enter NIC"
              value={loginNIC}
              onChange={(e) => setLoginNIC(e.target.value)}
              className="w-full border px-4 py-2 mb-4 rounded text-black placeholder-gray-500"
            />
            <button
              onClick={handleLogin}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Login
            </button>
            <p
              onClick={() => setShowLoginModal(false)}
              className="mt-4 text-sm text-gray-600 hover:underline cursor-pointer"
            >
              Cancel
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerDetails;
