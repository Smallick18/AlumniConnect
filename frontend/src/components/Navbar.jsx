// frontend/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Send them back to login after logging out
  };

  return (
    <nav className="p-4 text-white shadow-md bg-primary">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-xl font-bold tracking-wider">
          AlumniConnect
        </Link>
        
        <div className="space-x-4">
          {user ? (
            // What logged-in users see
            <>
              <span className="mr-4 text-sm font-medium">Hello, {user.name}</span>
              <Link to="/profile" className="hover:text-gray-200">Profile</Link>
              <Link to="/events" className="hover:text-gray-200">Events</Link>
              <Link to="/chat" className="hover:text-gray-200">Networking Chat</Link>
              <Link to="/network" className="hover:text-gray-200">Directory</Link>
              <Link to="/connections" className="hover:text-gray-200">My Connections</Link>
              <Link to="/requests" className="hover:text-gray-200">Requests</Link>
              <button 
                onClick={handleLogout} 
                className="px-3 py-1 font-semibold text-red-600 transition bg-white rounded hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            // What anonymous visitors see
            <>
              <Link to="/login" className="hover:text-gray-200">Login</Link>
              <Link to="/register" className="px-3 py-1 font-semibold text-blue-700 transition bg-white rounded hover:bg-blue-50">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;