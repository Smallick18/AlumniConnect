// frontend/src/pages/Events.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Events = () => {
  const { user } = useContext(AuthContext);
  
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [message, setMessage] = useState('');
  const now = new Date();

  // Fetch all events when the page loads
  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/events');
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Register for event
  const registerForEvent = async (eventId) => {
    try {
      await API.post(`/events/${eventId}/register`);
      fetchEvents(); // Refresh to show updated attendee count
      alert('Successfully registered for the event!');
    } catch (error) {
      alert('Failed to register: ' + error.response?.data?.message);
    }
  };

  // Unregister from event
  const unregisterFromEvent = async (eventId) => {
    try {
      await API.delete(`/events/${eventId}/register`);
      fetchEvents(); // Refresh to show updated attendee count
      alert('Successfully unregistered from the event!');
    } catch (error) {
      alert('Failed to unregister: ' + error.response?.data?.message);
    }
  };

  // Handle form changes for creating a new event
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle creating a new event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/events', formData);
      setMessage('Event created successfully! 🎉');
      setFormData({ title: '', description: '', date: '', location: '' }); // Clear form
      fetchEvents(); // Refresh the event list instantly
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create event.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* LEFT COLUMN: The Event List */}
          <div className="md:col-span-2">
            <h2 className="mb-8 text-4xl font-bold text-white">Events</h2>
            
            {events.length === 0 ? (
              <div className="p-8 bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg text-center text-slate-400">
                <p className="text-lg">No events scheduled yet. Create one or check back later!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const eventDate = new Date(event.date);
                  const isExpired = eventDate < now;
                  const isRegistered = event.attendees?.some(attendee => attendee._id === user._id);
                  const attendeeCount = event.attendees?.length || 0;
                  const isOrganizer = event.organizer._id === user._id || user.role === 'Admin';
                  
                  return (
                    <div key={event._id} className="p-6 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/50">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                        <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${isExpired ? 'bg-red-600 text-red-100' : 'bg-green-600 text-green-100'}`}>
                          {isExpired ? 'Ended' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="text-slate-300 mb-4">{event.description}</p>
                      
                      <div className="flex flex-wrap items-center mb-4 text-sm text-slate-400 gap-4">
                        <span className="flex items-center">
                          📅 {eventDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          📍 {event.location}
                        </span>
                        <span className="flex items-center">
                          👤 {event.organizer?.name}
                        </span>
                        <span className="flex items-center">
                          👥 {attendeeCount} attendees
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link 
                          to={`/events/${event._id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                        >
                          View Details
                        </Link>
                        {!isOrganizer && !isExpired && (
                          isRegistered ? (
                            <button 
                              onClick={() => unregisterFromEvent(event._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition"
                            >
                              Unregister
                            </button>
                          ) : (
                            <button 
                              onClick={() => registerForEvent(event._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
                            >
                              Register
                            </button>
                          )
                        )}
                        {!isOrganizer && isExpired && (
                          <span className="px-4 py-2 rounded font-semibold bg-red-600 text-red-100">Registration Closed</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Create Event Form */}
          <div>
            {user?.role !== 'Student' ? (
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg p-6 shadow-lg md:sticky md:top-6">
                <h3 className="mb-4 text-2xl font-bold text-white">Host an Event</h3>
                
                {message && (
                  <div className={`p-3 mb-4 text-sm rounded font-semibold ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Event Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 bg-blue-700 text-white border border-blue-600 rounded focus:ring-2 focus:ring-yellow-400 placeholder-blue-300" placeholder="e.g. Alumni Networking Dinner" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full p-3 bg-blue-700 text-white border border-blue-600 rounded focus:ring-2 focus:ring-yellow-400 placeholder-blue-300" placeholder="Describe your event..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Date & Time</label>
                    <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className="w-full p-3 bg-blue-700 text-white border border-blue-600 rounded focus:ring-2 focus:ring-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Location / Link</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full p-3 bg-blue-700 text-white border border-blue-600 rounded focus:ring-2 focus:ring-yellow-400 placeholder-blue-300" placeholder="e.g. 123 Main St or Zoom Link" />
                  </div>
                  <button type="submit" className="w-full py-3 font-bold text-blue-600 transition bg-white rounded hover:bg-yellow-100">
                    ✨ Publish Event
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6 bg-blue-900 border-l-4 border-blue-500 rounded-lg">
                <h3 className="font-bold text-white text-lg mb-2">Want to host an event?</h3>
                <p className="text-blue-200 text-sm">Currently, only Alumni and Admins can organize official network events. Connect with organizers to learn more!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Events;