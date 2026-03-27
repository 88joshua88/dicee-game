const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');

const router = express.Router();

// Use memory storage — file buffer is passed directly to Cloudinary,
// nothing is written to disk on the server
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// POST /api/upload
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
