const { response } = require("express");
const User = require("../models/user");
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if ((err.name = "CastError" || "ValidationError")) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({
        message: "На сервере произошла ошибка",
      });
    });
};

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
