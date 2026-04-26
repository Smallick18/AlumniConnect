// frontend/src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Chat from './pages/Chat';
import DirectChat from './pages/DirectChat';
import Network from './pages/Network';
import PublicProfile from './pages/PublicProfile';
import Requests from './pages/Requests';
import MyConnections from './pages/MyConnections';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar Navigation - Only show for logged in users */}
      {user && <Sidebar />}
      
      {/* Main Content Area */}
      <main className={user ? 'md:ml-64' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes (Require Login) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/:id" 
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <DirectChat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/group-chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/network" 
            element={
              <ProtectedRoute>
                <Network />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/:id" 
            element={
              <ProtectedRoute>
                <PublicProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><MyConnections /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;