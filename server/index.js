const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv/config");
const fileUpload = require("express-fileupload");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("static"));

const PORT = process.env.PORT || 4000;


const filePathMiddleware = require("./middleware/filepath.middleware");

const path = require("path");

app.use(fileUpload({}));

app.use(filePathMiddleware(path.resolve(__dirname, "files")));

app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connected");
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log({ err });
  
  });

module.exports = app;
