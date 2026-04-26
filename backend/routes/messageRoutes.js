// backend/routes/messageRoutes.js
const express = require('express');
const { getMessages, getConversation, sendDirectMessage } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Room-based chat
router.route('/:room').get(protect, getMessages);

// Direct chat
router.route('/conversation/:conversationId').get(protect, getConversation);
router.route('/direct').post(protect, sendDirectMessage);

module.exports = router;