const express = require("express");
const { getDatabase } = require("../models/database");

const partCollection = getDatabase().collection("parts");

const videoRouter = express.Router();

videoRouter.get("/:partToken", async (req, res) => {
  const { partToken } = req.params;
  const videos = await partCollection
    .find({ partToken: partToken })
    .sort({ position: 1 })
    .toArray();
  res.status(200).json({ data: videos });
});

module.exports = videoRouter;
