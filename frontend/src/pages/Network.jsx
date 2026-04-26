// frontend/src/pages/Network.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Network = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    company: '',
    domain: '',
    year: '',
    school: '',
  });

  // Fetch all profiles when the page loads
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/profiles');
        setProfiles(data || []);
      } catch (error) {
        console.error('Failed to fetch profiles', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Send connection request
  const sendConnectionRequest = async (receiverId) => {
    try {
      await API.post('/requests', {
        receiverId,
        requestType: 'general',
        message: 'I would like to connect with you.',
      });
      alert('Connection request sent! 🎉');
    } catch (error) {
      alert('Failed to send request: ' + error.response?.data?.message);
    }
  };

  // Filter profiles based on search term and filters
  const filteredProfiles = profiles.filter((profile) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = profile.user?.name?.toLowerCase().includes(searchLower);
    const companyMatch = profile.company?.toLowerCase().includes(searchLower);
    const roleMatch = profile.user?.role?.toLowerCase().includes(searchLower);
    
    // Additional filters
    const companyFilter = !filters.company || profile.company?.toLowerCase().includes(filters.company.toLowerCase());
    const domainFilter = !filters.domain || profile.skills?.some(skill => skill.toLowerCase().includes(filters.domain.toLowerCase()));
    const yearFilter = !filters.year || profile.graduationYear?.toString().includes(filters.year);
    const schoolFilter = !filters.school || profile.school?.toLowerCase().includes(filters.school.toLowerCase());
    
    return (nameMatch || companyMatch || roleMatch) && companyFilter && domainFilter && yearFilter && schoolFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Alumni Directory</h1>
          <p className="text-slate-400">Connect with {profiles.length} alumni members from our institution</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search by name, company, or role..."
            className="w-full px-6 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Filter Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Company</label>
              <input
                type="text"
                placeholder="Enter company name"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.company}
                onChange={(e) => setFilters({...filters, company: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Skills/Domain</label>
              <input
                type="text"
                placeholder="Enter skill"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.domain}
                onChange={(e) => setFilters({...filters, domain: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Graduation Year</label>
              <input
                type="text"
                placeholder="Enter year"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">School</label>
              <select
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.school}
                onChange={(e) => setFilters({...filters, school: e.target.value})}
              >
                <option value="">All Schools</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
                <option value="Medicine">Medicine</option>
                <option value="Law">Law</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400 text-lg">Loading alumni profiles...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">No profiles found matching your search.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ company: '', domain: '', year: '', school: '' });
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <div 
                key={profile._id} 
                className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-blue-500 transition flex flex-col"
              >
                {/* Profile Header */}
                <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-slate-700">
                  <img 
                    src={profile.user?.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                    alt="avatar" 
                    className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{profile.user?.name}</h3>
                    <p className="text-sm text-blue-400">{profile.user?.role}</p>
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 mb-6 space-y-3 text-sm">
                  {profile.designation && profile.company && (
                    <div className="text-slate-300">
                      <span className="text-blue-400">💼</span>
                      <span className="ml-2">{profile.designation}</span>
                      <span className="text-slate-500"> at </span>
                      <span className="font-semibold">{profile.company}</span>
                    </div>
                  )}
                  {profile.graduationYear && (
                    <div className="text-slate-300">
                      <span className="text-purple-400">🎓</span>
                      <span className="ml-2">Class of {profile.graduationYear}</span>
                    </div>
                  )}
                  {profile.school && (
                    <div className="text-slate-300">
                      <span className="text-indigo-400">🏫</span>
                      <span className="ml-2">{profile.school}</span>
                    </div>
                  )}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="text-slate-300">
                      <span className="text-green-400">🛠️</span>
                      <span className="ml-2 text-xs">{profile.skills.slice(0, 3).join(', ')}</span>
                      {profile.skills.length > 3 && <span className="text-xs text-slate-500"> +{profile.skills.length - 3}</span>}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link 
                    to={`/user/${profile.user?._id}`} 
                    className="flex-1 py-2 text-center font-semibold text-blue-400 border border-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition"
                  >
                    View Profile
                  </Link>
                  <button 
                    onClick={() => sendConnectionRequest(profile.user?._id)}
                    className="flex-1 py-2 font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition"
                  >
                    + Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Network;