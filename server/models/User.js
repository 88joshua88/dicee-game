const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User model — Stray Dog Blog.
 * Extended with profile fields: bio, location, profilePicture.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password by default
    },

    // ── Profile fields ──────────────────────────────────────
    bio:            { type: String, trim: true, maxlength: 500 },
    location:       { type: String, trim: true },
    profilePicture: { type: String }, // Cloudinary URL
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare candidate password against stored hash
userSchema.methods.matchPassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
