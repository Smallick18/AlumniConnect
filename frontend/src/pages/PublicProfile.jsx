// frontend/src/pages/PublicProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- NEW: Modal & Request State ---
  const [showModal, setShowModal] = useState(false);
  const [requestData, setRequestData] = useState({
    requestType: 'mentorship',
    message: ''
  });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get(`/profiles/user/${id}`);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError('Profile not found.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // --- NEW: Handle Sending Request ---
  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      await API.post('/requests', {
        receiverId: id,
        ...requestData
      });
      setStatusMsg({ type: 'success', text: 'Request sent successfully! 🎉' });
      setTimeout(() => {
        setShowModal(false);
        setStatusMsg({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send request.' });
    }
  };

  if (loading) return <div className="mt-10 text-center">Loading...</div>;
  if (error) return <div className="mt-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/network" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 font-semibold">
          ← Back to Directory
        </Link>

        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Banner */}
          <div className="h-40 bg-linear-to-r from-blue-600 to-indigo-600"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar and Header */}
            <div className="flex flex-col md:flex-row md:items-end md:gap-6 -mt-16 mb-8">
              <img 
                src={profile.user?.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                className="w-32 h-32 border-4 border-slate-800 rounded-full bg-white shadow-lg" 
                alt="avatar"
              />
              <div className="mt-4 md:mt-0 flex-1">
                <h1 className="text-4xl font-bold text-white">{profile.user?.name}</h1>
                <p className="text-xl text-blue-300 font-semibold">{profile.designation}</p>
                <p className="text-slate-400">
                  {profile.company && `at ${profile.company}`}
                  {profile.company && profile.graduationYear && ` • `}
                  {profile.graduationYear && `Class of ${profile.graduationYear}`}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="md:mb-0 px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                🤝 Connect
              </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="md:col-span-2 space-y-6">
                {/* Bio */}
                {profile.bio && (
                  <div className="bg-slate-700 bg-opacity-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-3">About</h3>
                    <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="bg-slate-700 bg-opacity-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Info */}
                <div className="bg-slate-700 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Work Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Company</p>
                      <p className="text-white font-semibold">{profile.company || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Designation</p>
                      <p className="text-white font-semibold">{profile.designation || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">School</p>
                      <p className="text-white font-semibold">{profile.school || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Summary */}
              <div className="md:col-span-1">
                <div className="bg-slate-700 bg-opacity-50 rounded-lg p-6 sticky top-6">
                  <h3 className="text-lg font-bold text-white mb-4">Profile Info</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-400 text-xs uppercase font-bold">Role</p>
                      <p className="text-blue-300 font-semibold">{profile.user?.role}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase font-bold">Graduation Year</p>
                      <p className="text-white font-semibold">{profile.graduationYear || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase font-bold">Email</p>
                      <p className="text-white font-semibold break-all text-sm">{profile.user?.email}</p>
                    </div>

                    {/* Links */}
                    <div className="pt-4 border-t border-slate-600">
                      {profile.linkedinUrl && (
                        <a 
                          href={profile.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full px-4 py-2 bg-blue-600 text-white text-center font-bold rounded-lg hover:bg-blue-700 transition mb-2"
                        >
                          LinkedIn Profile
                        </a>
                      )}
                      <button 
                        onClick={() => setShowModal(true)}
                        className="w-full px-4 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition"
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REQUEST MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Connect with {profile.user?.name}</h2>
              
              {statusMsg.text && (
                <div className={`p-3 mb-4 rounded text-sm ${statusMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleSendRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">I am looking for:</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={requestData.requestType}
                    onChange={(e) => setRequestData({...requestData, requestType: e.target.value})}
                  >
                    <option value="mentorship">Mentorship</option>
                    <option value="referral">Job Referral</option>
                    <option value="general">General Connection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Personal Note:</label>
                  <textarea 
                    required
                    className="w-full p-2 border rounded h-32"
                    placeholder="Hi! I'd love to learn more about your journey..."
                    value={requestData.message}
                    onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-200 rounded font-bold">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-primary text-white rounded font-bold hover:bg-blue-700">Send Request</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;