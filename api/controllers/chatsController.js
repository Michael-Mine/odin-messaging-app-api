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
      });
      if (!user) {
        return res.status(400).json({ message: "User profile not found" });
      }

      const chats = await prisma.chat.findMany({
        where: {
          users: {
            some: {
              username,
            },
          },
        },
        orderBy: [{ lastMessageAt: "desc" }, { id: "desc" }],
        select: {
          subject: true,
          cuid: true,
          lastMessageAt: true,
          users: {
            select: {
              username: true,
              name: true,
              bio: true,
            },
          },
          messages: {
            select: {
              cuid: true,
              createdAt: true,
              content: true,
              sender: {
                select: {
                  name: true,
                  username: true,
                },
              },
            },
          },
        },
      });
      return res.status(200).json(chats);
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
        return res.status(400).json({ message: "User chat creator not found" });
      }

      const user2 = await prisma.user.findUnique({
        where: { username: username2 },
      });

      if (!user2) {
        return res.status(400).json({ message: "Username not found" });
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

      return res.status(200).json({ message: "New chat created" });
    } catch (err) {
      return res.status(400).json({ message: "New chat failed" });
    }
  },
];

const addMember = [
  validations.validateUsername,
  validations.validateUsername2,
  validations.validateChatCuid,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { username, username2, chatCuid } = matchedData(req);
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(400).json({ message: "User chat adder not found" });
      }

      const user2 = await prisma.user.findUnique({
        where: { username: username2 },
      });

      if (!user2) {
        return res.status(400).json({ message: "Username not found" });
      }

      const chat = await prisma.chat.findFirst({
        where: { cuid: chatCuid },
        include: { users: true },
      });

      if (!chat) {
        return res.status(400).json({ message: "Chat not found" });
      }

      if (chat.users.some((item) => item.username === username2)) {
        return res.status(400).json({ message: "User already in group" });
      }

      const chatUpdate = await prisma.chat.update({
        where: { id: chat.id },
        data: {
          users: {
            connect: { id: user2.id },
          },
        },
      });

      return res.status(200).json({ message: "New member added" });
    } catch (err) {
      return res.status(400).json({ message: "New member failed" });
    }
  },
];

const leaveChat = [
  validations.validateUsername,
  validations.validateChatCuid,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { username, chatCuid } = matchedData(req);
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const chat = await prisma.chat.findFirst({
        where: { cuid: chatCuid },
        include: { users: true },
      });

      if (!chat) {
        return res.status(400).json({ message: "Chat not found" });
      }

      if (!chat.users.some((item) => item.username === username)) {
        return res.status(400).json({ message: "User not in chat" });
      }

      const userUpdate = await prisma.user.update({
        where: { id: user.id },
        data: {
          chats: {
            disconnect: { id: chat.id },
          },
        },
      });

      return res.status(200).json({ message: "User left chat" });
    } catch (err) {
      return res.status(400).json({ message: "User leaving chat failed" });
    }
  },
];

module.exports = {
  getUserChats,
  createChat,
  addMember,
  leaveChat,
};
