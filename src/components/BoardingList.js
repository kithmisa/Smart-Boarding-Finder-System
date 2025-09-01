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
  const [housesWithRatings, setHousesWithRatings] = useState([]);
  // In-memory auth state (avoid localStorage)
  const [authData, setAuthData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initialize auth state from safe storage flag so modal only shows once per session/device
    try {
      const hasAuthedFlag = localStorage.getItem('has_authed');
      if (hasAuthedFlag === '1') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      // storage might be unavailable; ignore and fall back to in-memory only
    }

    fetch("http://localhost:5000/api/houses/approved")
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch houses');
        }
        return res.json();
      })
      .then(response => {
        console.log('Fetched approved houses response:', response);
        
        // Handle both response formats: direct array or {success: true, houses: [...]}
        const data = response.houses || response;
        console.log('Processed houses data:', data);
        
        // Log basic info for debugging if needed
        console.log(`✅ Loaded ${data.length} approved houses (including all availability statuses)`);
        
        // Fetch ratings and sort houses by rating
        fetchRatingsAndSort(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch houses:", err);
        setError('Failed to load boarding houses');
        setLoading(false);
      });
  }, []);

  // Update authentication status when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const hasAuthedFlag = localStorage.getItem('has_authed');
        setIsAuthenticated(hasAuthedFlag === '1');
      } catch (e) {
        // ignore storage errors
      }
    };

    // Check initially
    checkAuthStatus();

    // Listen for storage changes
    window.addEventListener('storage', checkAuthStatus);
    
    // Also check periodically (in case localStorage is modified by other components)
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      clearInterval(interval);
    };
  }, []);

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

  // Fetch ratings for all houses and sort by rating
  const fetchRatingsAndSort = async (housesData) => {
    try {
      const housesWithRatingsData = await Promise.all(
        housesData.map(async (house) => {
          try {
            const response = await fetch(`http://localhost:5000/api/reviews/boarding/${house.id}`);
            if (response.ok) {
              const data = await response.json();
              return {
                ...house,
                averageRating: data.averageRating || 0,
                reviewCount: data.reviews ? data.reviews.length : 0
              };
            } else {
              return {
                ...house,
                averageRating: 0,
                reviewCount: 0
              };
            }
          } catch (error) {
            console.error(`Error fetching ratings for house ${house.id}:`, error);
            return {
              ...house,
              averageRating: 0,
              reviewCount: 0
            };
          }
        })
      );

      // Sort houses by rating (highest to lowest), then by review count
      const sortedHouses = housesWithRatingsData.sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        // If ratings are equal, sort by review count (more reviews = higher priority)
        return b.reviewCount - a.reviewCount;
      });

      setHousesWithRatings(sortedHouses);
      setHouses(sortedHouses);
      setFilteredHouses(sortedHouses);
      setOriginalHouses(sortedHouses);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      // Fallback to original data if rating fetch fails
      setHouses(housesData);
      setFilteredHouses(housesData);
      setOriginalHouses(housesData);
    }
  };

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
          'dewinuwara': ['dewundara', 'devundara', 'dewinuwara', 'dewinuwara'],
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
    
    // Maintain rating-based sorting after filtering
    const sortedFiltered = [...filtered].sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      // If ratings are equal, sort by review count (more reviews = higher priority)
      return b.reviewCount - a.reviewCount;
    });
    
    setHouses(applySearchFilters(originalHouses, searchFilters)); // Update houses for count calculation
    setFilteredHouses(sortedFiltered);
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

  const requireAuthThenNavigate = (houseId) => {
    console.log('🔐 requireAuthThenNavigate called with houseId:', houseId);
    console.log('🔑 Current auth status:', isAuthenticated ? 'authenticated' : 'not authenticated');
    
    if (isAuthenticated) {
      console.log('✅ User authenticated, navigating to:', `/boarding/${houseId}`);
      navigate(`/boarding/${houseId}`, { state: { authed: true } });
    } else {
      console.log('❌ User not authenticated, showing auth modal');
      // Use global navigation function
      if (window.setPendingNavigation) {
        window.setPendingNavigation(`/boarding/${houseId}`);
      } else {
        alert('Please sign in to view boarding details. Click the person icon in the navbar to sign in.');
      }
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
            <h3>No {activeFilter === 'all' ? 'Boarding Houses' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1).replace('-', '-') + ' Properties'} Found</h3>
            <p>Try a different filter or check back later!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boarding-bg-wrapper">
      <div className="boarding-bg-overlay">
        <div className="boarding-header">
          
          <h2>Boarding Houses</h2>
          <p>{filteredHouses.length} {activeFilter === 'all' ? 'approved properties' : activeFilter + ' properties'} availabble</p>
          <div className="sorting-info">
            <span className="sort-badge">⭐ “Find Your Ideal Boarding Today.</span>
          </div>
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
              style={{ marginLeft: '10px' }}
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
            <div className="boarding-card" key={house.id} onClick={() => requireAuthThenNavigate(house.id)}>
              <div className="card-image-wrapper">
                {(() => {
                  // Parse images - handle both string and array formats
                  let imageArray = [];
                  if (house.images) {
                    if (typeof house.images === 'string') {
                      try {
                        // Try to parse as JSON first
                        imageArray = JSON.parse(house.images);
                      } catch {
                        // If not JSON, treat as comma-separated string
                        imageArray = house.images.split(',').map(img => img.trim()).filter(img => img);
                      }
                    } else if (Array.isArray(house.images)) {
                      imageArray = house.images;
                    }
                  }

                  return imageArray && imageArray.length > 0 ? (
                    <img
                      src={`http://localhost:5000/uploads/${imageArray[0]}`}
                      alt={house.title}
                      className="card-image"
                      onError={(e) => {
                        console.log('Image load error for:', e.target.src);
                        e.target.src = '/image.png'; // Use the existing background image as fallback
                      }}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  );
                })()}

                {/* 🔧 More robust shortTerm check */}
                {(house.shortTerm === true || house.shortTerm === 'true' || house.shortTerm === 1 || house.shortTerm === '1') && (
                  <div className="short-term-badge">
                    📅 Short-term
                  </div>
                )}
                
                {(() => {
                  // Parse images for count badge
                  let imageArray = [];
                  if (house.images) {
                    if (typeof house.images === 'string') {
                      try {
                        imageArray = JSON.parse(house.images);
                      } catch {
                        imageArray = house.images.split(',').map(img => img.trim()).filter(img => img);
                      }
                    } else if (Array.isArray(house.images)) {
                      imageArray = house.images;
                    }
                  }
                  
                  return imageArray && imageArray.length > 1 && (
                    <div className="image-count-badge">
                      📷 {imageArray.length} photos
                    </div>
                  );
                })()}
              </div>

              <div className="card-content">
                <h3>{house.title}</h3>
                
                {/* Rating Display */}
                <div className="rating-section">
                  {house.averageRating > 0 ? (
                    <div className="rating-display">
                      <span className="stars">
                        {'⭐'.repeat(Math.floor(house.averageRating))}
                        {house.averageRating % 1 !== 0 && '⭐'}
                      </span>
                      <span className="rating-text">
                        {house.averageRating.toFixed(1)} ({house.reviewCount} {house.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  ) : (
                    <div className="no-rating">No reviews yet</div>
                  )}
                </div>
                
                <p><strong>Location:</strong> {house.location}, {house.city}</p>

                {/* Availability Status Badge */}
                <div className="card-availability-badge-inline">
                  {/* Handle cases where availabilityStatus might be undefined/null */}
                  {(() => {
                    const status = house.availabilityStatus || 'available'; // Default to available if not set
                    const isAvailable = status.toLowerCase() === 'available'; // Case-insensitive comparison
                    
                    return isAvailable ? (
                      <span className={`availability-label ${(house.shortTerm === true || house.shortTerm === 'true' || house.shortTerm === 1 || house.shortTerm === '1') ? 'short-term' : 'long-term'}`}>
                        🏠 Available
                      </span>
                    ) : (
                      <span className="availability-label unavailable">
                        ⏳ Unavailable
                        {house.availableDate && house.availableDate !== 'not set' && (
                          <span className="available-date">
                            <br />Available from: {new Date(house.availableDate).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    );
                  })()}
                  

                </div>
                
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