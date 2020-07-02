let express = require("express");
let router = express.Router();
let auth = require("../middlewares/auth");
let slug = require("slug");
let User = require("../models/user");
let Menu = require("../models/menu");

//creating menu
router.post("/", auth.verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    req.body.menu.author = req.user.userId;

    let menu = await Menu.create(req.body.menu);

    res.json({ menu });
  } catch (error) {
    return next(error);
  }
});

// get single menu item
router.get("/:slug", async (req, res, next) => {
  try {
    let menuItem = await Menu.findOne({ slug: req.params.slug }).populate(
      "author",
      "-password"
    );

    if (!menuItem) {
      res.status(404).json({ success: false, message: "Item not found." });
    }

    res.json({ menuItem });
  } catch (error) {
    return next(error);
  }
});

// updating menu item.
router.put("/:slug", auth.verifyToken, async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);

    req.body.menuItem.slug = slug(req.body.menuItem.dishName, { lower: true });

    let menuItem = await Menu.findOneAndUpdate(
      { slug: req.params.slug },
      req.body.menuItem,
      { new: true }
    ).populate("author", "-password");

    if (!menuItem) {
      res.status(404).json({ success: false, message: "Not found." });
    }

    res.json({ menuItem });
  } catch (error) {
    return next(error);
  }
});

// delete menu item.
router.delete("/:slug", auth.verifyToken, async (req, res, next) => {
  try {
    let menuItem = await Menu.findOneAndRemove({ slug: req.params.slug });

    if (!menuItem) {
      res.status(404).json({ success: false, message: "Not found." });
    }

    res.json({ success: true, message: "Deleted." });
  } catch (error) {
    return next(error);
  }
});

// favorite menu item.
router.post("/:slug/favorite", auth.verifyToken, async (req, res, next) => {
  try {
    let menuItem = await Menu.findOne({ slug: req.params.slug });

    if (!menuItem.favorited.includes(req.user.userId)) {
      let menuItem = await Menu.findOneAndUpdate(
        { slug: req.params.slug },
        { $addToSet: { favorited: req.user.userId } },
        { new: true }
      );

      res.json({ menuItem });
    } else {
      res.json({ success: false, message: "Already favorited this one." });
    }
  } catch (error) {
    return next(error);
  }
});

// unfavorite menu item.
router.delete("/:slug/favorite", auth.verifyToken, async (req, res, next) => {
  try {
    let menuItem = await Menu.findOne({ slug: req.params.slug });

    if (menuItem.favorited.includes(req.user.userId)) {
      let menuItem = await Menu.findOneAndUpdate(
        { slug: req.params.slug },
        { $pull: { favorited: req.user.userId } },
        { new: true }
      );
      res.json({ menuItem });
    } else {
      res.json({ success: false, message: "Already unfavorited this." });
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
