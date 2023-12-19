const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const bodyParser = require("body-parser");
const cardRouter = require("./routes/cards");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use((req, res, next) => {
  req.user = {
    _id: "6581aa4cd94b67d678453e24", // ID захарден
  };
  next();
});

app.use("/", cardRouter);
app.use("/", userRouter);

app.listen(3000, () => {
  console.log("сервер запущен на порт 3000");
});
