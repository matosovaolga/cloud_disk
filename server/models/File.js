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
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: "File",
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

module.exports = model("File", File);
