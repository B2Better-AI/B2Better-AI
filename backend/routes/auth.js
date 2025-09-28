const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');
const { asyncHandler, handleValidationErrors } = require('../middleware/validation');
const { validateRegister, validateLogin, validatePasswordChange, validateProfileUpdate, validatePreferencesUpdate } = require('../validators/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register',
  validateRegister,      // make sure this only validates name, email, password, company, position
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { name, email, password, company, position } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      company,
      position
    });

    // Generate token
    const token = generateToken(user._id);

    // Log activity
    await Activity.createActivity(
      user._id,
      'account_created',
      'Account created',
      'New user registered'
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });
  })
);


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account has been deactivated'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  await user.updateLastLogin();

  // Generate token
  const token = generateToken(user._id);

  // Log activity
  await Activity.createActivity(user._id, 'login', 'User logged in', 'Successful login');

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: user.getPublicProfile()
  });
}));

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user.getPublicProfile()
  });
}));

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, validateProfileUpdate, handleValidationErrors, asyncHandler(async (req, res) => {
  const { name, company, position, phone, location, bio, favoriteCategories } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name || req.user.name,
      company: company || req.user.company,
      position: position || req.user.position,
      phone: phone || req.user.phone,
      location: location || req.user.location,
      bio: bio || req.user.bio,
      favoriteCategories: favoriteCategories || req.user.favoriteCategories
    },
    { new: true, runValidators: true }
  );

  // Log activity
  await Activity.createActivity(req.user._id, 'profile_update', 'Profile updated', 'User updated their profile information');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: user.getPublicProfile()
  });
}));

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
router.put('/preferences', protect, validatePreferencesUpdate, handleValidationErrors, asyncHandler(async (req, res) => {
  const { notifications, privacy, general } = req.body;

  const updateData = {};
  
  if (notifications) {
    updateData['preferences.notifications'] = {
      ...req.user.preferences.notifications,
      ...notifications
    };
  }
  
  if (privacy) {
    updateData['preferences.privacy'] = {
      ...req.user.preferences.privacy,
      ...privacy
    };
  }
  
  if (general) {
    updateData['preferences.general'] = {
      ...req.user.preferences.general,
      ...general
    };
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );

  // Log activity
  await Activity.createActivity(req.user._id, 'settings_updated', 'Preferences updated', 'User updated their preferences');

  res.json({
    success: true,
    message: 'Preferences updated successfully',
    user: user.getPublicProfile()
  });
}));

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', protect, validatePasswordChange, handleValidationErrors, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Log activity
  await Activity.createActivity(req.user._id, 'password_changed', 'Password changed', 'User changed their password');

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, asyncHandler(async (req, res) => {
  // Log activity
  await Activity.createActivity(req.user._id, 'logout', 'User logged out', 'User logged out of the system');

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', protect, asyncHandler(async (req, res) => {
  // Deactivate account instead of deleting
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  // Log activity
  await Activity.createActivity(req.user._id, 'account_deleted', 'Account deactivated', 'User deactivated their account');

  res.json({
    success: true,
    message: 'Account deactivated successfully'
  });
}));

module.exports = router;
