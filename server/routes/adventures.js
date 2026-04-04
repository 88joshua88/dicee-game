const express = require('express');
const router  = express.Router();
const protect = require('../middleware/protect');
const {
  createAdventure,
  getAllAdventures,
  getAdventuresByUser,
  getAdventureById,
  updateAdventure,
  endAdventure,
  addMoment,
  updateMoment,
  deleteMoment,
} = require('../controllers/adventureController');

// IMPORTANT: /user/:userId must be declared before /:id
router.get('/user/:userId', getAdventuresByUser);

router.route('/')
  .get(getAllAdventures)
  .post(protect, createAdventure);

router.route('/:id')
  .get(getAdventureById)
  .put(protect, updateAdventure);

router.post('/:id/end', protect, endAdventure);

router.post('/:id/moments', protect, addMoment);

router.route('/:id/moments/:momentId')
  .put(protect, updateMoment)
  .delete(protect, deleteMoment);

module.exports = router;
