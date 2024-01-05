const Card = require("../models/card");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");
const ServerError = require("../errors/server-error");

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new BadRequestError(
          "Переданы некорректные данные при создании карточки"
        );
      } else {
        res.send(card);
      }
    })
    .catch(next(new ServerError("На сервере произошла ошибка")));
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next(new ServerError("На сервере произошла ошибка")));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((cardToFind) => {
      if (!cardToFind) {
        throw new NotFoundError("Указан ID несуществующей карточки");
      }
      if (cardToFind && cardToFind.owner.valueOf() !== req.user._id) {
        throw new ForbiddenError("Указан ID чужой карточки");
      } else {
        Card.deleteOne(cardToFind)
          .then(res.send(cardToFind))
          .catch(() =>
            next(new NotFoundError("Указан ID несуществующей карточки"))
          );
      }
    })
    .catch(next(new ServerError("На сервере произошла ошибка")));
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
      res.send(card);
    })
    .catch(next(new ServerError("На сервере произошла ошибка")));
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
      res.send(card);
    })
    .catch(next(new ServerError("На сервере произошла ошибка")));
};
