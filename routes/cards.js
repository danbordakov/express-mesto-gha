const cardRouter = require("express").Router();
const {
  deleteCard,
  createCard,
  getCards,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardRouter.get("/cards", getCards);
cardRouter.post("/cards", createCard);
cardRouter.delete("/cards/:cardId", deleteCard);

cardRouter.put("/cards/:cardId/likes", likeCard);
cardRouter.delete("/cards/:cardId/likes", dislikeCard);

module.exports = cardRouter;
