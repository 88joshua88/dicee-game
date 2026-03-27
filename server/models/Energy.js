const mongoose = require('mongoose');

/**
 * Energy model — the core entity of EnergeX.
 *
 * An Energy is anything a user wants to GIVE or RECEIVE.
 * This single flexible model will later power every marketplace
 * category (services, products, accommodation, events, etc.)
 * through the category field and type-specific metadata.
 */
const energySchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    // "give" = offering something to others
    // "receive" = looking for something from others
    type: {
      type: String,
      enum: ['give', 'receive'],
      required: [true, 'Type must be either "give" or "receive"'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Energy', energySchema);
