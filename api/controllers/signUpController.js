const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const { prisma } = require("../../lib/prisma.js");

const lengthErr = "must be between 1 and 40 characters.";
const emailErr = "must be an email address";

const validateSignUpPost = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage(`Name ${lengthErr}`),
  body("username")
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    .isLength({ min: 1, max: 40 })
    .withMessage(`Email ${lengthErr}`)
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: { username: value },
      });
      if (user) {
        throw new Error("Email is already in use");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage(`password ${lengthErr}`),
  body("passwordCheck").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    } else {
      return true;
    }
  }),
];

const signUpPost = [
  validateSignUpPost,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { name, username, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          username,
          password: hashedPassword,
        },
      });
      console.log("User Created:", user);
      res.json({ message: "user created" });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
];

module.exports = {
  signUpPost,
};
