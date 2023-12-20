const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;
require("dotenv").config();

const { PORT, DB_PATH } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_PATH).then(console.log("БД запущена"));

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
