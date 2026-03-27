const mongoose = require('mongoose');

/**
 * versionSchema — a single content snapshot of an Article.
 * Articles are immutable after publishing; edits produce new versions.
 * A new version can only be created 30 days after the previous one.
 */
const versionSchema = new mongoose.Schema(
  {
    content:       { type: String, required: true },
    versionNumber: { type: Number, required: true },
    createdAt:     { type: Date, default: Date.now },
  },
  { _id: true }
);

/**
 * Article — a Content-type Energy listing.
 *
 * This is the first fully-implemented Energy sub-type and serves as
 * the template pattern for all future types (Course, Ebook, Video…).
 *
 * Key design decisions:
 *  - featuredImage stores a Cloudinary URL (uploaded before creation)
 *  - versions is an append-only array; direct content editing is forbidden
 *  - Latest version = versions[versions.length - 1]
 */
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    featuredImage: {
      type: String,
      required: [true, 'Featured image is required'],
    },
    // Energy system classification
    category:    { type: String, default: 'content' },
    subcategory: { type: String, default: 'article' },

    // Article-level topic tag (e.g. Education, Technology…)
    articleCategory: { type: String, trim: true },

    price: {
      amount:   { type: Number, required: [true, 'Price amount is required'], min: 0 },
      currency: { type: String, required: [true, 'Currency is required'], default: 'USD' },
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Append-only; version 1 is created on article creation
    versions: {
      type: [versionSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'An article must have at least one version',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
