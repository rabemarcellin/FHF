const cors = require("cors");
const express = require("express");
const timeout = require("connect-timeout");

const { connectDB } = require("./models/database");
const { PORT } = require("./helpers/constants");

const userRouter = require("./routes/user");
const uploadRouter = require("./routes/upload");
const videoRouter = require("./routes/video");
const authRouter = require("./routes/auth");
const { configCloudinary } = require("./helper");

const app = express();
app.use(timeout("600s"));

app.use(
  cors({
    origin: "*", // specify the allowed origin
    methods: ["GET", "POST", "PUT", "DELETE"], // allow specific methods if needed
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/upload", uploadRouter);
app.use("/video", videoRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}.`);
  await connectDB();
  configCloudinary();
});
