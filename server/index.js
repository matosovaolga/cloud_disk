const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const fileUpload = require("express-fileupload");
const authRouter = require("./routes/auth.routes");
// const cors = require("cors");
const fileRouter = require("./routes/file.routes");

// const corsOptions = {
//   origin: "",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
// };

const app = express();
// app.use(cors());

// app.get("/", cors(), function (req, res, next) {
//   res.json({ msg: "This is CORS-enabled for a Single Route" });
// });

const corsMiddleware = require("./middleware/cors.middleware");
const filePathMiddleware = require("./middleware/filepath.middleware");

const path = require("path");

app.use(fileUpload({}));
app.use(corsMiddleware());

app.use(filePathMiddleware(path.resolve(__dirname, "files")));

app.use(express.json());
app.use(express.static("static"));
// app.options("/", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.sendStatus(204);
// });
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

const start = async () => {
  try {
    mongoose.connect(config.get("dbUrl"));
    app.listen(3000, () => {
      console.log(`Server start on port ${3000}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

module.exports = app;
