const { validationResult, matchedData } = require("express-validator");
const validations = require("./validations");
const { prisma } = require("../../lib/prisma.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = [
  validations.validateUsername,
  validations.validatePassword,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { username, password } = matchedData(req);
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(401).json({ message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const secret = process.env.JWT_SECRET_USER;
      const token = jwt.sign({ username }, secret, { expiresIn: "7 days" });

      return res.status(200).json({ message: "Auth Passed", token });
    } catch (err) {
      return res.status(401).json({ message: "Auth Failed" });
    }
  },
];

async function verifyTokenUser(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res
      .status(400)
      .json({ message: "Authorisation Failed (no JWT) - Login required" });
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  const secret = process.env.JWT_SECRET_USER;

  jwt.verify(bearerToken, secret, async (err, authData) => {
    if (err) {
      res.status(401).json({
        message: "Authorisation Failed (JWT not matched) - Login again",
      });
    } else {
      req.authData = authData;
      next();
    }
  });
}

module.exports = {
  loginUser,
  verifyTokenUser,
};
