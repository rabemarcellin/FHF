const { getDatabase } = require("./database");

const partCollection = getDatabase().collection("parts");

const newVideoToMessenger = async (videoName, path, token, position) => {
  try {
    await partCollection.insertOne({
      url: path,
      partToken: token,
      position: position,
      fileName: videoName,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { newVideoToMessenger };
