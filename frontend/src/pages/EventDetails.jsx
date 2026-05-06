// frontend/src/pages/EventDetails.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const registerForEvent = async () => {
    try {
      await API.post(`/events/${id}/register`);
      fetchEvent(); // Refresh to show updated attendee count
      alert('Successfully registered for the event!');
    } catch (error) {
      alert('Failed to register: ' + error.response?.data?.message);
    }
  };

  const unregisterFromEvent = async () => {
    try {
      await API.delete(`/events/${id}/register`);
      fetchEvent(); // Refresh to show updated attendee count
      alert('Successfully unregistered from the event!');
    } catch (error) {
      alert('Failed to unregister: ' + error.response?.data?.message);
    }
  };

  const deleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await API.delete(`/events/${id}`);
      alert('Event deleted successfully');
      navigate('/events');
    } catch (error) {
      alert('Failed to delete event: ' + error.response?.data?.message);
    }
  };

  const eventDate = event ? new Date(event.date) : null;
  const isExpired = eventDate ? eventDate < new Date() : false;
  const isOrganizer = event?.organizer._id === user._id || user.role === 'Admin';
  const isRegistered = event?.attendees?.some(attendee => attendee._id === user._id);
  const attendeeCount = event?.attendees?.length || 0;

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/events')} 
          className="mb-6 inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition"
        >
          ← Back to Events
        </button>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Loading event details...</p>
          </div>
        ) : !event ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">Event not found.</p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{event.title}</h1>
                  <p className="text-blue-100">Organized by {event.organizer?.name}</p>
                </div>
                {isOrganizer && (
                  <button 
                    onClick={deleteEvent}
                    className="px-6 py-3 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition transform hover:scale-105"
                  >
                    🗑️ Delete Event
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-slate-300 leading-relaxed text-lg">{event.description}</p>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="font-bold text-slate-400 text-sm mb-2">📅 Date</h3>
                  <p className="text-white text-2xl font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-slate-400 text-sm">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="font-bold text-slate-400 text-sm mb-2">📍 Location</h3>
                  <p className="text-white text-2xl font-semibold">{event.location}</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="font-bold text-slate-400 text-sm mb-2">👥 Attendees</h3>
                  <p className="text-white text-2xl font-semibold">{attendeeCount} registered</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="font-bold text-slate-400 text-sm mb-2">🎯 Status</h3>
                  <p className="text-white text-2xl font-semibold">{isExpired ? '⛔ Event Ended' : isRegistered ? '✅ Registered' : '⏳ Not registered'}</p>
                </div>
              </div>

              {/* Registration Section */}
              {!isOrganizer && (
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="font-bold text-white text-lg mb-4">Your Registration</h3>
                  {isExpired ? (
                    <p className="text-red-400 font-semibold">This event has ended and registrations are closed.</p>
                  ) : isRegistered ? (
                    <div className="space-y-4">
                      <p className="text-green-400 font-semibold">✅ You are registered for this event</p>
                      <button 
                        onClick={unregisterFromEvent}
                        className="w-full px-6 py-3 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                      >
                        Cancel Registration
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-slate-300">Register to attend this event</p>
                      <button 
                        onClick={registerForEvent}
                        className="w-full px-6 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition transform hover:scale-105"
                      >
                        Register Now
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Attendees Section */}
              {attendeeCount > 0 && (
                <div>
                  <h3 className="font-bold text-white text-xl mb-4">Attendees ({attendeeCount})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.attendees?.map((attendee) => (
                      <div key={attendee._id} className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-blue-500 transition">
                        <img 
                          src={attendee.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" 
                          alt={attendee.name}
                        />
                        <span className="font-medium text-white">{attendee.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;