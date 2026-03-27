const express = require('express');
const {
  createEnergy,
  getAllEnergies,
  getEnergyById,
  getEnergiesByUser,
} = require('../controllers/energyController');
const protect = require('../middleware/protect');

const router = express.Router();

// NOTE: /user/:userId must be declared BEFORE /:id to avoid route collision
router.get('/user/:userId', getEnergiesByUser);

router.route('/')
  .get(getAllEnergies)
  .post(protect, createEnergy); // requires auth to create

router.get('/:id', getEnergyById);

module.exports = router;
