const express = require("express");

require("dotenv").config();
const mongoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const fileUpload = require("express-fileupload");
const app = express();

const PORT = process.env.PORT || 4000;
const corsMiddleware = require("./middleware/cors.middleware");
require('dotenv').config()
app.use(fileUpload({}));
app.use(corsMiddleware);
app.use(express.json());
app.use(express.static("static"));
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

const start = async () => {
  try {
    mongoose
      .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.error("Connection error:", err));;
    app.listen(PORT, () => {
      console.log(`Server start on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
