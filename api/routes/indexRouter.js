const { Router } = require("express");
const indexRouter = Router();

const signUpController = require("../controllers/signUpController");
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");

indexRouter.post("/sign-up", signUpController.signUpPost);
indexRouter.post("/login", authController.loginUser);

indexRouter.get(
  "/profile",
  authController.verifyTokenUser,
  profileController.getProfile,
);
indexRouter.put(
  "/profile",
  authController.verifyTokenUser,
  profileController.updateProfile,
);

// indexRouter.get("/chats");
// indexRouter.post("/message");

module.exports = indexRouter;
