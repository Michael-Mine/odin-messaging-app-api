const { body } = require("express-validator");

const emailErr = "must be an email address";
const lengthErr = "must be between 1 and 40 characters.";

const validateName = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage(`Name ${lengthErr}`),
];

const validateUsername = [
  body("username")
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    .isLength({ min: 1, max: 40 })
    .withMessage(`Email ${lengthErr}`),
];

const validatePassword = [
  body("password")
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage(`Password ${lengthErr}`),
];

const validateNewPassword = [
  body("password")
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage(`Password ${lengthErr}`),
  body("passwordCheck").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    } else {
      return true;
    }
  }),
];

module.exports = {
  validateName,
  validateUsername,
  validatePassword,
  validateNewPassword,
};
