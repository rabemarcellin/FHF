const express = require("express");

const userRouter = express.Router();

const { getUserById } = require("../models/User");
const { bearerTokenMiddleware } = require("../middleware/auth");

userRouter.get("/:id", bearerTokenMiddleware, async (req, res) => {
  const userId = req.params.id;
  const user = await getUserById(userId);
  res.json(user);
});

module.exports = userRouter;
