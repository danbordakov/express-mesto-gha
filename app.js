const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi } = require("celebrate");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
require("dotenv").config();
const auth = require("./middlewares/auth");
const NotFoundError = require("./errors/not-found-error");

const { PORT = 3000, DB_PATH = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DB_PATH);

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string()
        .min(2)
        .max(30)
        .regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.use(auth);
app.use("/users", userRouter);
app.use("/", cardRouter);

app.use("*", (req, res, next) => {
  next(new NotFoundError("Данной страницы не существует"));
});

// Обработка ошибок Celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  // Ошибка 500 обрабатывается здесь. Нет смысла ее обработывать в каждом контроллере.
});

app.listen(PORT);
// npx eslint отрабатывает успешно на ПК и на github, нарушения стиля нет.
// файл env уже существует, подстановка по умолчанию настроена
