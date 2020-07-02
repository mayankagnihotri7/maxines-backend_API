var express = require("express");
var router = express.Router();
let auth = require("../middlewares/auth");
let User = require("../models/user");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// get user profile
router.get("/api/user", auth.verifyToken, async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);
    res.status(200).json({
      user: {
        user: user.email,
        username: user.username,
        token: req.user.token,
      },
    });
  } catch (error) {
    return next(error);
  }
});

// get profile
router.get("/api/profiles/:username", async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.params.username });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({
      success: true,
      profile: {
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        image: user.image || "",
      },
    });
    
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
