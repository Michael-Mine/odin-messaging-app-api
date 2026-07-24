const { Router } = require("express");
const indexRouter = Router();

const signUpController = require("../controllers/signUpController");
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");
const chatsController = require("../controllers/chatsController");
const messageController = require("../controllers/messageController");

indexRouter.post("/sign-up", signUpController.signUpPost);
indexRouter.post("/login", authController.loginUser);

indexRouter.post(
  "/profile",
  authController.verifyTokenUser,
  profileController.getProfile,
);
indexRouter.put(
  "/profile",
  authController.verifyTokenUser,
  profileController.updateProfile,
);

indexRouter.post(
  "/user-chats",
  authController.verifyTokenUser,
  chatsController.getUserChats,
);

indexRouter.post(
  "/chat",
  authController.verifyTokenUser,
  chatsController.createChat,
);

indexRouter.put(
  "/chat",
  authController.verifyTokenUser,
  chatsController.addMember,
);

indexRouter.delete(
  "/chat",
  authController.verifyTokenUser,
  chatsController.leaveChat,
);

indexRouter.post(
  "/message",
  authController.verifyTokenUser,
  messageController.createMessage,
);

module.exports = indexRouter;
