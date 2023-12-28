const userRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getAdminUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

userRouter.get("/users", getUsers);
userRouter.get("/users/me", getAdminUser);
userRouter.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser
);
userRouter.get(
  "/users/:userId",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().alphanum().length(24),
    }),
  }),
  getUserById
);
userRouter.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/
      ),
    }),
  }),
  updateUserAvatar
);

module.exports = userRouter;
