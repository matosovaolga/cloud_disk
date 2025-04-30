const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      console.log(token);
      return res.status(401).json({ message: "Auth error: token not found" });
    }

    const decoded = jwt.verify(token, config.get("secretKey"));

    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Auth error" });
  }
};
