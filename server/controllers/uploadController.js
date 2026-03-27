const { uploadToCloudinary } = require('../utils/uploadHelper');

/**
 * uploadFile — POST /api/upload
 *
 * Accepts a single file via multipart/form-data (field name: "file"),
 * uploads it to Cloudinary, and returns the URL and public_id.
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file provided. Send a file under the "file" field.');
    }

    const { url, public_id } = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      success: true,
      url,
      public_id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadFile };
