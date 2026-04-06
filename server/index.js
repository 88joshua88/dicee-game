const express = require('express');
const dotenv  = require('dotenv');
const cors    = require('cors');
const path    = require('path');

// Load environment variables before anything else
dotenv.config();

const connectDB        = require('./config/db');
const { initCloudinary } = require('./config/cloudinary');
const errorHandler     = require('./middleware/errorHandler');

// ── Initialise external services ─────────────────────────────────────────────
connectDB();
initCloudinary();

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api',           require('./routes/health'));
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/energies',  require('./routes/energies'));
app.use('/api/adventures',require('./routes/adventures'));
app.use('/api',           require('./routes/upload'));
app.use('/api/email',     require('./routes/email'));

// ── Serve React build in production ──────────────────────────────────────────
// The client is built to client/dist by `npm run build --prefix client`.
// Express serves those static files and falls back to index.html so that
// React Router can handle client-side navigation.
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  // Any path that didn't match an /api route returns the React shell
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ── Centralised error handler (must be last middleware) ───────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Stray Dog Blog running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
