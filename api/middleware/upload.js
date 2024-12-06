const jwt = require("jsonwebtoken");
const { TEMP_CHUNK_KEY } = require("../helpers/constants");
const { getDatabase } = require("../models/database");

const uploadActiveCollection = getDatabase().collection("upload_active");

const streamMiddleware = (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  next();
};
const uploadMiddleware = async (req, res, next) => {
  try {
    if (
      req.headers["file-name"] &&
      req.headers["part-token"] &&
      req.headers["position"]
    ) {
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error("uploadMiddleware", error);
    res.sendStatus(500);
  }
};
const recoveryTokenMiddleware = (req, res, next) => {
  if (req.headers["recovery-token"]) {
    try {
      jwt.verify(req.headers["recovery-token"], TEMP_CHUNK_KEY);
      next();
    } catch (error) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
};

const trackStreamProgress = async (req, res, next) => {
  let keepConnectionInterval = setInterval(() => {
     res.write("null\n");
  }, 3000)
  
  req.on("data", (chunk) => {
    (async () => {
      try {
        const uploadActive = await uploadActiveCollection.findOne({
          partToken: req.headers["part-token"],
        });

        if (uploadActive) {
          await uploadActiveCollection.updateOne(
            { partToken: req.headers["part-token"] },
            {
              $set: {
                chunkLength: uploadActive.chunkLength + chunk.toString().length,
              },
            }
          );
        }
        res.write(`${chunk.toString().length}\n`);
      } catch (error) {
        console.error("Error processing chunk:", error);
        res.status(500).send("Error processing upload");
      }
    })();
  });

  req.on("end", () => {
    clearInterval(keepConnectionInterval);
  })

  next();
};

module.exports = {
  recoveryTokenMiddleware,
  uploadMiddleware,
  trackStreamProgress,
  streamMiddleware,
};
