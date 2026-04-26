// backend/routes/eventRoutes.js
const express = require('express');
const { getEvents, getEvent, createEvent, registerForEvent, unregisterFromEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Anyone logged in can view events, but you must be logged in to create one
router.route('/').get(protect, getEvents).post(protect, createEvent);

// Get single event, Delete event
router.route('/:id').get(protect, getEvent).delete(protect, deleteEvent);

// Register/unregister for events
router.route('/:id/register').post(protect, registerForEvent).delete(protect, unregisterFromEvent);

module.exports = router;