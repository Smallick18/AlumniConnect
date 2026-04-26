// backend/controllers/requestController.js
const ConnectionRequest = require('../models/Request');

// @desc    Send a new request
// @route   POST /api/requests
const sendRequest = async (req, res) => {
  try {
    const { receiverId, requestType, message } = req.body;

    // Prevent sending a request to yourself
    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({ message: 'You cannot request yourself!' });
    }

    // Check if a request already exists between these two
    const existingRequest = await ConnectionRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already pending.' });
    }

    const newRequest = await ConnectionRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      requestType,
      message,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my incoming requests
// @route   GET /api/requests/my-requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ receiver: req.user._id })
      .populate('sender', 'name profileImage') // See who sent it
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to a request (Accept/Reject)
// @route   PUT /api/requests/:id
const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const request = await ConnectionRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    // Ensure only the receiver can accept/reject
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendRequest, getMyRequests, respondToRequest };