const { HTTP_STATUS_BAD_REQUEST } = require("http2").constants;
const Card = require("../models/card");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.code === HTTP_STATUS_BAD_REQUEST) {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки"
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
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
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};

// общая функция обновления данных карточки (лайк/дизлайк)
function updateLikeCardInfo(reqEx, resEx, nextEx, like) {
  let addPull = {};
  if (like) {
    addPull = { $addToSet: { likes: reqEx.user._id } };
  } else {
    addPull = { $pull: { likes: reqEx.user._id } };
  }

  Card.findByIdAndUpdate(reqEx.params.cardId, addPull, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Указан несуществующий ID карточки");
      }
      resEx.send(card);
    })
    .catch((err) => {
      if (err.code === HTTP_STATUS_BAD_REQUEST) {
        nextEx(
          new BadRequestError(
            "Переданы некорректные данные для постановки/снятия лайка"
          )
        );
      } else {
        nextEx(err);
      }
    });
}

module.exports.likeCard = (req, res, next) => {
  updateLikeCardInfo(req, res, next, true);
};

module.exports.dislikeCard = (req, res, next) => {
  updateLikeCardInfo(req, res, next, false);
};
