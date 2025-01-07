const express = require("express");
const jwt = require("jsonwebtoken");
const { TEMP_CHUNK_KEY } = require("../helpers/constants");

const { getDatabase } = require("../models/database");
const { uploadToMessenger } = require("../vendors/multer");
const { newVideoToMessenger } = require("../models/Messenger");

const uploadRouter = express.Router();
const uploadActiveCollection = getDatabase().collection("upload_active");

// Gestion partie video
uploadRouter.post("/part/new", async (req, res) => {
  console.log("POST", "/messenger/part/new", new Date().toLocaleString());

  const activeUploads = await uploadActiveCollection.find({}).toArray();

  if (activeUploads.length >= 5) {
    res.status(401).json({
      statusText: "Le nombre d'upload est atteing(supérieure à 5)",
    });
  } else {
    const videoSize = req.body.videoSize;
    const partToken = jwt.sign(
      {
        fileName: req.body.videoSize,
      },
      TEMP_CHUNK_KEY
    );

    await uploadActiveCollection.insertOne({
      partToken: partToken,
      chunkLength: 0,
      videoSize: videoSize,
    });

    res.json({ partToken: partToken });
  }
});

uploadRouter.post("/part/end", async (req, res) => {
  console.log("POST", "/messenger/part/end", new Date().toUTCString());

  const partToken = req.body.partToken;
  const videoSize = req.body.videoSize;
  await uploadActiveCollection.updateOne(
    { partToken: partToken },
    { $set: { chunkLength: videoSize } }
  );

  setTimeout(() => {
    uploadActiveCollection.deleteOne({ partToken: partToken });
  }, 1000);
  res.status(200).json({ statusText: "OK" });
});

uploadRouter.post(
  "/upload",
  uploadToMessenger.single("video"),
  async (req, res) => {
    console.log("POST", "/messenger/upload", new Date().toLocaleString());
    try {
      console.log("req", req.file.size, req.file.path);
      const { path } = req.file;
      const { partToken, position, fileName } = req.body;

      const videoName = fileName;
      const token = partToken;
      const isToMessenger = newVideoToMessenger(
        videoName,
        path,
        token,
        position
      );
      if (isToMessenger) {
        res.sendStatus(201);
      } else {
        throw new Error("InsertVideoDBError");
      }
    } catch (error) {
      console.log(
        "[ERROR]",
        "POST",
        "/upload/video",
        new Date().toLocaleString()
      );
      console.error(error.message);
      res.sendStatus(500);
    }
  }
);

module.exports = uploadRouter;
