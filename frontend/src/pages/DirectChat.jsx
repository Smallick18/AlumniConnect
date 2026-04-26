// frontend/src/pages/DirectChat.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const socket = io.connect('http://localhost:5000');

const DirectChat = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all users for direct messaging
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/profiles');
        const otherUsers = data.filter(profile => profile.user._id !== user._id);
        setUsers(otherUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [user._id]);

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const conversationId = [user._id, selectedUser.user._id].sort().join('_');
          const { data } = await API.get(`/messages/conversation/${conversationId}`);
          setMessages(data || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
        }
      };
      fetchMessages();

      // Join the same socket room to receive live direct messages
      const conversationId = [user._id, selectedUser.user._id].sort().join('_');
      socket.emit('join_room', conversationId);
    }
  }, [selectedUser, user._id]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      const conversationId = [user._id, selectedUser?.user._id].sort().join('_');
      if (data.room === conversationId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [selectedUser, user._id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      setLoading(true);
      const conversationId = [user._id, selectedUser.user._id].sort().join('_');
      const messageData = {
        room: conversationId,
        conversationId,
        senderId: user._id,
        author: user.name,
        message: newMessage,
        createdAt: new Date(),
      };

      socket.emit('send_message', messageData);

      setMessages((prev) => [
        ...prev,
        {
          ...messageData,
          _id: Date.now(),
          sender: user._id,
          senderId: user._id,
          senderName: user.name,
          text: newMessage,
        },
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(profile =>
    profile.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      {/* Users List Sidebar */}
      <div className="w-full md:w-80 bg-slate-800 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col md:max-h-screen">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">💬 Direct Messages</h2>
          <input
            type="text"
            placeholder="🔍 Search users..."
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-slate-400 text-center">No users found</div>
          ) : (
            filteredUsers.map(profile => (
              <button
                key={profile.user._id}
                onClick={() => setSelectedUser(profile)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 border-l-4 ${
                  selectedUser?.user._id === profile.user._id
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-slate-800 border-transparent hover:bg-slate-700'
                }`}
              >
                <img
                  src={profile.user.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                  alt={profile.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{profile.user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{profile.company || 'Not set'}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900 md:min-h-screen">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="md:hidden text-white text-2xl mr-2"
              >
                ←
              </button>
              <img
                src={selectedUser.user.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt={selectedUser.user.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-white">{selectedUser.user.name}</h3>
                <p className="text-xs md:text-sm text-slate-400">
                  {selectedUser.designation && selectedUser.company
                    ? `${selectedUser.designation} at ${selectedUser.company}`
                    : 'Available'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-4xl mb-2">💬</p>
                    <p className="text-slate-400">Start a conversation with {selectedUser.user.name}</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const senderId = msg.senderId || msg.sender;
                  const isMine = senderId === user._id || senderId?.toString() === user._id;
                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-700 text-slate-100 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm wrap-break-word">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="bg-slate-800 border-t border-slate-700 p-4 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-slate-700 text-white text-sm md:text-base rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? '...' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-4">💬</p>
              <p className="text-slate-400 text-lg">Select a user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectChat;