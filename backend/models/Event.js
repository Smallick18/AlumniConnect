// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String, // Can be a physical address or a Zoom link
      required: true,
    },
    // We record who created the event (Admin or Alumni)
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);