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

      // Pass nic via state when navigating to HouseDetails
      navigate('/register/house', { state: { nic } });
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

      // Pass nic via state on login navigate as well
      navigate('/register/house', { state: { nic: loginNIC } });
    } catch (err) {
      alert('❌ Server error');
    }
  };

  return (
    <>
      <Navbar />

      {/* Background Wrapper */}
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-xl shadow-xl w-full max-w-2xl mt-32">
          <h2 className="text-2xl text-black font-bold flex items-center gap-2 mb-6">
            <FaUser /> Owner Details
          </h2>
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              name="nic"
              type="text"
              placeholder="NIC"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              name="contact"
              type="text"
              placeholder="Contact"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
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
              className="w-full border px-4 py-2 mb-4 rounded"
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
