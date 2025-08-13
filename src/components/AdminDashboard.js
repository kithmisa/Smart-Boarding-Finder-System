import React, { useEffect, useState } from 'react';
import { Users, Home, User, MessageCircle, Settings, Menu, X, Reply, Eye, Trash2, CheckCircle, Clock, Building, MapPin, Calendar, Star, Image, ExternalLink } from 'lucide-react';
import bgHero from '../assets/image.png';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data states
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [houses, setHouses] = useState([]);
  const [comments, setComments] = useState([]);
  const [boardingHouses, setBoardingHouses] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [houseDetailsModalOpen, setHouseDetailsModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Fetch data based on active section
  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    if (activeSection === 'dashboard') return;
    
    setLoading(true);
    setError('');
    
    try {
      let endpoint = '';
      switch (activeSection) {
        case 'users':
          endpoint = '/api/admin/users';
          break;
        case 'owners':
          endpoint = '/api/admin/owners';
          break;
        case 'houses':
          endpoint = '/api/admin/houses';
          break;
        case 'comments':
          endpoint = '/api/admin/comments';
          break;
        case 'boarding':
          endpoint = '/api/admin/boarding-houses';
          break;
        default:
          return;
      }

      const res = await fetch(`http://localhost:5000${endpoint}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();
      
      if (data.success) {
        switch (activeSection) {
          case 'users':
            setUsers(data.users || []);
            break;
          case 'owners':
            setOwners(data.owners || []);
            break;
          case 'houses':
            setHouses(data.houses || []);
            break;
          case 'comments':
            setComments(data.comments || []);
            break;
          case 'boarding':
            setBoardingHouses(data.boardingHouses || []);
            break;
        }
      }
    } catch (err) {
      setError(`Error loading ${activeSection}: ` + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle house approval/rejection
  const handleApproveHouse = async (houseId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/houses/${houseId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Approval failed');
      }

      // Update local state
      setHouses(houses.map(h => 
        h.id === houseId ? { ...h, status: 'approved' } : h
      ));
      
      alert('House approved successfully! It is now visible to users.');
    } catch (err) {
      alert('Approval failed: ' + err.message);
    }
  };

  const handleRejectHouse = async (houseId) => {
   const rejectionReason = prompt("Please provide a reason for rejecting this house:");
    
      if (rejectionReason === null) {
      console.log("Rejection cancelled by user");
      return; // Exit without sending request
    }
    
    // If user clicked OK but left empty, use default
    const finalReason = rejectionReason.trim() || "No reason provided";
    

    try {
      const res = await fetch(`http://localhost:5000/api/admin/houses/${houseId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  rejection_reason: finalReason })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Rejection failed');
      }

      // Update local state
      setHouses(houses.map(h => 
        h.id === houseId ? { ...h, status: 'rejected', rejection_reason: finalReason } : h
      ));
      
      alert('House rejected successfully.');
    } catch (err) {
      alert('Rejection failed: ' + err.message);
    }
  };

  // Fetch detailed house information
  const fetchHouseDetails = async (houseId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/houses/${houseId}/details`);
      if (!res.ok) throw new Error('Failed to fetch house details');
      
      const data = await res.json();
      if (data.success) {
        setSelectedHouse(data.house);
        setHouseDetailsModalOpen(true);
      }
    } catch (err) {
      alert('Failed to fetch house details: ' + err.message);
    }
  };

  const handleConfirmBoarding = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/boarding-houses/${id}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Confirmation failed');
      }

      setBoardingHouses(boardingHouses.map(b => 
        b.id === id ? { ...b, status: 'confirmed', confirmed: true } : b
      ));
      
      alert('Boarding house confirmed successfully! It is now visible on the boarding page.');
    } catch (err) {
      alert('Confirmation failed: ' + err.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/${type}/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Delete failed');
      }

      switch (type) {
        case 'users':
          setUsers(users.filter(u => u.id !== id));
          break;
        case 'owners':
          setOwners(owners.filter(o => o.id !== id));
          break;
        case 'houses':
          setHouses(houses.filter(h => h.id !== id));
          break;
        case 'comments':
          setComments(comments.filter(c => c.id !== id));
          break;
        case 'boarding-houses':
          setBoardingHouses(boardingHouses.filter(b => b.id !== id));
          break;
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/comments/${selectedComment.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyMessage })
      });
      
      if (!res.ok) throw new Error('Reply failed');
      
      setComments(comments.map(c => 
        c.id === selectedComment.id 
          ? { ...c, reply: replyMessage, replied: true }
          : c
      ));
      
      setReplyModalOpen(false);
      setReplyMessage('');
      setSelectedComment(null);
    } catch (err) {
      alert('Reply failed: ' + err.message);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'owners', label: 'Owner Management', icon: User },
    { id: 'houses', label: 'House Management', icon: Home },
   /* { id: 'boarding', label: 'Boarding Houses', icon: Building },*/
    { id: 'comments', label: 'Comments & Replies', icon: MessageCircle },
  ];

  // House Details Modal Component
  const HouseDetailsModal = () => {
    if (!selectedHouse) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case 'approved': return 'text-green-600 bg-green-100';
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'rejected': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };


       // ✅ FIXED: Proper rejection reason display
    const rejectionReasonText = selectedHouse.status === 'rejected' && selectedHouse.rejection_reason 
      ? selectedHouse.rejection_reason 
      : (selectedHouse.status === 'rejected' ? 'No reason provided' : null);

    // ✅ FIXED: Proper image handling
    const houseImages = selectedHouse.images || [];
    console.log('House images in modal:', houseImages); // Debug log



    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedHouse.title}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedHouse.status)}`}>
                    {selectedHouse.status || 'pending'}
                  </span>
                  <span className="text-gray-600">ID: {selectedHouse.id}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setHouseDetailsModalOpen(false);
                  setSelectedHouse(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Images */}
            {selectedHouse.images && selectedHouse.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Image size={20} />
                  Property Images ({selectedHouse.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedHouse.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                       // src={`http://localhost:5000/${image.replace(/\\/g, '/')}`}
                       src={`http://localhost:5000/uploads/${image}`} 
                       alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = bgHero;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="space-y-2">
                  <div><strong>Room Type:</strong> {selectedHouse.roomType}</div>
                  <div><strong>Gender Allowed:</strong> {selectedHouse.genderAllowed}</div>
                  <div><strong>Price:</strong> ${selectedHouse.price}</div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <strong>Location:</strong> {selectedHouse.location}
                  </div>
                  <div><strong>City:</strong> {selectedHouse.city}</div>
                  <div><strong>Type:</strong> {selectedHouse.type}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Availability</h3>
                <div className="space-y-2">
                  <div><strong>Status:</strong> {selectedHouse.availabilityStatus}</div>
                  {selectedHouse.availableDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <strong>Available From:</strong> {new Date(selectedHouse.availableDate).toLocaleDateString()}
                    </div>
                  )}
                  <div><strong>Short Term Available:</strong> {selectedHouse.shortTerm ? 'Yes' : 'No'}</div>
                  {selectedHouse.shortTerm && selectedHouse.pricePerNight && (
                    <div><strong>Price per Night:</strong> ${selectedHouse.pricePerNight}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Full Address</h3>
              <p className="text-gray-700">{selectedHouse.address}</p>
            </div>

            {/* Features */}
            {selectedHouse.features && selectedHouse.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHouse.features.map((feature, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Short Term Features */}
            {selectedHouse.shortFeatures && selectedHouse.shortFeatures.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Short Term Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHouse.shortFeatures.map((feature, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedHouse.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedHouse.description}</p>
              </div>
            )}

            {/* Highlights */}
            {selectedHouse.highlights && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3 flex items-center gap-2">
                  <Star size={18} />
                  Highlights
                </h3>
                <p className="text-gray-700">{selectedHouse.highlights}</p>
              </div>
            )}

            {/* Owner Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Owner Information</h3>
              <div className="space-y-2">
                <div><strong>Owner ID:</strong> {selectedHouse.owner_id}</div>
                {selectedHouse.owner_name && <div><strong>Owner Name:</strong> {selectedHouse.owner_name}</div>}
                {selectedHouse.owner_email && <div><strong>Owner Email:</strong> {selectedHouse.owner_email}</div>}
                {selectedHouse.owner_phone && <div><strong>Owner Phone:</strong> {selectedHouse.owner_phone}</div>}
              </div>
            </div>

            {/* Dates */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Submission Details</h3>
              <div className="space-y-2">
                <div><strong>Submitted:</strong> {selectedHouse.created_at ? new Date(selectedHouse.created_at).toLocaleString() : 'N/A'}</div>
                <div><strong>Last Updated:</strong> {selectedHouse.updated_at ? new Date(selectedHouse.updated_at).toLocaleString() : 'N/A'}</div>
              </div>
            </div>

            {/* Rejection Reason */}
            {selectedHouse.status === 'rejected' && selectedHouse.rejection_reason && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3 text-red-600">Rejection Reason</h3>
                <p className="text-red-700 bg-red-50 p-3 rounded">{selectedHouse.rejection_reason}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {selectedHouse.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApproveHouse(selectedHouse.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approve House
                  </button>
                  <button
                    onClick={() => handleRejectHouse(selectedHouse.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject House
                  </button>
                </>
              )}
              {selectedHouse.status === 'approved' && (
                <a
                  href="http://localhost:3000/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                  View Live
                </a>
              )}
              <button
                onClick={() => handleDelete('houses', selectedHouse.id)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete House
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfileModal = ({ profile, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Profile Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div><strong>ID:</strong> {profile?.id}</div>
          <div><strong>Name:</strong> {profile?.name || 'N/A'}</div>
          <div><strong>Email:</strong> {profile?.email || 'N/A'}</div>
          <div><strong>NIC:</strong> {profile?.nic || 'N/A'}</div>
          <div><strong>Phone:</strong> {profile?.contact || 'N/A'}</div>
        {/*  <div><strong>Created:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</div>*/}
        </div>
      </div>
    </div>
  );

  const ReplyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reply to Comment</h3>
          <button onClick={() => setReplyModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Original Comment:</p>
          <div className="bg-gray-100 p-3 rounded text-sm">
            {selectedComment?.message}
          </div>
        </div>
        <textarea
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          placeholder="Type your reply..."
          className="w-full border rounded p-3 mb-4 h-24 resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleReply}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send Reply
          </button>
          <button
            onClick={() => setReplyModalOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const pendingHouses = houses.filter(h => h.status === 'pending' || !h.status).length;
    const approvedHouses = houses.filter(h => h.status === 'approved').length;
    const rejectedHouses = houses.filter(h => h.status === 'rejected').length;
    const pendingBoardings = boardingHouses.filter(b => b.status === 'pending' || !b.confirmed).length;
    const confirmedBoardings = boardingHouses.filter(b => b.status === 'confirmed' || b.confirmed).length;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            </div>
            <Users className="text-blue-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Owners</p>
              <p className="text-2xl font-bold text-green-600">{owners.length}</p>
            </div>
            <User className="text-green-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Houses</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingHouses}</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Houses</p>
              <p className="text-2xl font-bold text-green-600">{approvedHouses}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Boardings</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingBoardings}</p>
            </div>
            <Building className="text-yellow-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed Boardings</p>
              <p className="text-2xl font-bold text-green-600">{confirmedBoardings}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-orange-600">{comments.length}</p>
            </div>
            <MessageCircle className="text-orange-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected Houses</p>
              <p className="text-2xl font-bold text-red-600">{rejectedHouses}</p>
            </div>
            <X className="text-red-500" size={32} />
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">User Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{user.id}</td>
                <td className="px-6 py-4 text-sm">{user.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">{user.email || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProfile(user)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete('users', user.id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOwners = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Owner Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {owners.map(owner => (
              <tr key={owner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{owner.id}</td>
                <td className="px-6 py-4 text-sm">{owner.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">{owner.email || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">{owner.nic || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProfile(owner)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete('owners', owner.id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHouses = () => {
    const pendingHouses = houses.filter(h => h.status === 'pending' || !h.status);
    const approvedHouses = houses.filter(h => h.status === 'approved');
    const rejectedHouses = houses.filter(h => h.status === 'rejected');

    return (
      <div className="space-y-6">
        {/* Pending Houses */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-yellow-50">
            <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
              <Clock size={20} />
              Pending Houses ({pendingHouses.length})
            </h3>
            <p className="text-sm text-yellow-600 mt-1">These houses are waiting for your approval</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price(lkr)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Short Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingHouses.map(house => (
                  <tr key={house.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{house.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{house.title}</td>
                    <td className="px-6 py-4 text-sm">{house.owner_name || house.owner_id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {house.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{house.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        house.shortTerm 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {house.shortTerm ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {house.created_at ? new Date(house.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => fetchHouseDetails(house.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleApproveHouse(house.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectHouse(house.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleDelete('houses', house.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingHouses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending houses to review
              </div>
            )}
          </div>
        </div>

        {/* Approved Houses */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <CheckCircle size={20} />
              Approved Houses ({approvedHouses.length})
            </h3>
            <p className="text-sm text-green-600 mt-1">
              These houses are live and visible to users at{' '}
              <a href="http://localhost:3000/boarding" target="_blank" rel="noopener noreferrer" className="underline">
                localhost:3000/boarding
              </a>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price(lkr)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Short Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvedHouses.map(house => (
                  <tr key={house.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{house.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{house.title}</td>
                    <td className="px-6 py-4 text-sm">{house.owner_name || house.owner_id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {house.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{house.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        house.shortTerm 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {house.shortTerm ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {house.approved_at ? new Date(house.approved_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => fetchHouseDetails(house.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <a
                          href="http://localhost:3000/boarding"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 text-xs"
                        >
                          <ExternalLink size={14} />
                          Live
                        </a>
                        <button
                          onClick={() => handleDelete('houses', house.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {approvedHouses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No approved houses yet
              </div>
            )}
          </div>
        </div>

        {/* Rejected Houses */}
        {rejectedHouses.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b bg-red-50">
              <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <X size={20} />
                Rejected Houses ({rejectedHouses.length})
              </h3>
              <p className="text-sm text-red-600 mt-1">These houses have been rejected</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rejectedHouses.map(house => (
                    <tr key={house.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{house.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{house.title}</td>
                      <td className="px-6 py-4 text-sm">{house.owner_name || house.owner_id}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {house.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600">
                        {house.rejection_reason || 'No reason provided'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => fetchHouseDetails(house.id)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => handleDelete('houses', house.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBoardingHouses = () => {
    const pendingBoardings = boardingHouses.filter(b => b.status === 'pending' || !b.confirmed);
    const confirmedBoardings = boardingHouses.filter(b => b.status === 'confirmed' || b.confirmed);
    
    return (
      <div className="space-y-6">
        {/* Pending Boarding Houses */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-yellow-50">
            <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
              <Clock size={20} />
              Pending Boarding Houses ({pendingBoardings.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingBoardings.map(boarding => (
                  <tr key={boarding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{boarding.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{boarding.title}</td>
                    <td className="px-6 py-4 text-sm">{boarding.owner_name || boarding.owner_id}</td>
                    <td className="px-6 py-4 text-sm">{boarding.city || boarding.location}</td>
                    <td className="px-6 py-4 text-sm">${boarding.price}</td>
                    <td className="px-6 py-4 text-sm">
                      {boarding.created_at ? new Date(boarding.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmBoarding(boarding.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleDelete('boarding-houses', boarding.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingBoardings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending boarding houses to review
              </div>
            )}
          </div>
        </div>

        {/* Confirmed Boarding Houses */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <CheckCircle size={20} />
              Confirmed Boarding Houses ({confirmedBoardings.length})
            </h3>
            <p className="text-sm text-green-600 mt-1">
              These are visible on <a href="http://localhost:3000/boarding" target="_blank" rel="noopener noreferrer" className="underline">localhost:3000/boarding</a>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confirmed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {confirmedBoardings.map(boarding => (
                  <tr key={boarding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{boarding.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{boarding.title}</td>
                    <td className="px-6 py-4 text-sm">{boarding.owner_name || boarding.owner_id}</td>
                    <td className="px-6 py-4 text-sm">{boarding.city || boarding.location}</td>
                    <td className="px-6 py-4 text-sm">${boarding.price}</td>
                    <td className="px-6 py-4 text-sm">
                      {boarding.confirmed_at ? new Date(boarding.confirmed_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <a
                          href="http://localhost:3000/boarding"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                        >
                          <Eye size={14} />
                          View Live
                        </a>
                        <button
                          onClick={() => handleDelete('boarding-houses', boarding.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {confirmedBoardings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No confirmed boarding houses yet
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderComments = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Comments & Replies</h3>
          </div>
          <div className="p-6 space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      <strong>User ID:</strong> {comment.user_id || 'Anonymous'}
                    </p>
                    <p className="mt-2">{comment.message}</p>
                    {comment.reply && (
                      <div className="mt-3 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800">
                          <strong>Admin Reply:</strong> {comment.reply}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setSelectedComment(comment);
                      setReplyModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                    disabled={comment.replied}
                  >
                    <Reply size={14} />
                    {comment.replied ? 'Replied' : 'Reply'}
                  </button>
                  <button
                    onClick={() => handleDelete('comments', comment.id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'owners':
        return renderOwners();
      case 'houses':
        return renderHouses();
      case 'boarding':
        return renderBoardingHouses();
      case 'comments':
        return renderComments();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 mt-20">
          <div className="flex items-center justify-between">
            <h2 className={`font-bold text-xl text-gray-800 ${sidebarOpen ? 'block' : 'hidden'}`}>
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        
        <nav className="mt-8">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                  activeSection === item.id ? 'bg-blue-100 border-r-2 border-blue-500' : ''
                }`}
              >
                <Icon size={20} className={`${activeSection === item.id ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} ${
                  activeSection === item.id ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 mt-20">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      {selectedProfile && (
        <ProfileModal 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
      
      {houseDetailsModalOpen && <HouseDetailsModal />}
      
      {replyModalOpen && <ReplyModal />}
    </div>
  );
};

export default AdminDashboard;