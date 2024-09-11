const jwt = require("jsonwebtoken");
const { TEMP_CHUNK_KEY, UPLOAD_BUCKET_NAME } = require("../helpers/constants");
const { GridFSBucket } = require("mongodb");
const { getDatabase } = require("./database");

const createTempFile = (index, fileName, buffer) => {
  const db = getDatabase();
  const bucket = new GridFSBucket(db, { bucketName: UPLOAD_BUCKET_NAME });
  const payload = {
    fileName: fileName,
    index: index,
  };
  const token = jwt.sign(payload, TEMP_CHUNK_KEY, { expiresIn: "5m" });
  // create the bucket instance here
  return token;
};
