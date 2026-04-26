// backend/routes/requestRoutes.js
const express = require('express');
const { sendRequest, getMyRequests, respondToRequest } = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, sendRequest);

router.route('/my-requests')
  .get(protect, getMyRequests);

router.route('/:id')
  .put(protect, respondToRequest);

module.exports = router;