// frontend/src/pages/Requests.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/requests/my-requests');
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/requests/${id}`, { status });
      // Refresh the list to show updated status
      fetchRequests();
    } catch (error) {
      alert('Failed to update request status');
    }
  };

  if (loading) return <div className="mt-10 text-center">Loading requests...</div>;

  return (
    <div className="container max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Connection Requests</h2>

      {requests.length === 0 ? (
        <div className="p-10 bg-white rounded-lg border border-dashed border-gray-300 text-center text-gray-500">
          No incoming requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={req.sender?.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                  className="w-14 h-14 rounded-full" 
                  alt="sender"
                />
                <div>
                  <h4 className="font-bold text-lg">{req.sender?.name}</h4>
                  <p className="text-sm text-primary font-semibold uppercase tracking-wider">
                    Looking for: {req.requestType}
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-gray-50 p-3 rounded text-sm italic text-gray-700">
                "{req.message}"
              </div>

              <div className="flex gap-2">
                {req.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(req._id, 'accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(req._id, 'rejected')}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span className={`px-4 py-2 rounded font-bold capitalize ${req.status === 'accepted' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;