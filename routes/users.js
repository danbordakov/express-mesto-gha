const { celebrate, Joi } = require("celebrate");
const userRouter = require("express").Router();

const {
  getAdminUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

userRouter.get("/", getUsers);
userRouter.get("/me", getAdminUser);

userRouter.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

userRouter.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().required().length(24),
    }),
  }),
  getUserById
);

userRouter.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/),
    }),
  }),
  updateUserAvatar
);

module.exports = userRouter;
