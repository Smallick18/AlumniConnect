// frontend/src/components/Sidebar.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = user ? [
    { path: '/dashboard', label: '🏠 Dashboard', icon: 'dashboard' },
    { path: '/profile', label: '👤 Profile', icon: 'profile' },
    { path: '/network', label: '🤝 Alumni Directory', icon: 'network' },
    { path: '/events', label: '📅 Events', icon: 'events' },
    { path: '/group-chat', label: '👥 Group Chat', icon: 'group-chat' },
    { path: '/chat', label: '💭 Direct Chat', icon: 'chat' },
    { path: '/connections', label: '💬 My Connections', icon: 'connections' },
    { path: '/requests', label: '📬 Requests', icon: 'requests' },
  ] : [];

  return (
    <>
      {/* Hamburger Button for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-3 text-white md:hidden bottom-6 right-6 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-40 transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 text-white">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">AC</span>
            </div>
            <div>
              <div className="font-bold text-lg">AlumniConnect</div>
              <div className="text-xs text-slate-400">v1.0</div>
            </div>
          </Link>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-6 border-b border-slate-700 bg-slate-700 bg-opacity-50">
            <div className="flex items-center space-x-3">
              <img
                src={user.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt="user"
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <p className="text-white font-semibold text-sm">{user.name}</p>
                <p className="text-slate-400 text-xs">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 font-semibold text-red-400 transition-all duration-200 rounded-lg hover:bg-red-600 hover:text-white"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Offset for Desktop */}
      <div className="hidden md:block md:w-64"></div>
    </>
  );
};

export default Sidebar;