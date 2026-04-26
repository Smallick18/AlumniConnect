// backend/controllers/messageController.js
const Message = require('../models/Message');

// @desc    Get messages for a specific room
// @route   GET /api/messages/:room
const getMessages = async (req, res) => {
  try {
    const { room } = req.params;
    
    // Find all messages matching the room, sort them by oldest to newest
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation for direct chat
// @route   GET /api/messages/conversation/:conversationId
const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a direct message
// @route   POST /api/messages/direct
const sendDirectMessage = async (req, res) => {
  try {
    const { receiverId, text, conversationId } = req.body;
    
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      senderName: req.user.name,
      text,
      conversationId,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, getConversation, sendDirectMessage };