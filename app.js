const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const bodyParser = require("body-parser");
const cardRouter = require("./routes/cards");
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb")
  .then(console.log("БД запущена"));

app.use((req, res, next) => {
  req.user = {
    _id: "6582b7ccf4c10ad3fe6c99a6", // ID захарден
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

app.listen(PORT, () => {
  console.log("Сервер запущен");
});
