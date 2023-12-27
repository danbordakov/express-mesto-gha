const userRouter = require("express").Router();
const {
  getAdminUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

userRouter.get("/users", getUsers);
userRouter.get("/users/me", getAdminUser);
userRouter.patch("/users/me", updateUser);
userRouter.get("/users/:userId", getUserById);
userRouter.patch("/users/me/avatar", updateUserAvatar);

module.exports = userRouter;
