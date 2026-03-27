const { cloudinary } = require('../config/cloudinary');

/**
 * uploadToCloudinary — uploads a file buffer to Cloudinary.
 *
 * @param {Buffer} fileBuffer  - raw file buffer from multer memoryStorage
 * @param {string} folder      - destination folder in Cloudinary (e.g. "energex/listings")
 * @returns {Promise<{ url: string, public_id: string }>}
 */
const uploadToCloudinary = (fileBuffer, folder = 'energex') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { uploadToCloudinary };
