import React, { useEffect, useState } from "react";
import './BoardingList.css';
import { useNavigate } from 'react-router-dom';

const BoardingList = () => {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/houses/approved")
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch houses');
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched approved houses:', data);
        
        // 🔍 DEBUG: Log each house's shortTerm property
        data.forEach((house, index) => {
          console.log(`House ${index + 1}:`, {
            title: house.title,
            shortTerm: house.shortTerm,
            shortTermType: typeof house.shortTerm,
            shortTermValue: JSON.stringify(house.shortTerm)
          });
        });
        
        setHouses(data);
        setFilteredHouses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch houses:", err);
        setError('Failed to load boarding houses');
        setLoading(false);
      });
  }, []);

  // 🔧 IMPROVED: More robust filter function
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    
    let filtered;
    switch (filterType) {
      case 'short-term':
        // 🔧 More robust checking for shortTerm
        filtered = houses.filter(house => {
          // Check for various possible truthy values
          return house.shortTerm === true || 
                 house.shortTerm === 'true' || 
                 house.shortTerm === 1 || 
                 house.shortTerm === '1';
        });
        console.log('Short-term filtered houses:', filtered);
        break;
      case 'long-term':
        // 🔧 More robust checking for long-term
        filtered = houses.filter(house => {
          return house.shortTerm === false || 
                 house.shortTerm === 'false' || 
                 house.shortTerm === 0 || 
                 house.shortTerm === '0' || 
                 house.shortTerm === null || 
                 house.shortTerm === undefined ||
                 !house.shortTerm;
        });
        console.log('Long-term filtered houses:', filtered);
        break;
      default:
        filtered = houses;
    }
    
    setFilteredHouses(filtered);
  };

  // 🔧 HELPER: Count function for display
  const getFilterCount = (filterType) => {
    switch (filterType) {
      case 'short-term':
        return houses.filter(house => 
          house.shortTerm === true || 
          house.shortTerm === 'true' || 
          house.shortTerm === 1 || 
          house.shortTerm === '1'
        ).length;
      case 'long-term':
        return houses.filter(house => 
          house.shortTerm === false || 
          house.shortTerm === 'false' || 
          house.shortTerm === 0 || 
          house.shortTerm === '0' || 
          house.shortTerm === null || 
          house.shortTerm === undefined ||
          !house.shortTerm
        ).length;
      default:
        return houses.length;
    }
  };

  if (loading) {
    return (
      <div className="boarding-bg-wrapper">
        <div className="boarding-bg-overlay">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading boarding houses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="boarding-bg-wrapper">
        <div className="boarding-bg-overlay">
          <div className="error-container">
            <h3>Error Loading Houses</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredHouses.length === 0 && !loading) {
    return (
      <div className="boarding-bg-wrapper">
        <div className="boarding-bg-overlay">
          <div className="boarding-header">
            <h2>Available Boarding Houses</h2>
            <p>Filter your search</p>
          </div>

          <div className="filter-container">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All Properties ({getFilterCount('all')})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'short-term' ? 'active' : ''}`}
              onClick={() => handleFilterChange('short-term')}
            >
              📅 Short-term ({getFilterCount('short-term')})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'long-term' ? 'active' : ''}`}
              onClick={() => handleFilterChange('long-term')}
            >
              🏠 Long-term ({getFilterCount('long-term')})
            </button>
          </div>

          <div className="no-houses-container">
            <h3>No {activeFilter === 'all' ? 'Boarding Houses' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1).replace('-', '-') + ' Properties'} Available</h3>
            <p>Try a different filter or check back later!</p>
            {/* 🔍 DEBUG INFO - Remove this in production */}
            <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', fontSize: '12px'}}>
              <strong>Debug Info:</strong><br/>
              Total houses: {houses.length}<br/>
              Short-term count: {getFilterCount('short-term')}<br/>
              Long-term count: {getFilterCount('long-term')}<br/>
              Current filter: {activeFilter}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boarding-bg-wrapper">
      <div className="boarding-bg-overlay">
        <div className="boarding-header">
          <h2>Available Boarding Houses</h2>
          <p>{filteredHouses.length} {activeFilter === 'all' ? 'approved properties' : activeFilter + ' properties'} available</p>
        </div>

        <div className="filter-container">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Properties ({getFilterCount('all')})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'short-term' ? 'active' : ''}`}
            onClick={() => handleFilterChange('short-term')}
          >
            📅 Short-term ({getFilterCount('short-term')})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'long-term' ? 'active' : ''}`}
            onClick={() => handleFilterChange('long-term')}
          >
            🏠 Long-term ({getFilterCount('long-term')})
          </button>
        </div>

        <div className="boarding-grid-container">
          {filteredHouses.map((house) => (
            <div className="boarding-card" key={house.id} onClick={() => navigate(`/boarding/${house.id}`)}>
              <div className="card-image-wrapper">
                {house.images && house.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${house.images[0]}`}
                    alt={house.title}
                    className="card-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-house.jpg';
                    }}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}

                {/* 🔧 More robust shortTerm check */}
                {(house.shortTerm === true || house.shortTerm === 'true' || house.shortTerm === 1 || house.shortTerm === '1') && 
                 house.availabilityStatus === 'available' && (
                  <div className="short-term-badge">
                    📅 Short-term
                  </div>
                )}
                
                {house.images && house.images.length > 1 && (
                  <div className="image-count-badge">
                    📷 {house.images.length} photos
                  </div>
                )}
              </div>

              <div className="card-content">
                <h3>{house.title}</h3>
                <p><strong>Location:</strong> {house.location}, {house.city}</p>

                {house.availabilityStatus === 'available' && (
                  <div className="card-availability-badge-inline">
                    <span className={`availability-label ${(house.shortTerm === true || house.shortTerm === 'true' || house.shortTerm === 1 || house.shortTerm === '1') ? 'short-term' : 'long-term'}`}>
                      🏠 Available
                    </span>
                  </div>
                )}
                
                <div className="price-section">
                  <p className="main-price">
                    <strong>Monthly:</strong> Rs. {house.price}
                  </p>
                  {(house.shortTerm === true || house.shortTerm === 'true' || house.shortTerm === 1 || house.shortTerm === '1') && house.pricePerNight && (
                    <p className="short-term-price">
                      <strong>Per Night:</strong> Rs. {house.pricePerNight}
                    </p>
                  )}
                </div>

                <p><strong>Type:</strong> {house.roomType} / {house.type}</p>
                <p><strong>Gender Allowed:</strong> {house.genderAllowed}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardingList;