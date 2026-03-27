const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** Generate a signed JWT for a given user id */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * register — POST /api/auth/register
 * Creates a new user and returns a token.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email and password');
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error('An account with that email already exists');
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * login — POST /api/auth/login
 * Authenticates credentials and returns a token.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Explicitly select password (it's excluded by default in the schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * getMe — GET /api/auth/me
 * Returns the currently authenticated user. Protected route.
 */
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
