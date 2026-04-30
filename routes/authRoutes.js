const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  signup,
  login,
  refresh,
  logout
} = require("../controllers/authController");

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register user
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/login", login);

router.post("/refresh", refresh);
router.post("/logout", auth, logout);

module.exports = router;