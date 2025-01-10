const { ObjectId } = require("mongodb");
const { getDatabase } = require("./database");

const db = getDatabase();
const users = getDatabase().collection("users");

const getUserById = async (id) => {
  const user = await users.findOne({ _id: new ObjectId(id) });
  return user ? { id: user._id, userName: user.userName } : null;
};

module.exports = { getUserById };
