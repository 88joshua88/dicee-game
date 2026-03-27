const cloudinary = require('cloudinary').v2;

/**
 * initCloudinary — configures the Cloudinary SDK using credentials
 * from environment variables. Must be called before any upload operations.
 */
const initCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

module.exports = { cloudinary, initCloudinary };
