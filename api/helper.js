const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("./helpers/constants");

const configCloudinary = () => {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
};

const saveStreamToCloudinary = async (stream) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.pipe(uploadStream);
  });
};

module.exports = { saveStreamToCloudinary, configCloudinary };
