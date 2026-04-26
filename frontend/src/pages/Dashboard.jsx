// frontend/src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ events: 0, connections: 0, requests: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, connRes, reqRes] = await Promise.all([
          API.get('/events'),
          API.get('/profiles'),
          API.get('/requests/my-requests')
        ]);
        
        setStats({
          events: eventsRes.data.length,
          connections: connRes.data.length,
          requests: reqRes.data.filter(r => r.status === 'pending').length
        });

        // Get upcoming events
        const upcoming = eventsRes.data.slice(0, 3);
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>

        <div className="container mx-auto px-4 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
              Welcome, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-xl text-blue-200">Ready to connect with your alumni network?</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link to="/events" className="group">
              <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-semibold mb-2">Upcoming Events</p>
                    <h3 className="text-4xl font-bold text-white">{stats.events}</h3>
                  </div>
                  <span className="text-6xl group-hover:scale-125 transition-transform duration-300">📅</span>
                </div>
              </div>
            </Link>

            <Link to="/network" className="group">
              <div className="bg-linear-to-br from-purple-600 to-purple-700 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-semibold mb-2">Alumni Network</p>
                    <h3 className="text-4xl font-bold text-white">{stats.connections}</h3>
                  </div>
                  <span className="text-6xl group-hover:scale-125 transition-transform duration-300">🤝</span>
                </div>
              </div>
            </Link>

            <Link to="/requests" className="group">
              <div className="bg-linear-to-br from-pink-600 to-pink-700 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-200 text-sm font-semibold mb-2">Pending Requests</p>
                    <h3 className="text-4xl font-bold text-white">{stats.requests}</h3>
                  </div>
                  <span className="text-6xl group-hover:scale-125 transition-transform duration-300">📬</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/profile" className="group">
                <button className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                  <span className="text-3xl block mb-2">👤</span>
                  Edit Profile
                </button>
              </Link>

              <Link to="/events" className="group">
                <button className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                  <span className="text-3xl block mb-2">📅</span>
                  Browse Events
                </button>
              </Link>

              <Link to="/network" className="group">
                <button className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                  <span className="text-3xl block mb-2">🔍</span>
                  Find Alumni
                </button>
              </Link>

              <Link to="/chat" className="group">
                <button className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                  <span className="text-3xl block mb-2">💬</span>
                  Send Message
                </button>
              </Link>
            </div>
          </div>

          {/* Upcoming Events Preview */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event._id} className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-20 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-blue-200 text-sm mb-4">{event.description.substring(0, 60)}...</p>
                    <div className="flex items-center text-slate-300 text-sm mb-2">
                      <span>📅</span>
                      <span className="ml-2">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-slate-300 text-sm">
                      <span>📍</span>
                      <span className="ml-2">{event.location}</span>
                    </div>
                    <Link to={`/events/${event._id}`} className="block mt-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-center py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;