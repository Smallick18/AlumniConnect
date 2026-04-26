// frontend/src/pages/Profile.jsx
import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  
  // State for the form fields
  const [formData, setFormData] = useState({
    bio: '',
    company: '',
    designation: '',
    graduationYear: '',
    skills: '',
    linkedinUrl: '',
    school: 'Other',
    profileImage: '',
  });
  const [message, setMessage] = useState('');

  // Fetch the profile as soon as the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/profiles/me');
        if (data) {
          setProfileExists(true);
          // Pre-fill the form with existing data
          setFormData({
            bio: data.bio || '',
            company: data.company || '',
            designation: data.designation || '',
            graduationYear: data.graduationYear || '',
            // Convert skills array back to a comma-separated string for the input box
            skills: data.skills ? data.skills.join(', ') : '', 
            linkedinUrl: data.linkedinUrl || '',
            school: data.school || 'Other',
            profileImage: data.user?.profileImage || '',
          });

          if (data.user?.profileImage || data.user?.role) {
            updateUser({
              ...(data.user.profileImage ? { profileImage: data.user.profileImage } : {}),
              ...(data.user.role ? { role: data.user.role } : {}),
            });
          }
        }
      } catch (error) {
        console.log('No profile found, or error fetching profile.');
        setProfileExists(false);
      }
    };

    fetchProfile();
  }, []); // Empty array means this runs only once when the component mounts

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file selection from device
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Convert the comma-separated skills string into an actual array before sending
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      await API.post('/profiles', { ...formData, skills: skillsArray });
      if (formData.profileImage) {
        updateUser({ profileImage: formData.profileImage });
      }
      
      setMessage('Profile updated successfully! 🎉');
      setProfileExists(true);
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      setMessage('Failed to update profile.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700 mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          
          <div className="px-6 py-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
              <div className="-mt-24 mb-4 sm:mb-0">
                <img 
                  src={formData.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                  alt="avatar" 
                  className="h-32 w-32 rounded-full border-4 border-slate-800 object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
                <p className="text-slate-400">{user?.email} • {user?.role}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition duration-200"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-900 border border-green-600 text-green-100' : 'bg-red-900 border border-red-600 text-red-100'}`}>
            {message}
          </div>
        )}

        {/* Profile Form */}
        {isEditing ? (
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Your Profile</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-slate-200 file:text-slate-900 file:bg-slate-200 file:px-4 file:py-2 file:rounded-lg file:border-0 file:font-semibold bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-slate-400 text-sm mt-2">Select a photo from your device. If you want, you can also paste an image URL below.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Profile Image URL (optional)</label>
                <input 
                  type="text" 
                  name="profileImage" 
                  value={formData.profileImage} 
                  onChange={handleChange} 
                  placeholder="https://example.com/image.jpg" 
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Bio</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Company</label>
                  <input 
                    type="text" 
                    name="company" 
                    value={formData.company} 
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Designation</label>
                  <input 
                    type="text" 
                    name="designation" 
                    value={formData.designation} 
                    onChange={handleChange}
                    placeholder="Your job title"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Graduation Year</label>
                  <input 
                    type="number" 
                    name="graduationYear" 
                    value={formData.graduationYear} 
                    onChange={handleChange}
                    placeholder="2024"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">School</label>
                  <select 
                    name="school" 
                    value={formData.school} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
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

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">LinkedIn URL</label>
                <input 
                  type="text" 
                  name="linkedinUrl" 
                  value={formData.linkedinUrl} 
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Skills (comma separated)</label>
                <input 
                  type="text" 
                  name="skills" 
                  value={formData.skills} 
                  onChange={handleChange} 
                  placeholder="e.g. React, Node.js, Leadership, Marketing"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full py-3 font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        ) : (
          /* View Mode */
          <div className="space-y-6">
            {/* Bio Section */}
            {formData.bio && (
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">About</h3>
                <p className="text-slate-300 leading-relaxed">{formData.bio}</p>
              </div>
            )}

            {/* Professional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {formData.company && (
                <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Company</h4>
                  <p className="text-2xl font-bold text-white">{formData.company}</p>
                </div>
              )}
              
              {formData.designation && (
                <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Designation</h4>
                  <p className="text-2xl font-bold text-white">{formData.designation}</p>
                </div>
              )}

              {formData.graduationYear && (
                <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Graduation Year</h4>
                  <p className="text-2xl font-bold text-white">{formData.graduationYear}</p>
                </div>
              )}

              {formData.school && (
                <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">School</h4>
                  <p className="text-2xl font-bold text-white">{formData.school}</p>
                </div>
              )}
            </div>

            {/* Skills Section */}
            {formData.skills && (
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {formData.skills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links Section */}
            {formData.linkedinUrl && (
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
                <a
                  href={formData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  🔗 Visit LinkedIn Profile
                </a>
              </div>
            )}

            {/* Empty State */}
            {!profileExists && (
              <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700 text-center">
                <p className="text-slate-400 mb-4">Your profile is empty. Start by adding some information!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;