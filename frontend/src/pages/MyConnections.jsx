// frontend/src/pages/MyConnections.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const MyConnections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      // Get accepted requests where I'm the sender or receiver
      const { data: sentRequests } = await API.get('/requests/my-requests');
      const { data: receivedRequests } = await API.get('/requests/sent-requests'); // We'll need to add this route
      
      const acceptedConnections = [
        ...sentRequests.filter(req => req.status === 'accepted'),
        ...receivedRequests.filter(req => req.status === 'accepted')
      ];
      
      setConnections(acceptedConnections);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching connections', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) return <div className="mt-10 text-center">Loading connections...</div>;

  return (
    <div className="container max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Connections</h2>

      {connections.length === 0 ? (
        <div className="p-10 bg-white rounded-lg border border-dashed border-gray-300 text-center text-gray-500">
          No connections yet. Start by sending connection requests!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {connections.map((connection) => {
            // Determine the other person (not me)
            const otherPerson = connection.sender._id === connection.receiver._id ? 
              connection.sender : 
              (connection.sender._id === 'my-id' ? connection.receiver : connection.sender);
            
            return (
              <div key={connection._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <img 
                    src={otherPerson?.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                    className="w-16 h-16 rounded-full" 
                    alt="connection"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{otherPerson?.name}</h4>
                    <p className="text-sm text-gray-600">Connected</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyConnections;