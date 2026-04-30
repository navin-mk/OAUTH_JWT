const User = require("../models/User");
const redis = require("../config/redis");

exports.getAnalytics = async () => {
  const totalUsers = await User.countDocuments();
  const sessions = await redis.keys("refresh:*");

  return {
    totalUsers,
    activeSessions: sessions.length
  };
};