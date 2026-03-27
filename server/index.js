const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables before anything else
dotenv.config();

const connectDB = require('./config/db');
const { initCloudinary } = require('./config/cloudinary');
const errorHandler = require('./middleware/errorHandler');

// ── Initialise external services ─────────────────────────────────────────────
connectDB();
initCloudinary();

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Route registration ────────────────────────────────────────────────────────
app.use('/api', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/energies', require('./routes/energies'));
app.use('/api', require('./routes/upload'));
app.use('/api/email', require('./routes/email'));

// ── Centralised error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`EnergeX API running on http://localhost:${PORT}`);
});

