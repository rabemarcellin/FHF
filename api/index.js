const cors = require("cors");
const express = require("express");
const { connectDB } = require("./models/database");
const { PORT } = require("./helpers/constants");

const userRouter = require("./routes/user");
const uploadRouter = require("./routes/upload");
const videoRouter = require("./routes/video");
const { configCloudinary } = require("./helper");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/upload", uploadRouter);
app.use("/video", videoRouter);
app.use("/user", userRouter);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}.`);
  await connectDB();
  configCloudinary();
});
