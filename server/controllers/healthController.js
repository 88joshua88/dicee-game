/**
 * Health check controller
 * Confirms the server is running and accepting requests
 */
const getHealth = (req, res) => {
  res.status(200).json({ message: 'straydog server is running' });
};

module.exports = { getHealth };
