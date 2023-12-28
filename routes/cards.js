const { celebrate, Joi } = require("celebrate");
const cardRouter = require("express").Router();
const {
	deleteCard,
	createCard,
	getCards,
	likeCard,
	dislikeCard,
} = require("../controllers/cards");

cardRouter.get("/cards", getCards);
cardRouter.post(
	"/cards",
	celebrate({
		body: Joi.object().keys({
			name: Joi.string().min(2).max(30).required(),
			link: Joi.string()
				.regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/)
				.required(),
		}),
	}),
	createCard,
);

cardRouter.delete(
	"/cards/:cardId",
	celebrate({
		params: Joi.object().keys({
			cardId: Joi.string().alphanum().length(24),
		}),
	}),
	deleteCard,
);

cardRouter.put(
	"/cards/:cardId/likes",
	celebrate({
		params: Joi.object().keys({
			cardId: Joi.string().alphanum().length(24),
		}),
	}),
	likeCard,
);
cardRouter.delete(
	"/cards/:cardId/likes",
	celebrate({
		params: Joi.object().keys({
			cardId: Joi.string().alphanum().length(24),
		}),
	}),
	dislikeCard,
);

module.exports = cardRouter;
