const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} = require("http2").constants;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res
        .status(HTTP_STATUS_SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: "Указан несуществующий ID пользователя",
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if ((err.name = "CastError" || "ValidationError")) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Указан некорректный ID",
        });
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({
        message: "На сервере произошла ошибка",
      });
    });
};

module.exports.getAdminUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: "Указан несуществующий ID пользователя",
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if ((err.name = "CastError" || "ValidationError")) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Указан некорректный ID",
        });
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({
        message: "На сервере произошла ошибка",
      });
    });
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      password: user.password,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({ message: "Пользователь уже существует" });
    }
    if ((error.name = "CastError" || "ValidationError")) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({
        message: "Переданы некорректные данные при создании пользователя",
      });
    }

    return res.status(HTTP_STATUS_SERVER_ERROR).send({
      message: "На сервере произошла ошибка",
    });
  }
};

//общая функция обновления
function updateUserInfo(field, resEx, reqEx, badRequestMessage) {
  User.findByIdAndUpdate(reqEx.user._id, field, {
    runValidators: true,
    returnDocument: "after",
  })
    .then((user) => resEx.send(user))
    .catch((err) => {
      if ((err.name = "CastError" || "ValidationError")) {
        return resEx
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: badRequestMessage });
      }
      return resEx.status(HTTP_STATUS_SERVER_ERROR).send({
        message: "На сервере произошла ошибка",
      });
    });
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  updateUserInfo(
    { name, about },
    res,
    req,
    "Переданы некорректные данные при обновлении пользователя"
  );
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUserInfo(
    { avatar },
    res,
    req,
    "Переданы некорректные данные при обновлении аватара пользователя"
  );
};
//-------------------------------------------------------------

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(HTTP_STATUS_UNAUTHORIZED)
        .send({ message: "Неправильные почта или пароль1" });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res
        .status(HTTP_STATUS_UNAUTHORIZED)
        .send({ message: "Неправильные почта или пароль2" });
    }
    const token = jwt.sign({ _id: user._id }, "secret-key", {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      maxAge: 3600000000,
      httpOnly: true,
    });
    return res.status(200).send({ token });
  } catch (error) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .send({ message: "Неправильные почта или пароль3" });
  }
};
