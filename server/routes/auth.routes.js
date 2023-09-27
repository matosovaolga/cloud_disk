const Router = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const fileService = require("../services/fileService");
const File = require("../models/File");

router.post(
  "/registration",
  [
    check("email", "Email required")
      .notEmpty()
      .bail()
      .isEmail()
      .withMessage("Invalid email format"),
    check("name", "Name required")
      .notEmpty()
      .bail()
      .isLength({ min: 3 })
      .withMessage("Length of name should be more than 3 symbols"),

    check("password", "Password can't be empty")
      .notEmpty()
      .bail()
      .isStrongPassword({
        minLength: 3,
        maxLength: 12,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be longer than 3 and shorter than 12, should have one capital letter, one number and one symbol"
      ),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Uncorrect request", errors: errors.mapped() });
      }
      const { email, password, name } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exists` });
      }
      const hashPassword = await bcrypt.hash(password, 8);
      const user = new User({ email, password: hashPassword, name });
      await user.save();
  
      await fileService.createDir(new File({ user_id: user.id, name: "" }));
      return res.json({ message: "User was created successfully" });
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Server error" });
    }
  }
);

router.post(
  "/login",

  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const isPassValid = bcrypt.compareSync(password, user.password);
      if (!isPassValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
        expiresIn: "1h",
      });
      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace,
          avatar: user.avatar,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Server error" });
    }
  }
);

module.exports = router;

router.get("/auth", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
      expiresIn: "1h",
    });
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
