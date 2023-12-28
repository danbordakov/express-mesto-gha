const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;
require("dotenv").config();
const auth = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const { celebrate, Joi } = require("celebrate");
const { errors } = require("celebrate");

const { PORT = 3000, DB_PATH = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DB_PATH).then(console.log("БД запущена"));

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

app.use("/", cardRouter);
app.use("/", userRouter);

app.use((err, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({
    message: "Данной страницы не существует",
  });
});

//Обработка ошибок Celebrate
app.use(errors());

//Централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(PORT, () => {
  console.log("Сервер запущен");
});
