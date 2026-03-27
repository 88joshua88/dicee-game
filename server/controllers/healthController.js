/**
 * Health check controller
 * GET /api/health — confirms the API is reachable and responding
 */
const getHealth = (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
};

module.exports = { getHealth };
