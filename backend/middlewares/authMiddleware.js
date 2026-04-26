// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is logged in
const protect = async (req, res, next) => {
  let token;

  // Tokens are usually sent in the headers as: "Bearer eyJhbGciOi..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from the header (Split splits 'Bearer token' into an array, we take index 1)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID inside the token, but DO NOT return their password
      req.user = await User.findById(decoded.id).select('-password');

      // Move on to the actual controller logic
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware to check if user is an Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an Admin' });
  }
};

module.exports = { protect, admin };