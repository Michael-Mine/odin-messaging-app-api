const { validationResult, matchedData } = require("express-validator");
const validations = require("./validations");
const { prisma } = require("../../lib/prisma.js");

const getProfile = [
  validations.validateUsername,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { username } = matchedData(req);
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          username: true,
          name: true,
          bio: true,
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Incorrect username" });
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json({ message: "Profile retrieval failed" });
    }
  },
];

const updateProfile = [
  validations.validateUsername,
  validations.validateName,
  validations.validateBio,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { username, name, bio } = matchedData(req);

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(400).json({ message: "User profile not found" });
      }

      await prisma.user.update({
        where: { username },
        data: {
          name,
          bio,
        },
      });

      const updatedUser = await prisma.user.findUnique({
        where: { username },
        select: {
          username: true,
          name: true,
          bio: true,
        },
      });

      return res
        .status(200)
        .json({ message: "User profile updated", updatedUser });
    } catch (err) {
      return res.status(400).json({ message: "User profile update failed" });
    }
  },
];

module.exports = {
  getProfile,
  updateProfile,
};
