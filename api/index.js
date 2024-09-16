const bodyParser = require("body-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { GridFSBucket } = require("mongodb");
const streamifier = require("streamifier");
const { connectDB, getDatabase } = require("./models/database");
const {
  UPLOAD_BUCKET_NAME,
  TEMP_CHUNK_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("./helpers/constants");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const getChunksLength = (chunks) => {
  return chunks.reduce((acc, curr) => acc + curr.length, 0);
};

app.post("/save", (req, res) => {
  const db = getDatabase();
  const bucket = new GridFSBucket(db, { bucketName: UPLOAD_BUCKET_NAME });

  const tempIds = req.body.temps;

  const chunkPart = cloudinary.uploader.upload_stream(
    {
      resource_type: "video",
    },
    (err, result) => {
      if (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).send("Upload failed");
      }

      console.log("Upload result:", result);
      res.send("Upload successful");
    }
  );

  let chunksReadIterator = 0;
  const chunksLength = tempIds.length;

  tempIds.forEach((chunk) => {
    const retrieveChunk = bucket.openDownloadStreamByName(chunk.signature);

    retrieveChunk.on("data", (chunk) => {
      chunkPart.write(chunk);
    });

    retrieveChunk.on("end", () => {
      chunksReadIterator++;
      if (chunksReadIterator === chunksLength) {
        // When all chunks are read, end the upload stream
        chunkPart.end();
      }
    });

    retrieveChunk.on("error", (err) => {
      console.error("Error reading chunk:", err);
      res.status(500).send("Error reading chunk");
    });
  });
});

app.post("/upload", (req, res) => {
  let videoBuffer = Buffer.alloc(0);
  const chunks = [];
  const signature = "video-signature";
  const chunkIndex = req.headers["chunk-index"];
  const db = getDatabase();
  const bucket = new GridFSBucket(db, { bucketName: UPLOAD_BUCKET_NAME });

  // new document in temp, // add file name later
  const streamTempToken = jwt.sign(
    {
      chunkIndex: chunkIndex,
    },
    TEMP_CHUNK_KEY,
    { expiresIn: "5m" }
  );

  const uploadStream = bucket.openUploadStream(streamTempToken, {
    metadata: {
      chunkIndex: chunkIndex,
      extension: "mp4",
    },
  });

  req.pipe(uploadStream);

  req.on("data", (chunk) => {
    chunks.push(chunk);
    videoBuffer = Buffer.concat([videoBuffer, chunk]);

    const totalUploaded = getChunksLength(chunks);
    res.write(`${totalUploaded}`);
  });

  uploadStream.on("finish", () => {
    // create the temp file here
    res.write(
      JSON.stringify({
        chunkIndex: chunkIndex,
        status: 201,
        signature: streamTempToken,
        message: "Video upload complete",
        totalChunks: getChunksLength(chunks),
      })
    );
    res.end();
  });

  uploadStream.on("error", (error) => {
    console.error(error);
    console.log("taille stream a enresitrer", videoBuffer.length);
    res.write(
      JSON.stringify({
        chunkIndex: chunkIndex,
        status: 500,
        signature: streamTempToken,
        message: "Error processing the upload",
        totalChunks: getChunksLength(chunks),
      })
    );
    res.end();
  });
});

app.listen(3000, async () => {
  console.log("Server running on port 3000.");
  await connectDB();
});
