const { MongoClient, ServerApiVersion } = require("mongodb");
const { MONGODB_URL, DB_NAME } = require("../helpers/constants");

const client = new MongoClient(MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to mongodb server");
  } catch (error) {
    console.error(error);
    await client.close();
  }
}

const getClientDB = () => client;

const getDatabase = () => client.db(DB_NAME);

module.exports = {
  connectDB,
  getClientDB,
  getDatabase,
};
