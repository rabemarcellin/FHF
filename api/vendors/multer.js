const multer = require("multer");

const { toMessengerStorage, articlePictureStorage } = require("./cloudinary");

const uploadToMessenger = multer({ storage: toMessengerStorage });
const uploadArticlePicture = multer({ storage: articlePictureStorage });

module.exports = {
  uploadToMessenger,
  uploadArticlePicture,
};
