const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const fileUpload = require("express-fileupload");
const authRouter = require("./routes/auth.routes");
const cors = require("cors");
const fileRouter = require("./routes/file.routes");
// const PORT = process.env.PORT || config.get("serverPort");
// const corsOptions = {
//   origin: "",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "Origin",
//     "X-Requested-With",
//     "Accept",
//   ],
// };
const app = express();
app.use(cors());

// const corsMiddleware = require("./middleware/cors.middleware");
const filePathMiddleware = require("./middleware/filepath.middleware");

const path = require("path");

app.use(fileUpload({}));
// app.use(corsMiddleware());

app.use(filePathMiddleware(path.resolve(__dirname, "files")));

app.use(express.json());
app.use(express.static("static"));

app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

const start = async () => {
  try {
    mongoose.connect(config.get("dbUrl"));
    app.listen(process.env.PORT, () => {
      console.log(`Server start on port ${process.env.PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

module.exports = app;