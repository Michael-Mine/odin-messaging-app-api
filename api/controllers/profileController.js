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
        return res.status(401).json({ message: "Incorrect username" });
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.status(401).json({ message: "Profile retrieval failed" });
    }
  },
];

module.exports = {
  getProfile,
};
