const service = require("../services/analyticsService");

exports.getAnalytics = async (req, res) => {
  const data = await service.getAnalytics();
  res.json(data);
};