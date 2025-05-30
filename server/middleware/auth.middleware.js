const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
    
      return res.status(401).json({ message: "Auth error: token not found" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    next();
  } catch (e) {
    console.log('auth err', e);
    return res.status(401).json({ message: "Auth error" });
  }
};
