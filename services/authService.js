const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("../config/redis");
const hashToken = require("../utils/hashToken");
const userRepo = require("../repositories/userRepository");
const { io } = require("../socket");

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m"
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d"
  });

exports.login = async ({ email, password, deviceId }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await redis.set(
    `refresh:${user._id}:${deviceId}`,
    hashToken(refreshToken),
    "EX",
    7 * 24 * 60 * 60
  );

  io.emit("user:login", { userId: user._id });

  return { accessToken, refreshToken };
};

exports.refresh = async (token, deviceId) => {
  const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

  const stored = await redis.get(`refresh:${decoded.id}:${deviceId}`);
  if (!stored || stored !== hashToken(token))
    throw new Error("Invalid token");

  const accessToken = generateAccessToken({ _id: decoded.id });
  const newRefresh = generateRefreshToken({ _id: decoded.id });

  await redis.set(
    `refresh:${decoded.id}:${deviceId}`,
    hashToken(newRefresh),
    "EX",
    7 * 24 * 60 * 60
  );

  return { accessToken, refreshToken: newRefresh };
};

exports.logout = async (userId, deviceId) => {
  await redis.del(`refresh:${userId}:${deviceId}`);
};