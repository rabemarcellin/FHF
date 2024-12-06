const jwt = require("jsonwebtoken");
const { AUTH_KEY, AUTH_REFRESH_KEY } = require("../helpers/constants");

const bearerTokenMiddleware = async (req, res, next) => {
  try {
    if (req.headers["authorization"]) {
      const authorizationHeader = req.headers["authorization"];
      const authToken = authorizationHeader.replace(/^Bearer\s+/, "");
      try {
        jwt.verify(token, AUTH_KEY);
        req.authToken = authToken;
        next();
      } catch (error) {
        console.error("verify bearer token: ", error);
        res.status(401).json({
          statusText: "Token Expired",
        });
      }
    } else {
      res.status(401).json({
        statusText: "Access denied.",
      });
    }
  } catch (error) {
    console.error("error on verify bearer token! ", error);
    res.sendStatus(500);
  }
};

const refreshTokenMiddleware = async (req, res, next) => {
  try {
    if (req.headers["authorization"]) {
      const authorizationHeader = req.headers["authorization"];
      const refreshToken = authorizationHeader.replace(/^Bearer\s+/, "");
      try {
        jwt.verify(refreshToken, AUTH_REFRESH_KEY);
        next();
      } catch (error) {
        console.error("verify refresh token: ", error);
        res.status(401).json({
          statusText: "Token Expired",
        });
      }
    } else {
      res.status(401).json({
        statusText: "Access denied.",
      });
    }
  } catch (error) {
    console.error("error on verify bearer token! ", error);
    res.sendStatus(500);
  }
};

module.exports = { bearerTokenMiddleware, refreshTokenMiddleware };
