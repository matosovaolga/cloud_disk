const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const fileUpload = require("express-fileupload");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
// const PORT = process.env.PORT || config.get("serverPort");
const app = express();

const corsMiddleware = require("./middleware/cors.middleware");
const filePathMiddleware = require("./middleware/filepath.middleware");

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
