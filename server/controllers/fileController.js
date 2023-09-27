const fileService = require("../services/fileService");
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

  async fetFiles(req, res) {
    try {
      const files = await File.find({
        user_id: req.user.id,
        parent_id: req.query.parent_id,
      });
      return res.json(files);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Can not get files" });
    }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file;

      const parent = await File.findOne({
        user_id: req.user.id,
        _id: req.body.parent_id,
      });
	  const user = await User.findOne({_id: req.user.id})
	  if(user.usedSpace + file.size > user.diskSpace) {
		return res.status(400).json({message: 'There no space on the disk'});
	  }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Upload error" });
    }
  }
}

module.exports = new FileController();
