// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const schedule = require('node-schedule');

// --- NEW IMPORTS FOR SOCKET.IO ---
const http = require('http');
const { Server } = require('socket.io');

const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const eventRoutes = require('./routes/eventRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message'); // We need the model for Socket.io
const Event = require('./models/Event'); // For auto-deletion
const requestRoutes = require('./routes/requestRoutes');
dotenv.config();
connectDB();

const app = express();

// --- NEW SOCKET.IO SETUP ---
// 1. Create a standard HTTP server using our Express app
const server = http.createServer(app);

// 2. Attach Socket.io to that server and allow CORS for our React frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app's URL
    methods: ["GET", "POST"],
  },
});

// 3. Listen for incoming socket connections
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Listen for a user joining a specific chat room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  // Listen for a message from a user
  socket.on('send_message', async (data) => {
    try {
      // 1. Save the message to MongoDB first
      await Message.create({
        room: data.room,
        conversationId: data.conversationId,
        sender: data.senderId,
        senderName: data.author,
        text: data.message,
      });

      // 2. Broadcast it to everyone else in the room
      socket.to(data.room).emit('receive_message', data);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

// --- AUTO-DELETE EXPIRED EVENTS ---
// Run every hour to check for events that have ended 10 days ago
schedule.scheduleJob('0 * * * *', async () => {
  try {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const result = await Event.deleteMany({ date: { $lt: tenDaysAgo } });
    if (result.deletedCount > 0) {
      console.log(`Auto-deleted ${result.deletedCount} expired events`);
    }
  } catch (error) {
    console.error('Error in auto-delete job:', error);
  }
});

// ---------------------------

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/requests', requestRoutes);

const PORT = process.env.PORT || 5000;

// --- CRITICAL CHANGE: USE server.listen INSTEAD OF app.listen ---
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});