const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const healthRoutes = require('./routes/health');
app.use('/api', healthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`straydog server running on http://localhost:${PORT}`);
});
