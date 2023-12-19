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
        .send({ message: "Ошибка на стороне сервера" })
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() =>
      res.status(HTTP_STATUS_NOT_FOUND).send({
        message: "Пользователь по указанному ID не найден",
      })
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if ((err.name = "CastError" || "ValidationError")) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Указан некорректный ID",
        });
      } else {
        return res.status(HTTP_STATUS_SERVER_ERROR).send({
          message: "Ошибка на стороне сервера",
        });
      }
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
      } else {
        return res.status(HTTP_STATUS_SERVER_ERROR).send({
          message: "Ошибка на стороне сервера",
        });
      }
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    //образец полей без фронта
    name: "Обновлённое тестовое имя",
    about: "Обновлённое тестовое описание",
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if ((err.name = "CastError" || "ValidationError")) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      } else {
        return res.status(HTTP_STATUS_SERVER_ERROR).send({
          message: "Ошибка на стороне сервера",
        });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    //образец поля аватара без фронта
    avatar: "Обновлённая тестовая ссылка на аватар",
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if ((err.name = "CastError" || "ValidationError")) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      } else {
        return res.status(HTTP_STATUS_SERVER_ERROR).send({
          message: "Ошибка на стороне сервера",
        });
      }
    });
};
