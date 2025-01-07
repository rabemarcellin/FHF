const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
} = require("../helpers/constants");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const toMessengerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "toMessenger", // Dossier dans Cloudinary
    resource_type: "video", // Type de ressource
  },
});

const articlePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "articles",
    resource_type: "image",
  },
});

module.exports = {
  toMessengerStorage,
  articlePictureStorage,
};
