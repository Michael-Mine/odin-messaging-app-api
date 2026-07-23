const { validationResult, matchedData } = require("express-validator");
const validations = require("./validations");
const { prisma } = require("../../lib/prisma.js");

const createMessage = [
  validations.validateUsername,
  validations.validateChatCuid,
  validations.validateMessageContent,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { username, chatCuid, content } = matchedData(req);
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(400).json({ message: "User profile not found" });
      }

      const chat = await prisma.chat.findFirst({
        where: { cuid: chatCuid },
      });

      if (!chat) {
        return res.status(400).json({ message: "Chat not found" });
      }

      const message = await prisma.message.create({
        data: {
          senderId: user.id,
          chatId: chat.id,
          content,
        },
      });

      await prisma.chat.update({
        where: { id: chat.id },
        data: { lastMessageAt: new Date() },
      });

      return res.status(200).json({ message: "New message created" });
    } catch (err) {
      return res.status(400).json({ message: "New message failed" });
    }
  },
];

module.exports = {
  createMessage,
};
