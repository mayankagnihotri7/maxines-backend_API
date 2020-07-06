var express = require("express");
var router = express.Router();
let User = require("../models/user");
let auth = require("../middlewares/auth");
let nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// register form.
router.post("/", async (req, res, next) => {
  try {
    let user = await User.create(req.body.user);
    let token = await auth.generateToken(user);
    console.log(user, "user here");

    // nodemailer
    let transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASS,
        },
      })
    );

    let verification = Math.random().toString(36).slice(2);

    let mailOptions = {
      from: process.env.GMAIL_ID,
      to: user.email,
      subject: "Verification Code.",
      text: "Use this verification code to verify.",
      html: `<h1>Use this verification code to verify: </h1> ${verification}`,
    };

    req.body.verification = verification;

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.log(err);
      console.log("Message sent: %", info.response);
    });

    res.status(201).json({
      email: user.email,
      username: user.username,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// verification route.
router.post("/:email/verify", async (req, res, next) => {
  
  let user = await User.findOne({ email: req.params.email });
  
  if (user.verification === req.body.verification) {
    let verifiedUser = await User.updateOne(
      { email: email.params.email },
      { isVerified: true },
      { new: true }
    );
    
    res.status(201).json({
      email: verifiedUser.email,
      username: verifiedUser.username,
    });

  } else {
    res.status(401).json({ success: false, message: "Not verified." });
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
