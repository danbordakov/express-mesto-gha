const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Исследователь",
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator(v) {
          return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/.test(v);
        },
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: { validator: validator.isEmail, message: "Невалидный email" },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
