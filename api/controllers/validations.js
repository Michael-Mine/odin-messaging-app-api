const { body } = require("express-validator");

const nameErr = "must be between 1 and 14 characters.";
const emailErr = "must be an email address";
const lengthErr = "must be between 1 and 40 characters.";
const bioErr = "must be 300 characters max.";
const messageErr = "must be between 1 and 1000 characters.";

const validateName = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 14 })
    .withMessage(`Name ${nameErr}`),
];

const validateUsername = [
  body("username")
    .trim()
    .isEmail()
    .withMessage(`Username ${emailErr}`)
    .isLength({ min: 1, max: 40 })
    .withMessage(`Username ${lengthErr}`),
];

const validateUsername2 = [
  body("username2")
    .trim()
    .isEmail()
    .withMessage(`Username ${emailErr}`)
    .isLength({ min: 1, max: 40 })
    .withMessage(`Username ${lengthErr}`),
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

const validateChatCuid = [body("chatCuid").trim()];

const validateChatSubject = [
  body("subject")
    .trim()
    .optional()
    .isLength({ min: 0, max: 40 })
    .withMessage(`Subject ${lengthErr}`),
];

const validateMessageContent = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Message ${messageErr}`),
];

module.exports = {
  validateName,
  validateUsername,
  validateUsername2,
  validatePassword,
  validateNewPassword,
  validateBio,
  validateChatCuid,
  validateChatSubject,
  validateMessageContent,
};
