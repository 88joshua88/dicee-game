const Adventure = require('../models/Adventure');

/** Verify the requesting user owns the adventure */
const assertAuthor = (adventure, userId) => {
  if (adventure.author._id.toString() !== userId.toString()) {
    const err = new Error('Not authorised — you are not the author');
    err.statusCode = 403;
    throw err;
  }
};

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * createAdventure — POST /api/adventures
 */
const createAdventure = async (req, res, next) => {
  try {
    const { title, category, featuredImage, startLocation, endLocation } = req.body;

    if (!title || !category || !featuredImage || !startLocation) {
      res.status(400);
      return next(new Error('Title, category, featured image, and start location are required'));
    }

    const adventure = await Adventure.create({
      title,
      category,
      featuredImage,
      startLocation,
      endLocation: endLocation || undefined,
      author: req.user._id,
    });

    res.status(201).json(adventure);
  } catch (err) {
    next(err);
  }
};

/**
 * getAllAdventures — GET /api/adventures
 * Public browse — returns all adventures sorted newest first.
 */
const getAllAdventures = async (req, res, next) => {
  try {
    const adventures = await Adventure.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(adventures);
  } catch (err) {
    next(err);
  }
};

/**
 * getAdventuresByUser — GET /api/adventures/user/:userId
 */
const getAdventuresByUser = async (req, res, next) => {
  try {
    const adventures = await Adventure.find({ author: req.params.userId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(adventures);
  } catch (err) {
    next(err);
  }
};

/**
 * getAdventureById — GET /api/adventures/:id
 * Returns full adventure including all moment content.
 */
const getAdventureById = async (req, res, next) => {
  try {
    const adventure = await Adventure.findById(req.params.id)
      .populate('author', 'name _id');

    if (!adventure) {
      res.status(404);
      return next(new Error('Adventure not found'));
    }

    res.json(adventure);
  } catch (err) {
    next(err);
  }
};

/**
 * updateAdventure — PUT /api/adventures/:id
 * Update title, category, locations, featured image. Author only.
 */
const updateAdventure = async (req, res, next) => {
  try {
    const adventure = await Adventure.findById(req.params.id);

    if (!adventure) {
      res.status(404);
      return next(new Error('Adventure not found'));
    }

    assertAuthor(adventure, req.user._id);

    const { title, category, featuredImage, startLocation, endLocation } = req.body;
    if (title)         adventure.title         = title;
    if (category)      adventure.category      = category;
    if (featuredImage) adventure.featuredImage  = featuredImage;
    if (startLocation) adventure.startLocation  = startLocation;
    if (endLocation !== undefined) adventure.endLocation = endLocation;

    const updated = await adventure.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * endAdventure — POST /api/adventures/:id/end
 * Marks adventure as completed and records end date.
 */
const endAdventure = async (req, res, next) => {
  try {
    const adventure = await Adventure.findById(req.params.id);

    if (!adventure) {
      res.status(404);
      return next(new Error('Adventure not found'));
    }

    assertAuthor(adventure, req.user._id);

    if (adventure.status === 'completed') {
      res.status(400);
      return next(new Error('Adventure is already completed'));
    }

    adventure.status  = 'completed';
    adventure.endDate = new Date();
    const updated = await adventure.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * addMoment — POST /api/adventures/:id/moments
 */
const addMoment = async (req, res, next) => {
  try {
    const adventure = await Adventure.findById(req.params.id);

    if (!adventure) {
      res.status(404);
      return next(new Error('Adventure not found'));
    }

    assertAuthor(adventure, req.user._id);

    const { title, description, photo, videoUrl } = req.body;

    if (!title || !description) {
      res.status(400);
      return next(new Error('Moment title and description are required'));
    }

    adventure.moments.push({ title, description, photo, videoUrl });
    const updated = await adventure.save();
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * updateMoment — PUT /api/adventures/:id/moments/:momentId
 */
const updateMoment = async (req, res, next) => {
  try {
    const adventure = await Adventure.findById(req.params.id);

    if (!adventure) {
      res.status(404);
      return next(new Error('Adventure not found'));
    }

    assertAuthor(adventure, req.user._id);

    const moment = adventure.moments.id(req.params.momentId);
    if (!moment) {
      res.status(404);
      return next(new Error('Moment not found'));
    }

    const { title, description, photo, videoUrl } = req.body;
    if (title)                   moment.title       = title;
    if (description)             moment.description = description;
    if (photo !== undefined)     moment.photo       = photo;
    if (videoUrl !== undefined)  moment.videoUrl    = videoUrl;

    const updated = await adventure.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * deleteMoment — DELETE /api/adventures/:id/moments/:momentId
 */
const deleteMoment = async (req, res, next) => {
  try {
    const adventure = await Adventure.findById(req.params.id);

    if (!adventure) {
      res.status(404);
      return next(new Error('Adventure not found'));
    }

    assertAuthor(adventure, req.user._id);

    const moment = adventure.moments.id(req.params.momentId);
    if (!moment) {
      res.status(404);
      return next(new Error('Moment not found'));
    }

    adventure.moments.pull({ _id: req.params.momentId });
    await adventure.save();
    res.json({ message: 'Moment deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAdventure,
  getAllAdventures,
  getAdventuresByUser,
  getAdventureById,
  updateAdventure,
  endAdventure,
  addMoment,
  updateMoment,
  deleteMoment,
};
