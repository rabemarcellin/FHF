const bodyParser = require("body-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const express = require("express");
const jwt = require("jsonwebtoken");
const { GridFSBucket } = require("mongodb");
const { connectDB, getDatabase } = require("./models/database");
const {
  UPLOAD_BUCKET_NAME,
  TEMP_CHUNK_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("./helpers/constants");
const { split_video } = require("./helper");
const { upload_to_cloudinary } = require("./service");

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
  const temp_ids = req.body.temps;

  const video_parts = split_video(temp_ids);

  video_parts.forEach((video_part) => {
    upload_to_cloudinary(video_part)
      .then((response) => {
        console.log("r ", response);
      })
      .catch((err) => console.log(err));
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
