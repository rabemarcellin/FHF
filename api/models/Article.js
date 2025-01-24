const { getDatabase } = require("./database");

const db = getDatabase();
const articleCollection = db.collection("article");

const getArticles = async () => {
  return await articleCollection.find({}).toArray();
};

const getOneArticle = async (id) => {
  return await articleCollection.findOne({ id: id });
};

const getArticlesByDate = async (date) => {
  // Parse the input date and construct the start and end of the day
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // Query for the range
  const articlesByDate = await articleCollection
    .find({ eventDate: { $gte: startOfDay, $lte: endOfDay } })
    .toArray();

  return articlesByDate;
};

const checkArticlesByDate = async (date) => {
  // Parse the input date and construct the start and end of the day
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // Query to check if at least one article exists in the date range
  const articleExists = await articleCollection.findOne({
    eventDate: { $gte: startOfDay, $lte: endOfDay },
  });

  // Return true if an article is found, false otherwise
  return !!articleExists;
};


const createArticle = async (title, desc, pictures, eventDate, userId) => {
  try {
    const newArticle = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title,
      desc,
      pictures,
      eventDate: new Date(new Date(eventDate).toISOString()),
      userId,
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

const updateArticle = async (id, title, desc, eventDate) => {
  try {
    const articleUpdated = await articleCollection.findOneAndUpdate(
      { id: id },
      {
        $set: {
          title,
          desc,
          eventDate: new Date(eventDate),
        },
      }
    );
    return articleUpdated;
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = {
  getArticles,
  getOneArticle,
  createArticle,
  updateArticle,
  getArticlesByDate,
  checkArticlesByDate
};
