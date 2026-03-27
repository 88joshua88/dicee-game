const Article = require('../models/Article');

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** Days elapsed since a given date */
const daysSince = (date) =>
  Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Verify the requesting user owns the article */
const assertAuthor = (article, userId) => {
  if (article.author._id.toString() !== userId.toString()) {
    const err = new Error('Not authorised — you are not the author');
    err.statusCode = 403;
    throw err;
  }
};

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * createArticle — POST /api/articles
 * Creates the article and seeds it with version 1.
 */
const createArticle = async (req, res, next) => {
  try {
    const { title, description, featuredImage, articleCategory, price, content } = req.body;

    if (!content || content.length < 500) {
      res.status(400);
      throw new Error('Article content must be at least 500 characters');
    }

    const article = await Article.create({
      title,
      description,
      featuredImage,
      articleCategory,
      price,
      author: req.user._id,
      versions: [{ content, versionNumber: 1, createdAt: new Date() }],
    });

    await article.populate('author', 'name email');

    res.status(201).json({ success: true, article });
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

/**
 * getAllArticles — GET /api/articles
 * Returns all articles, newest first, with author name.
 */
const getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .select('-versions.content'); // omit version content in list views

    res.status(200).json({ success: true, articles });
  } catch (err) {
    next(err);
  }
};

/**
 * getArticlesByUser — GET /api/articles/user/:userId
 * Returns all articles by a specific user. Must be declared before /:id.
 */
const getArticlesByUser = async (req, res, next) => {
  try {
    const articles = await Article.find({ author: req.params.userId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .select('-versions.content');

    res.status(200).json({ success: true, articles });
  } catch (err) {
    next(err);
  }
};

/**
 * getArticleById — GET /api/articles/:id
 * Returns the full article including all version content (for public reading).
 */
const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name email');

    if (!article) {
      res.status(404);
      throw new Error('Article not found');
    }

    res.status(200).json({ success: true, article });
  } catch (err) {
    next(err);
  }
};

/**
 * updateArticleMetadata — PUT /api/articles/:id
 * Updates title, description, featuredImage, price, and articleCategory only.
 * Content cannot be edited — use POST /:id/new-version instead.
 */
const updateArticleMetadata = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) { res.status(404); throw new Error('Article not found'); }
    assertAuthor(article, req.user._id);

    const { title, description, featuredImage, articleCategory, price } = req.body;

    if (title)           article.title           = title;
    if (description)     article.description     = description;
    if (featuredImage)   article.featuredImage   = featuredImage;
    if (articleCategory) article.articleCategory = articleCategory;
    if (price)           article.price           = { ...article.price.toObject(), ...price };

    await article.save();
    await article.populate('author', 'name email');

    res.status(200).json({ success: true, article });
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

/**
 * createNewVersion — POST /api/articles/:id/new-version
 * Appends a new version. Enforces the 30-day rule on the backend.
 */
const createNewVersion = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) { res.status(404); throw new Error('Article not found'); }
    assertAuthor(article, req.user._id);

    const { content } = req.body;
    if (!content || content.length < 500) {
      res.status(400);
      throw new Error('New version content must be at least 500 characters');
    }

    // 30-day rule: check the createdAt of the latest version
    const latestVersion = article.versions[article.versions.length - 1];
    const elapsed = Date.now() - new Date(latestVersion.createdAt).getTime();

    if (elapsed < THIRTY_DAYS_MS) {
      const daysRemaining = 30 - daysSince(latestVersion.createdAt);
      res.status(400);
      throw new Error(`You can create a new version in ${daysRemaining} day(s)`);
    }

    const nextVersionNumber = latestVersion.versionNumber + 1;
    article.versions.push({ content, versionNumber: nextVersionNumber, createdAt: new Date() });
    await article.save();
    await article.populate('author', 'name email');

    res.status(200).json({ success: true, article });
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticlesByUser,
  getArticleById,
  updateArticleMetadata,
  createNewVersion,
};
