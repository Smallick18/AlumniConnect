// frontend/src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there is no user logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the page they were trying to visit
  return children;
};

export default ProtectedRoute;