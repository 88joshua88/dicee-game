const express = require('express');
const {
  createArticle,
  getAllArticles,
  getArticlesByUser,
  getArticleById,
  updateArticleMetadata,
  createNewVersion,
} = require('../controllers/articleController');
const protect = require('../middleware/protect');

const router = express.Router();

// IMPORTANT: /user/:userId must come before /:id to avoid route collision
router.get('/user/:userId', getArticlesByUser);

router.route('/')
  .get(getAllArticles)
  .post(protect, createArticle);

router.route('/:id')
  .get(getArticleById)
  .put(protect, updateArticleMetadata);

router.post('/:id/new-version', protect, createNewVersion);

module.exports = router;
