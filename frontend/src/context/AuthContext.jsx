// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

// Create the Context
export const AuthContext = createContext();

// Create a Provider component to wrap our app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // When the app loads, check if the user is already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);

      const syncUserFromProfile = async () => {
        try {
          const { data } = await API.get('/profiles/me');
          if (data.user?.role || data.user?.profileImage) {
            const updatedUser = { ...storedUser, ...data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
          }
        } catch (error) {
          console.log('Profile sync failed:', error.message);
        }
      };

      syncUserFromProfile();
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    const { data } = await API.post('/users/login', { email, password });
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    setUser(data); // Save user to global state
  };

  // Register function
  const register = async (name, email, password, role) => {
    const { data } = await API.post('/users/register', { name, email, password, role });
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  // Update local user state and localStorage
  const updateUser = (updates) => {
    setUser((prevUser) => {
      const updatedUser = { ...(prevUser || {}), ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};