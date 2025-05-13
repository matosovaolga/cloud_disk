const fileService = require("../services/fileService");
const fs = require("fs");
const User = require("../models/User");
const File = require("../models/File");
const uuid = require("uuid");
const pathModule = require("path");

function folderExists(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent_id } = req.body;
      const file = new File({ name, type, parent_id, user_id: req.user.id });

      const parentFile = await File.findOne({ _id: parent_id });
      if (!parentFile) {
        file.path = name;
        await fileService.createDir(file);
      } else {
        file.path = `${parentFile.path}/${file.name}`;

        await fileService.createDir(file);
        parentFile.children.push(file._id);
        await parentFile.save();
      }

      await file.save();
      return res.json(file);
    } catch (e) {
      console.log(e);
      if (err.code !== "EEXIST") throw err;
      return res.status(400).json(e);
    }
  }

  async getFiles(req, res) {
    try {
      let { sort } = req.query;

      sort = JSON.parse(sort);

      let files = [];
      switch (sort.label) {
        case "name":
          files = await File.find({
            user_id: req.user.id,
            parent_id: req.query.parent_id,
          }).sort({ name: sort.value });
          break;
        case "type":
          files = await File.find({
            user_id: req.user.id,
            parent_id: req.query.parent_id,
          }).sort({ type: sort.value });
          break;
        case "date":
          files = await File.find({
            user_id: req.user.id,
            parent_id: req.query.parent_id,
          }).sort({ date: sort.value });
          break;

        default:
          files = await File.find({
            user_id: req.user.id,
            parent_id: req.query.parent_id,
          });
      }

      return res.json(files);
    } catch (error) {
      console.log(error);
      if (err.code !== "EEXIST") throw err;
      res.status(500).json({ message: "Can not get files" });
    }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file;
      let path;
      const parent = await File.findOne({
        user_id: req.user.id,
        _id: req.body.parent_id,
      });

      const user = await User.findOne({ _id: req.user.id });
      if (user.usedSpace + file.size > user.diskSpace) {
        return res.status(400).json({ message: "There no space on the disk" });
      }
      user.usedSpace += file.size;

      // Construct path
      if (parent) {
        path = `${process.env.FILE_PATH}/${user._id}/${parent.path}/${file.name}`;
        parent.size += file.size;
      } else {
        path = `${process.env.FILE_PATH}/${user._id}/${file.name}`;
      }

      // Ensure directory exists
      const dir = folderExists(`${process.env.FILE_PATH}/${user._id}`);

      console.log(`${process.env.FILE_PATH}/${user._id}`);
      console.log(dir);

      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(`${process.env.FILE_PATH}/${user._id}`, {
            recursive: true,
          });
        }
      } catch (err) {
        console.error("Error creating directory:", err);
        return res.status(500).json({ message: "Error creating directory" });
      }

      if (fs.existsSync(path)) {
        return res.status(400).json({ message: "File already exists" });
      }

      // Move the file
      await new Promise((resolve, reject) => {
        file.mv(path, (err) => {
          if (err) {
            console.log("File move error:", err);
            return reject(err);
          }
          resolve();
        });
      });

      // Save file record to DB
      const type = file.name.split(".").pop();
      let filePath = file.name;
      if (parent) filePath = `${parent.path}/${file.name}`;

      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: filePath,
        parent_id: parent ? parent._id : null,
        user_id: user._id,
      });

      await dbFile.save();
      if (parent) await parent.save();
      await user.save();

      res.json(dbFile);
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
      return res
        .status(500)
        .json({ message: "Upload error", error: e.message });
    }
  }
 
  async downloadFile(req, res) {
    try {
      const file = await File.findOne({
        _id: req.query.id,
        user_id: req.user.id,
      });

      const path = fileService.getPath(file);

      if (fs.existsSync(path)) {
        return res.download(path, file.name);
      }

      return res.status(400).json({ message: "File not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Download error" });
    }
  }

  async deleteFile(req, res) {
    try {
      const file = await File.findOne({
        _id: req.query.id,
        user_id: req.user.id,
      });

      const parent = await File.findOne({
        user_id: req.user.id,
        _id: file.parent_id,
      });

      const user = await User.findOne({ _id: req.user.id });

      if (parent) {
        parent.size = parent.size - file.size;
      }

      if (!file) {
        return res.status(400).json({ message: "file not found" });
      }

      if (parent) {
        await parent.save();
      }

      fileService.deleteFile(file);

      user.usedSpace = user.usedSpace - file.size;

      await file.deleteOne({
        _id: req.query.id,
        user_id: req.user.id,
      });

      await user.save();

      return res.status(200).json({ message: "File was deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "File error" });
    }
  }

  async searchFile(req, res) {
    try {
      const searchName = req.query.search;
      let files = await File.find({ user_id: req.user.id });
      files = files.filter((file) => file.name.includes(searchName));
      return res.json(files);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Search error" });
    }
  }

  async uploadAvatar(req, res) {
    try {
      const file = req.files.file;
      const user = await User.findById(req.user.id);
      const avatarName = uuid.v4() + ".jpg";
      file.mv(`${process.env.STATIC_PATH}/${avatarName}`);
      user.avatar = avatarName;
      await user.save();
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Upload error" });
    }
  }

  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.user.id);
      fs.unlinkSync(`${process.env.STATIC_PATH}/${user.avatar}`);
      user.avatar = null;
      await user.save();
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Delete avatar error" });
    }
  }
}

module.exports = new FileController();
