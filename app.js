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

const { PORT = 3000, DB_PATH = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DB_PATH).then(console.log("БД запущена"));

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", auth, cardRouter);
app.use("/", auth, userRouter);

app.use((err, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({
    message: "Данной страницы не существует",
  });
});

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
