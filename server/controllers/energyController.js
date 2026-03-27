const Energy = require('../models/Energy');

/**
 * createEnergy — POST /api/energies
 * Creates a new energy for the authenticated user.
 */
const createEnergy = async (req, res, next) => {
  try {
    const { title, description, category, type } = req.body;

    if (!title || !description || !category || !type) {
      res.status(400);
      throw new Error('Please provide title, description, category and type');
    }

    const energy = await Energy.create({
      title,
      description,
      category,
      type,
      user: req.user._id,
    });

    // Populate user info for the response
    await energy.populate('user', 'name email');

    res.status(201).json({ success: true, energy });
  } catch (err) {
    next(err);
  }
};

/**
 * getAllEnergies — GET /api/energies
 * Returns all energies with owner name, newest first.
 */
const getAllEnergies = async (req, res, next) => {
  try {
    const energies = await Energy.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, energies });
  } catch (err) {
    next(err);
  }
};

/**
 * getEnergyById — GET /api/energies/:id
 * Returns a single energy with owner info.
 */
const getEnergyById = async (req, res, next) => {
  try {
    const energy = await Energy.findById(req.params.id).populate('user', 'name email');

    if (!energy) {
      res.status(404);
      throw new Error('Energy not found');
    }

    res.status(200).json({ success: true, energy });
  } catch (err) {
    next(err);
  }
};

/**
 * getEnergiesByUser — GET /api/energies/user/:userId
 * Returns all energies for a specific user.
 */
const getEnergiesByUser = async (req, res, next) => {
  try {
    const energies = await Energy.find({ user: req.params.userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, energies });
  } catch (err) {
    next(err);
  }
};

module.exports = { createEnergy, getAllEnergies, getEnergyById, getEnergiesByUser };
