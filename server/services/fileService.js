const fs = require("fs"); // module for working with file system
const config = require("config");
const File = require("../models/File");

class FileService {
  createDir(file) {
    const filePath = `${process.env.FILE_PATH}/${file.user_id}/${file.path}`;
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(!filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: "File was created" });
        } else {
          return reject({ message: "File already exists" });
        }
      } catch (e) {
        console.log(e);
        return reject({ message: "File error" });
      }
    });
  }

  deleteFile(file) {
    const path = this.getPath(file);
    if (file.type === "dir") {
      fs.rmdirSync(path);
    } else {

      fs.unlinkSync(path);
    }
  }

  getPath(file) {
    return `${process.env.FILE_PATH}/${file.user_id}/${file.path}`;
  }
}

module.exports = new FileService();
