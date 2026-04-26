// frontend/src/pages/Chat.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const socket = io.connect('http://localhost:5000');

const Chat = () => {
  const { user } = useContext(AuthContext);
  
  const [room, setRoom] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [inRoom, setInRoom] = useState(false);

  // Join room AND fetch history
  const joinRoom = async () => {
    if (room !== '') {
      socket.emit('join_room', room);
      setInRoom(true);

      // --- NEW: Fetch chat history from the database ---
      try {
        const { data } = await API.get(`/messages/${room}`);
        
        // Convert the database format into the format our UI expects
        const formattedHistory = data.map((msg) => ({
          author: msg.senderName,
          message: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        
        setMessageList(formattedHistory);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        senderId: user._id, // <-- NEW: Include the user's ID for the database
        author: user.name,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  };

  const messagesEndRef = useRef(null);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageList]);

  return (
    // ... KEEP ALL YOUR EXISTING HTML/UI CODE HERE ...
    <div className="container max-w-4xl mx-auto mt-10">
      {!inRoom ? (
        // --- ROOM SELECTION SCREEN ---
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-3xl font-bold text-primary">Join a Chat Room</h2>
          <input
            type="text"
            placeholder="Room Name (e.g. 'mentorship')"
            onChange={(e) => setRoom(e.target.value)}
            className="w-full max-w-md p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={joinRoom} className="w-full max-w-md py-3 font-bold text-white transition rounded bg-primary hover:bg-blue-700">
            Join Room
          </button>
        </div>
      ) : (
        // --- ACTIVE CHAT SCREEN ---
        <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4 text-white rounded-t-lg bg-primary">
            <h3 className="text-xl font-bold">Live Chat: #{room}</h3>
          </div>
          
          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messageList.map((msg, index) => (
              <div key={msg._id || index} className={`flex flex-col mb-4 ${msg.author === user.name ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-lg max-w-[70%] ${msg.author === user.name ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  <p>{msg.message}</p>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  <span className="font-bold">{msg.author}</span> • {msg.time}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="flex p-4 border-t border-gray-200">
            <input
              type="text"
              value={currentMessage}
              placeholder="Type a message..."
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button onClick={sendMessage} className="px-6 font-bold text-white transition rounded-r bg-primary hover:bg-blue-700">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;