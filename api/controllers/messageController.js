const { validationResult, matchedData } = require("express-validator");
const validations = require("./validations");
const { prisma } = require("../../lib/prisma.js");

const createMessage = [
  validations.validateUsername,
  validations.validateChatId,
  validations.validateMessageContent,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { username, chatId, content } = matchedData(req);
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(400).json({ message: "User profile not found" });
      }

      const chat = await prisma.chat.findUnique({
        where: { chatId },
      });

      if (!chat) {
        return res.status(400).json({ message: "Chat not found" });
      }

      const message = await prisma.message.create({
        data: {
          senderId: user.id,
          chatId,
          content,
        },
        select: {
          senderId: true,
          chatId: true,
          content: true,
          createdAt: true,
        },
      });

      return res.status(200).json(message);
    } catch (err) {
      return res.status(400).json({ message: "New message failed" });
    }
  },
];

module.exports = {
  createMessage,
};
