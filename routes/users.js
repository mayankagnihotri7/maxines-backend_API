var express = require("express");
var router = express.Router();
let User = require("../models/user");
let auth = require("../middlewares/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// register form.
router.post("/", async (req, res, next) => {
  try {
    let user = await User.create(req.body.user);
    let token = await auth.generateToken(user);
    res.status(201).json({
      email: user.email,
      username: user.username,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// login
router.post("/login", async (req, res, next) => {
  let { email, password } = req.body.user;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email/password required.",
    });
  }

  try {
    let user = await User.findOne({ email });
    let token = await auth.generateToken(user);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email not registered." });
    }

    if (!user.verifyPassword(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password." });
    }

    res.status(200).json({
      email: user.email,
      username: user.username,
      token,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
