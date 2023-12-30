const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/.test(v);
        },
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("card", cardSchema);
