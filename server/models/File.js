const { model, Schema, ObjectId } = require("mongoose");

const File = new Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
  access_link: {
    type: String,
  },
  size: {
    type: Number,
    default: 0,
  },
  path: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user_id: {
    type: ObjectId,
    ref: "User",
  },
  parent_id: {
    type: ObjectId,
    ref: "File",
  },
  children: [
    {
      type: ObjectId,
      ref: "File",
    },
  ],
});

module.exports = model("File", File);
