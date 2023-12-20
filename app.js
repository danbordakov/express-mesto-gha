const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const bodyParser = require("body-parser");
const cardRouter = require("./routes/cards");
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb")
  .then(console.log("БД запущена"));

app.use((req, res, next) => {
  req.user = {
    _id: "6581aa4cd94b67d678453e24", // ID захарден
  };
  next();
});

app.use("/", cardRouter);
app.use("/", userRouter);

app.use((err, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({
    message: "Данной страницы не существует",
  });
});

app.listen(3000, () => {
  console.log("Сервер запущен на порт 3000");
});
