const express = require("express");
const jwt = require("jsonwebtoken");

const { TEMP_CHUNK_KEY } = require("../helpers/constants");
const {
  uploadMiddleware,
  trackStreamProgress,
  streamMiddleware,
} = require("../middleware/upload");
const { getDatabase } = require("../models/database");
const { saveStreamToCloudinary } = require("../helper");

const uploadRouter = express.Router();
const partCollection = getDatabase().collection("parts");
const uploadActiveCollection = getDatabase().collection("upload_active");

uploadRouter.get("/events", streamMiddleware, async (req, res) => {
  console.log("GET", "/upload/events", new Date().toUTCString());

  const getActiveUploads = async () =>
    await uploadActiveCollection.find({}).toArray();
  res.write(`data: ${JSON.stringify({ status: 200, statusText: "OK" })}\n\n`); // eslint-disable-line no-connection opened`);

  setInterval(() => {
    getActiveUploads().then((activeUploads) => {
      res.write(`data: ${JSON.stringify(activeUploads)}\n\n`);
    });
  }, 2000);
});
// Gestion partie video
uploadRouter.post("/part", async (req, res) => {
  console.log("POST", "/upload/part", new Date().toUTCString());

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

    console.log("new video token", partToken);

    await uploadActiveCollection.insertOne({
      partToken: partToken,
      chunkLength: 0,
      videoSize: videoSize,
    });

    console.log("here after insert it to the database");

    res.json({ partToken: partToken });
  }
});

uploadRouter.post("/part/finish", async (req, res) => {
  console.log("POST", "/upload/part/finish", new Date().toUTCString());

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
  "/stream",
  streamMiddleware,
  uploadMiddleware,
  trackStreamProgress,
  async (req, res) => {
    console.log("POST", "/upload/stream", new Date().toUTCString());

    try {
      const fileName = req.headers["file-name"];
      const position = req.headers["position"];
      const partToken = req.headers["part-token"];
      const cloudinaryVideo = await saveStreamToCloudinary(req);
      const publicId = cloudinaryVideo.public_id;
      const secureUrl = cloudinaryVideo.secure_url;
      console.log(cloudinaryVideo);
      await partCollection.insertOne({
        url: secureUrl,
        publicId: publicId,
        partToken: partToken,
        position: position,
        fileName: fileName,
      });

      res.write(JSON.stringify({ status: 200, statusText: "OK" }));
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading stream video to Cloudinary");
    }
  }
);

module.exports = uploadRouter;
