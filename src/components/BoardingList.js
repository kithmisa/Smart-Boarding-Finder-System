import React, { useEffect, useState } from "react";
import './BoardingList.css';
import { useNavigate, useLocation } from 'react-router-dom';

const BoardingList = () => {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchFilters, setSearchFilters] = useState({});
  const [originalHouses, setOriginalHouses] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filters = {};
    
    // Extract search parameters
    if (urlParams.get('location')) filters.location = urlParams.get('location');
    if (urlParams.get('genderAllowed')) filters.genderAllowed = urlParams.get('genderAllowed');
    if (urlParams.get('roomType')) filters.roomType = urlParams.get('roomType');
    if (urlParams.get('priceRange')) filters.priceRange = urlParams.get('priceRange');
    
    setSearchFilters(filters);
  }, [location.search]);

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
        setOriginalHouses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch houses:", err);
        setError('Failed to load boarding houses');
        setLoading(false);
      });
  }, []);

  // Apply search filters to houses
  const applySearchFilters = (housesToFilter, filters) => {
    console.log('🔍 Applying search filters:', filters);
    console.log('🏠 Houses to filter:', housesToFilter.length);
    
    if (!filters || Object.keys(filters).length === 0) {
      console.log('✅ No filters applied, returning all houses');
      return housesToFilter;
    }

    const filtered = housesToFilter.filter(house => {
      console.log('\n🏡 Checking house:', house.title);
      console.log('House location:', house.location, 'Filter location:', filters.location);
      console.log('House gender:', house.genderAllowed, 'Filter gender:', filters.genderAllowed);
      console.log('House room type:', house.roomType, 'Filter room type:', filters.roomType);
      console.log('House price:', house.price, 'Filter price range:', filters.priceRange);
      
      // Location filter - very flexible matching
      if (filters.location) {
        const houseLocation = (house.location || '').toLowerCase();
        const filterLocation = filters.location.toLowerCase();
        
        // Handle common spelling variations
        const locationVariations = {
          'devinuwara': ['dewundara', 'devundara', 'dewinuwara', 'devinuwara'],
          'dewinuwara': ['dewundara', 'devundara', 'devinuwara', 'dewinuwara'],
          'dewundara': ['devundara', 'dewinuwara', 'devinuwara', 'dewundara'],
          'devundara': ['dewundara', 'dewinuwara', 'devinuwara', 'devundara'],
          'matara': ['matara town', 'matara']
        };
        
        let locationMatch = false;
        
        // Direct match
        if (houseLocation === filterLocation || 
            houseLocation.includes(filterLocation) || 
            filterLocation.includes(houseLocation)) {
          locationMatch = true;
        }
        
        // Check variations
        if (!locationMatch) {
          for (const [key, variations] of Object.entries(locationVariations)) {
            if (filterLocation.includes(key)) {
              locationMatch = variations.some(variant => 
                houseLocation.includes(variant) || variant.includes(houseLocation)
              );
              if (locationMatch) break;
            }
          }
        }
        
        if (!locationMatch) {
          console.log('❌ Location filter failed. House:', houseLocation, 'Filter:', filterLocation);
          return false;
        }
        console.log('✅ Location filter passed');
      }

      // Gender filter - standardized matching
      if (filters.genderAllowed) {
        const houseGender = (house.genderAllowed || '').toLowerCase();
        const filterGender = filters.genderAllowed.toLowerCase();
        
        // Direct match or "Anyone" accommodation
        let genderMatch = houseGender === filterGender || 
                         houseGender === 'anyone' || 
                         filterGender === 'anyone';
        
        if (!genderMatch) {
          console.log('❌ Gender filter failed. House:', houseGender, 'Filter:', filterGender);
          return false;
        }
        console.log('✅ Gender filter passed');
      }

      // Room type filter - flexible matching
      if (filters.roomType) {
        const houseRoomType = (house.roomType || '').toLowerCase();
        const houseType = (house.type || '').toLowerCase();
        const filterRoomType = filters.roomType.toLowerCase();
        
        // Handle variations like "shared room" vs "shared"
        const roomTypeVariations = {
          'shared room': ['shared', 'share', 'shared room'],
          'shared': ['shared room', 'shared', 'share'],
          'single room': ['single', 'single room'],
          'single': ['single room', 'single'],
          'dormitory': ['dorm', 'dormitory'],
          'dorm': ['dormitory', 'dorm'],
          'apartment': ['apt', 'apartment'],
          'apt': ['apartment', 'apt']
        };
        
        let roomTypeMatch = houseRoomType === filterRoomType || 
                           houseType === filterRoomType ||
                           houseRoomType.includes(filterRoomType) ||
                           houseType.includes(filterRoomType);
        
        // Check variations
        if (!roomTypeMatch) {
          for (const [key, variations] of Object.entries(roomTypeVariations)) {
            if (filterRoomType.includes(key.toLowerCase())) {
              roomTypeMatch = variations.some(variant => 
                houseRoomType.includes(variant) || houseType.includes(variant)
              );
              if (roomTypeMatch) break;
            }
          }
        }
        
        if (!roomTypeMatch) {
          console.log('❌ Room type filter failed. House roomType:', houseRoomType, 'House type:', houseType, 'Filter:', filterRoomType);
          return false;
        }
        console.log('✅ Room type filter passed');
      }

      // Price range filter
      if (filters.priceRange) {
        const price = parseInt(house.price) || 0;
        let priceMatch = false;
        
        if (filters.priceRange.includes('+')) {
          // Handle "15000+" format
          const minPrice = parseInt(filters.priceRange.replace('+', ''));
          priceMatch = price >= minPrice;
        } else {
          // Handle "5000-10000" format
          const [min, max] = filters.priceRange.split('-');
          const minPrice = parseInt(min) || 0;
          const maxPrice = parseInt(max) || Infinity;
          priceMatch = price >= minPrice && price <= maxPrice;
        }
        
        if (!priceMatch) {
          console.log('❌ Price filter failed. House price:', price, 'Filter:', filters.priceRange);
          return false;
        }
        console.log('✅ Price filter passed');
      }

      console.log('✅ All filters passed for house:', house.title);
      return true;
    });
    
    console.log('🎯 Filtered result:', filtered.length, 'houses');
    return filtered;
  };

  // Apply both search filters and term filters
  useEffect(() => {
    let filtered = originalHouses;
    
    // First apply search filters
    filtered = applySearchFilters(filtered, searchFilters);
    
    // Then apply term filters (short/long term)
    switch (activeFilter) {
      case 'short-term':
        filtered = filtered.filter(house => {
          return house.shortTerm === true || 
                 house.shortTerm === 'true' || 
                 house.shortTerm === 1 || 
                 house.shortTerm === '1';
        });
        break;
      case 'long-term':
        filtered = filtered.filter(house => {
          return house.shortTerm === false || 
                 house.shortTerm === 'false' || 
                 house.shortTerm === 0 || 
                 house.shortTerm === '0' || 
                 house.shortTerm === null || 
                 house.shortTerm === undefined ||
                 !house.shortTerm;
        });
        break;
      default:
        // 'all' - no additional filtering needed
        break;
    }
    
    setHouses(applySearchFilters(originalHouses, searchFilters)); // Update houses for count calculation
    setFilteredHouses(filtered);
  }, [originalHouses, searchFilters, activeFilter]);

  // 🔧 IMPROVED: More robust filter function
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
  };

  // Clear search filters
  const clearSearchFilters = () => {
    setSearchFilters({});
    navigate('/boarding');
  };

  // Format filter display text
  const formatFilterText = (key, value) => {
    switch (key) {
      case 'location':
        return `📍 ${value}`;
      case 'genderAllowed':
        return `👥 ${value}`;
      case 'roomType':
        return `🏠 ${value}`;
      case 'priceRange':
        const [min, max] = value.split('-');
        if (max === undefined) {
          return `💰 Over ${min.replace('+', '')} LKR`;
        }
        return `💰 ${min}-${max} LKR`;
      default:
        return value;
    }
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

          {/* Active Search Filters Display */}
          {Object.keys(searchFilters).length > 0 && (
            <div className="active-filters">
              <strong style={{ color: '#ffffff', marginRight: '10px' }}>Active Filters:</strong>
              {Object.entries(searchFilters).map(([key, value]) => (
                <span key={key} className="filter-tag">
                  {formatFilterText(key, value)}
                </span>
              ))}
              <button 
                className="clear-filters-btn" 
                onClick={clearSearchFilters}
                title="Clear all search filters"
              >
                ❌ Clear Filters
              </button>
            </div>
          )}

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

        {/* Active Search Filters Display */}
        {Object.keys(searchFilters).length > 0 && (
          <div className="active-filters">
            <strong style={{ color: '#ffffff', marginRight: '10px' }}>Active Filters:</strong>
            {Object.entries(searchFilters).map(([key, value]) => (
              <span key={key} className="filter-tag">
                {formatFilterText(key, value)}
              </span>
            ))}
            <button 
              className="clear-filters-btn" 
              onClick={clearSearchFilters}
              title="Clear all search filters"
            >
              ❌ Clear Filters
            </button>
          </div>
        )}

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