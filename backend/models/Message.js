// backend/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    // For room-based chat
    room: {
      type: String,
    },
    // For direct chat
    conversationId: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    senderName: {
      type: String, 
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // This automatically adds 'createdAt' and 'updatedAt'
);

messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
messageSchema.index({ conversationId: 1 });
messageSchema.index({ room: 1 });

module.exports = mongoose.model('Message', messageSchema);