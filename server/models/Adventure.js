const mongoose = require('mongoose');

const momentSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  photo:       { type: String },   // Cloudinary URL
  videoUrl:    { type: String },   // YouTube / Vimeo link
}, { timestamps: true });

const adventureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Motorbike', 'Bicycle', 'Backpacking', 'Car', 'By Foot'],
  },
  featuredImage: { type: String, required: true },
  startLocation: { type: String, required: true, trim: true },
  endLocation:   { type: String, trim: true },
  startDate:     { type: Date, default: Date.now },
  endDate:       { type: Date },
  status:        { type: String, enum: ['active', 'completed'], default: 'active' },
  author:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moments:       [momentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Adventure', adventureSchema);
