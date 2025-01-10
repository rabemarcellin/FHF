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
  console.log("GET", "/auth/user", new Date().toLocaleString("fr-Fr"));
  const user = await users.findOne({ userName: req.user.userName });
  res.json({ id: user._id, userName: user.userName, role: user.role });
});

authRouter.post("/login", async (req, res) => {
  console.log("POST", "/auth/login", new Date().toLocaleString("fr-Fr"));
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
  console.log(
    "POST",
    "/auth/refresh-token",
    new Date().toLocaleString("fr-Fr")
  );
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
  console.log("POST", "/auth/sign-up", new Date().toLocaleString("fr-Fr"));
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
  console.log(
    "POST",
    "/auth/sign-up/admin",
    new Date().toLocaleString("fr-Fr")
  );
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
