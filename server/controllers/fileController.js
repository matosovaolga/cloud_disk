const fileService = require("../services/fileService");
const config = require("config");
const fs = require("fs");
const User = require("../models/User");
const File = require("../models/File");

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
      user.usedSpace = user.usedSpace + file.size;

      if (parent) {
        path = `${config.get("filePath")}/${user._id}/${parent.path}/${
          file.name
        }`;
        parent.size += file.size;
      } else {
        path = `${config.get("filePath")}/${user._id}/${file.name}`;
      }

      if (fs.existsSync(path)) {
        return res.status(400).json({ message: "File already exists" });
      }

      file.mv(path);

      const type = file.name.split(".").pop();
      let filePath = file.name;
      if (parent) filePath = `${parent.path}/${file.name}`;

      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: filePath,
        parent_id: parent?._id,
        user_id: user._id,
      });

      await dbFile.save();
      await parent.save();
      await user.save();

      res.json(dbFile);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Upload error" });
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

      if (!file) return res.status(400).json({ message: "File not found" });

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
}

module.exports = new FileController();
