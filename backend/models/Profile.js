// backend/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    // This links the profile directly to a specific user in the User collection
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    graduationYear: {
      type: Number,
    },
    company: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    skills: {
      type: [String], // Array of strings (e.g., ['React', 'Node.js'])
      default: [],
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    school: {
      type: String,
      enum: ['Engineering', 'Business', 'Arts', 'Science', 'Medicine', 'Law', 'Other'],
      default: 'Other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);