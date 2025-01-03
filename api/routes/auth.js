const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getDatabase } = require("../models/database");
const { AUTH_KEY, AUTH_REFRESH_KEY } = require("../helpers/constants");
const {
  bearerTokenMiddleware,
  refreshTokenMiddleware,
} = require("../middleware/auth");

const users = getDatabase().collection("users");

authRouter.get("/user", bearerTokenMiddleware, async (req, res) => {
  const { userName, role } = req.user;
  res.json({
    userName,
    role,
  });
});

authRouter.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  const userExists = await users.findOne({ userName: userName });

  if (!userExists) {
    res.status(401).json({
      statusText: "User not exists",
    });
  } else {
    const isPasswordMath = await bcrypt.compare(password, userExists.password);
    if (isPasswordMath) {
      const authToken = jwt.sign(
        {
          userName,
          role: userExists.role,
        },
        AUTH_KEY,
        {
          expiresIn: "1d",
        }
      );
      const refreshToken = jwt.sign(
        {
          authToken: authToken,
        },
        AUTH_REFRESH_KEY,
        {
          expiresIn: "7d",
        }
      );
      res.json({
        authToken,
        refreshToken,
      });
    } else {
      res.status(403).json({
        statusText: "Password incorrect.",
      });
    }
  }
});

authRouter.post("/refresh-token", refreshTokenMiddleware, async (req, res) => {
  const newAuthToken = jwt.sign(
    {
      new: true,
    },
    AUTH_KEY,
    { expiresIn: "1d" }
  );

  res.json({
    authToken: newAuthToken,
  });
});

authRouter.post("/sign-up", async (req, res) => {
  const { userName, password } = req.body;
  const role = "user";
  const userExists = await users.findOne({ userName: userName });

  if (userExists) {
    res.status(403).json({ statusText: "User already exists." });
  } else {
    const saltRounds = 10;
    const hashedPassowrd = await bcrypt.hash(password, saltRounds);

    await users.insertOne({
      userName: userName,
      password: hashedPassowrd,
      role: role,
    });

    res.status(201).json({
      userName,
      role,
    });
  }
});

authRouter.post("/sign-up/admin", async (req, res) => {
  const { userName, password } = req.body;
  const role = "admin";

  const userExists = await users.findOne({ userName: userName });

  if (userExists) {
    res.status(403).json({ statusText: "User already exists." });
  } else {
    const saltRounds = 10;
    const hashedPassowrd = await bcrypt.hash(password, saltRounds);

    await users.insertOne({
      userName: userName,
      password: hashedPassowrd,
      role: role,
    });

    res.status(201).json({
      userName,
      role,
    });
  }
});

module.exports = authRouter;
