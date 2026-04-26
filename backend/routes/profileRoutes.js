// backend/routes/profileRoutes.js
const express = require('express');
const { 
  getMyProfile, 
  upsertProfile, 
  getAllProfiles, 
  getProfileByUserId 
} = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getAllProfiles)
  .post(protect, upsertProfile);

router.route('/me').get(protect, getMyProfile);
router.route('/user/:userId').get(protect, getProfileByUserId);

module.exports = router;