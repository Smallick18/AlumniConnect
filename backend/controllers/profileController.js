// backend/controllers/profileController.js
const Profile = require('../models/Profile');
const User = require('../models/User');

const promoteGraduatedUser = async (userId, graduationYear) => {
  if (!graduationYear) return;

  const currentYear = new Date().getFullYear();
  if (Number(graduationYear) <= currentYear) {
    const user = await User.findById(userId);
    if (user && user.role !== 'Alumni') {
      user.role = 'Alumni';
      await user.save();
    }
  }
};

// @desc    Get current user's profile
// @route   GET /api/profiles/me
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name profileImage email');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await promoteGraduatedUser(req.user._id, profile.graduationYear);

    // Re-populate in case the user's role changed in the database
    await profile.populate('user', 'name profileImage email role');

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or Update user profile
// @route   POST /api/profiles
const upsertProfile = async (req, res) => {
  try {
    const { bio, graduationYear, company, designation, skills, linkedinUrl, school, profileImage } = req.body;

    const profileFields = {
      user: req.user._id,
      bio,
      graduationYear,
      company,
      designation,
      skills: skills ? skills.map((skill) => skill.trim()) : [],
      linkedinUrl,
      school,
    };

    // Update user's profileImage if provided
    if (profileImage) {
      await User.findByIdAndUpdate(req.user._id, { profileImage });
    }

    await promoteGraduatedUser(req.user._id, graduationYear);

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    profile = await Profile.create(profileFields);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all profiles (for the directory)
// @route   GET /api/profiles
const getAllProfiles = async (req, res) => {
  try {
    // We populate name, role, and profileImage so the directory looks great
    const profiles = await Profile.find().populate('user', 'name role profileImage');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching profiles' });
  }
};

// @desc    Get a single profile by User ID (for public viewing)
// @route   GET /api/profiles/user/:userId
const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'name email role profileImage');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching user profile' });
  }
};

module.exports = { getMyProfile, upsertProfile, getAllProfiles, getProfileByUserId };