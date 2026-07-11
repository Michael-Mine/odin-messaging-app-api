const { validationResult, matchedData } = require("express-validator");
const validations = require("./validations");
const bcrypt = require("bcryptjs");
const { prisma } = require("../../lib/prisma.js");

const signUpPost = [
  validations.validateName,
  validations.validateUsername,
  validations.validateNewPassword,
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
