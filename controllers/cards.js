const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const Card = require("../models/card");

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) =>
      next(
        new BadRequestError(
          "Переданы некорректные данные при создании карточки"
        )
      )
    );
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next());
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).then((card) => {
    if (card.owner.valueOf() != req.user._id) {
      throw new NotFoundError("Не ваша карточка");
    } else {
      Card.findByIdAndDelete(req.params.cardId)
        .then((card) => {
          if (!card) {
            throw new NotFoundError("Указан несуществующий ID карточки");
          }
          return res.send(card);
        })
        .catch((err) =>
          next(new BadRequestError("Указан некорректный ID карточки"))
        );
    }
  });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Указан несуществующий ID карточки");
      }
      return res.send(card);
    })
    .catch((err) =>
      next(
        new BadRequestError("Переданы некорректные данные для постановки лайка")
      )
    );
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Указан несуществующий ID карточки");
      }
      return res.send(card);
    })
    .catch((err) =>
      next(new BadRequestError("Переданы некорректные данные для снятия лайка"))
    );
};
