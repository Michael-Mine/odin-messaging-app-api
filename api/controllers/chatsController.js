const { validationResult, matchedData } = require("express-validator");
const validations = require("./validations");
const { prisma } = require("../../lib/prisma.js");

const getUserChats = [
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
        include: {
          chats: {
            include: {
              users: true,
              messages: true,
            },
          },
        },
      });
      //add select for only needed data
      if (!user) {
        return res.status(400).json({ message: "User profile not found" });
      }

      return res.status(200).json(user.chats);
    } catch (err) {
      return res.status(400).json({ message: "Chat retrieval failed" });
    }
  },
];

const createChat = [
  validations.validateUsername,
  validations.validateUsername2,
  validations.validateChatSubject,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { username, username2, subject } = matchedData(req);
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(400).json({ message: "User profile not found" });
      }

      const user2 = await prisma.user.findUnique({
        where: { username: username2 },
      });

      if (!user2) {
        return res.status(400).json({ message: "User2 profile not found" });
      }

      const chat = await prisma.chat.create({
        data: {
          subject,
          users: {
            connect: [
              {
                id: user.id,
              },
              {
                id: user2.id,
              },
            ],
          },
        },
      });

      return res.status(200).json(chat);
    } catch (err) {
      return res.status(400).json({ message: "New chat failed" });
    }
  },
];

module.exports = {
  getUserChats,
  createChat,
};
