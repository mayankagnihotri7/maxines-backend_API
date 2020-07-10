let jwt = require("jsonwebtoken");

exports.generateToken = async (user) => {
  try {
    let token = await jwt.sign({ userId: user.id }, "thisisasecret");
    return token;
  } catch (error) {
    return error;
  }
};

exports.verifyToken = async (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1] || "";
  console.log("token................",token)
  try {
    if (token) {
      let payload = await jwt.verify(token, "thisisasecret");
      let user = {
        userId: payload.userId,
        token,
      };
      req.user = user;
      next();
    } else {
      res.status(401).json({ success: false, message: "Unauthenticated." });
    }
  } catch (error) {
    return next(error);
  }
};
