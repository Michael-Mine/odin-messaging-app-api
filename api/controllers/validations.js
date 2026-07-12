const { body } = require("express-validator");

const emailErr = "must be an email address";
const lengthErr = "must be between 1 and 40 characters.";
const bioErr = "must be 300 characters max.";
const messageErr = "must be between 1 and 1000 characters.";
const intErr = "must be a integer";

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

const validateBio = [
  body("bio")
    .trim()
    .isLength({ min: 0, max: 300 })
    .withMessage(`About ${bioErr}`),
];

const validateChatId = [
  body("chatId").trim().isInt({ min: 1 }).withMessage(`ChatId ${intErr}`),
];

const validateMessageContent = [
  body("content")
    .trim()
    .isLength({ min: 0, max: 1000 })
    .withMessage(`Message ${messageErr}`),
];

module.exports = {
  validateName,
  validateUsername,
  validatePassword,
  validateNewPassword,
  validateBio,
  validateChatId,
  validateMessageContent,
};
