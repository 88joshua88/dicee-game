const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** Generate a signed JWT for a given user id */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/** Shape of user object sent to the client */
const formatUser = (user) => ({
  _id:            user._id,
  name:           user.name,
  email:          user.email,
  bio:            user.bio,
  location:       user.location,
  profilePicture: user.profilePicture,
});

/**
 * register — POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      return next(new Error('Please provide name, email and password'));
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      return next(new Error('An account with that email already exists'));
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({ success: true, token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

/**
 * login — POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    const token = signToken(user._id);
    res.status(200).json({ success: true, token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

/**
 * getMe — GET /api/auth/me
 * Returns the currently authenticated user.
 */
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: formatUser(req.user) });
};

/**
 * updateProfile — PUT /api/auth/profile
 * Updates name, bio, location, and profilePicture.
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location, profilePicture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    if (name)                   user.name           = name.trim();
    if (bio !== undefined)      user.bio            = bio.trim();
    if (location !== undefined) user.location       = location.trim();
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    const updated = await user.save();
    res.json({ success: true, user: formatUser(updated) });
  } catch (err) {
    next(err);
  }
};

/**
 * updatePassword — PUT /api/auth/password
 * Requires current password verification before setting a new one.
 */
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      return next(new Error('Current password and new password are required'));
    }

    if (newPassword.length < 6) {
      res.status(400);
      return next(new Error('New password must be at least 6 characters'));
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Current password is incorrect'));
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile, updatePassword };
