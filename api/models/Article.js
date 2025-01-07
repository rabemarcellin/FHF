const { getDatabase } = require("./database");

const db = getDatabase();
const articleCollection = db.collection("article");

const getArticles = async () => {
  return await articleCollection.find({}).toArray();
};

const getOneArticle = async (id) => {
  return await articleCollection.findOne({ id: id });
};

const createArticle = async (title, desc, pictures, eventDate) => {
  try {
    const newArticle = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title,
      desc,
      pictures,
      eventDate,
    };
    await articleCollection.insertOne(newArticle);
    return newArticle;
  } catch (error) {
    console.log(error.message);
    return false;
  }

  // todo if article have image, store image to cloudinary, and story url of image in mongodb

  // roadmap, add article video
};

module.exports = { getArticles, getOneArticle, createArticle };
