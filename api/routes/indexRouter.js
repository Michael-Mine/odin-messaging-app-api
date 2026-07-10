const { Router } = require("express");
const indexRouter = Router();

const signUpController = require("../controllers/signUpController");
const authController = require("../controllers/authController");

indexRouter.post("/sign-up", signUpController.signUpPost);
indexRouter.post("/login", authController.loginUser);

// indexRouter.get("/chats");
// indexRouter.post("/message");

// indexRouter.get("/user");
// indexRouter.put("/user");

module.exports = indexRouter;
