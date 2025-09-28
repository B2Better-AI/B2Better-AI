const express = require('express');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/validation');

const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// @desc    Get personalized recommendations from ML service
// @route   GET /api/recommendations
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const retailerId = req.user._id.toString();
  const limit = parseInt(req.query.limit || '6', 10);

  const url = `${ML_SERVICE_URL}/recommendations/${encodeURIComponent(retailerId)}?limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    return res.status(502).json({ success: false, message: 'ML service error' });
  }
  const data = await response.json();
  res.json({ success: true, data });
}));

module.exports = router;


