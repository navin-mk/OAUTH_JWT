const authService = require("../services/authService");

// ✅ SIGNUP (FIXED - was missing before)
exports.signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// ✅ LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = await authService.login({
      email,
      password,
      deviceId: req.headers["user-agent"]
    });

    res.cookie("token", data.accessToken, {
      httpOnly: true,
      secure: false // change to true in production
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ✅ REFRESH TOKEN
exports.refresh = async (req, res, next) => {
  try {
    const data = await authService.refresh(
      req.body.token,
      req.headers["user-agent"]
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ✅ LOGOUT
exports.logout = async (req, res, next) => {
  try {
    await authService.logout(
      req.user.id,
      req.headers["user-agent"]
    );
    res.json({ msg: "Logged out" });
  } catch (err) {
    next(err);
  }
};