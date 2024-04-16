const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const fileUpload = require("express-fileupload");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const PORT = process.env.PORT || config.get("serverPort");
const app = express();

const corsMiddleware = require("./middleware/cors.middleware");
const filePathMiddleware = require("./middleware/filepath.middleware");
const path = require("path");

app.use(fileUpload({}));
app.use(corsMiddleware);
app.use(filePathMiddleware(path.resolve(__dirname, "files")));

app.use(express.json());
app.use(express.static("static"));
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

app.get("/", (req, res) => res.send("Express on Vercel"));

// app.listen(3000, () => console.log("Server ready on port 3000."));

const start = async () => {
  try {
    mongoose.connect(config.get("dbUrl"));
    app.listen(PORT, () => {
      console.log(`Server start on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

module.exports = app;
