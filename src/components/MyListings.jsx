import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const nic = localStorage.getItem('nic');

  useEffect(() => {
    if (!nic) return;

    fetch(`http://localhost:5000/api/houses/owner/${nic}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched listings from backend:", data);
        if (Array.isArray(data)) {
          setListings(data);
        } else {
          console.warn("Expected array, got:", data);
          setListings([]);
        }
      })
      .catch(err => console.error("Failed to fetch listings:", err));
  }, [nic]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`http://localhost:5000/api/houses/${id}`, { method: 'DELETE' });
    setListings(prev => prev.filter(list => list.id !== id));
  };

  const handleAvailabilityChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Gone' : 'Available';
    let availableDate = null;

    if (newStatus === 'Gone') {
      const date = prompt('Enter available date (YYYY-MM-DD)');
      if (!date) return;
      availableDate = date;
    }

    await fetch(`http://localhost:5000/api/houses/${id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, availableDate }),
    });

    setListings(prev =>
      prev.map(list =>
        list.id === id ? { ...list, availabilityStatus: newStatus, availableDate } : list
      )
    );
  };

  return (
    <div className="px-6 py-20 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map(list => (
          <div key={list.id} className="border p-4 rounded shadow relative">
            <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded 
              ${list.availabilityStatus === 'Available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {list.availabilityStatus}
            </span>

            <h3 className="text-xl font-semibold">{list.title}</h3>
            <p>{list.address}</p>
            <p>Rs. {list.price}</p>
            <p>{list.roomType} | {list.genderAllowed}</p>
            {list.availabilityStatus === 'Gone' && list.availableDate && (
              <p className="text-sm text-gray-500">Available from: {list.availableDate}</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => navigate(`/owner/edit/${list.id}`, { state: list })}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(list.id)}
              >
                Delete
              </button>
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded"
                onClick={() => handleAvailabilityChange(list.id, list.availabilityStatus)}
              >
                {list.availabilityStatus === 'Available' ? 'Mark Gone' : 'Mark Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListings;
