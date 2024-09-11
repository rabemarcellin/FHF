require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;
const UPLOAD_BUCKET_NAME = process.env.UPLOAD_BUCKET_NAME;
const TEMP_CHUNK_KEY = process.env.TEMP_CHUNK_KEY;
const CHUNK_KEY = process.env.CHUNK_KEY;

module.exports = {
  MONGODB_URL,
  DB_NAME,
  UPLOAD_BUCKET_NAME,
  TEMP_CHUNK_KEY,
  CHUNK_KEY,
};
