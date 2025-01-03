require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;
const UPLOAD_BUCKET_NAME = process.env.UPLOAD_BUCKET_NAME;
const TEMP_CHUNK_KEY = process.env.TEMP_CHUNK_KEY;
const AUTH_KEY = process.env.AUTH_KEY;
const AUTH_REFRESH_KEY = process.env.AUTH_REFRESH_KEY;
const CHUNK_KEY = process.env.CHUNK_KEY;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const PORT = process.env.PORT || 3000;
module.exports = {
  MONGODB_URL,
  DB_NAME,
  UPLOAD_BUCKET_NAME,
  TEMP_CHUNK_KEY,
  AUTH_KEY,
  AUTH_REFRESH_KEY,
  CHUNK_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  PORT,
};
