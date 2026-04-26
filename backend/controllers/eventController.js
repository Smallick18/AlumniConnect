// backend/controllers/eventController.js
const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
const getEvents = async (req, res) => {
  try {
    // Fetch all events and sort them by date (newest/upcoming first)
    // Populate organizer's name so the frontend can display "Hosted by John Doe"
    const events = await Event.find().sort({ date: 1 }).populate('organizer', 'name').populate('attendees', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get a single event
// @route   GET /api/events/:id
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name')
      .populate('attendees', 'name profileImage');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Create a new event
// @route   POST /api/events
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    // Only Alumni and Admins should be able to create events
    if (req.user.role === 'Student') {
      return res.status(403).json({ message: 'Students cannot create events' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      organizer: req.user._id, // Attach the logged-in user's ID
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.attendees.push(req.user._id);
    await event.save();

    res.json({ message: 'Successfully registered for the event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unregister from an event
// @route   DELETE /api/events/:id/register
const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if registered
    const attendeeIndex = event.attendees.indexOf(req.user._id);
    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }

    event.attendees.splice(attendeeIndex, 1);
    await event.save();

    res.json({ message: 'Successfully unregistered from the event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only the organizer or admin can delete the event
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getEvent, createEvent, registerForEvent, unregisterFromEvent, deleteEvent };