const { endianness } = require("os");
const Card = require("../models/card");
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
} = require("http2").constants;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if ((err.name = "ValidationError")) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({
        message: "На сервере произошла ошибка",
      });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) =>
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId).then((card) => {
    if (card.owner.valueOf() != req.user._id) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({
        message: "Не ваша карточка",
      });
    } else {
      Card.findByIdAndDelete(req.params.cardId)
        .then((card) => {
          if (!card) {
            return res.status(HTTP_STATUS_NOT_FOUND).send({
              message: "Указан несуществующий ID карточки",
            });
          }
          return res.send(card);
        })
        .catch((err) => {
          if ((err.name = "CastError")) {
            return res.status(HTTP_STATUS_BAD_REQUEST).send({
              message: "Указан некорректный ID карточки",
            });
          }
          return res.status(HTTP_STATUS_SERVER_ERROR).send({
            message: "На сервере произошла ошибка",
          });
        });
    }
  });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: "Указан несуществующий ID карточки",
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if ((err.name = "CastError")) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({
        message: "На сервере произошла ошибка",
      });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: "Указан несуществующий ID карточки",
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if ((err.name = "CastError")) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные для снятия лайка",
        });
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({
        message: "На сервере произошла ошибка",
      });
    });
};
